import { userQueries } from '../db/queries';
import { emailService } from '../config/email';

export interface User {
  id: number;
  email?: string;
  phone?: string;
  name?: string;
  avatar_url?: string;
  auth_provider?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  token?: string;
}

// Simple token generation (in production, use proper JWT)
function generateToken(userId: number): string {
  const payload = {
    userId,
    timestamp: Date.now(),
  };
  return btoa(JSON.stringify(payload));
}

// Store auth token
export function setAuthToken(token: string) {
  localStorage.setItem('auth_token', token);
}

// Get auth token
export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

// Remove auth token
export function removeAuthToken() {
  localStorage.removeItem('auth_token');
}

// Get current user from token
export function getCurrentUser(): User | null {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token));
    
    // Check if database is initialized before querying
    try {
      const user = userQueries.getUserById(payload.userId);
      if (user) {
        return user;
      }
      // If user not found in DB but token exists, token might be stale
      // But don't clear it immediately - might be DB sync issue
      return null;
    } catch (dbError: any) {
      // Database not ready yet, but token exists
      if (dbError.message?.includes('not initialized')) {
        // Return a minimal user object to prevent logout during hot reload
        // The full user will be loaded when DB is ready
        return {
          id: payload.userId,
          email: undefined,
          name: undefined,
          phone: undefined
        };
      }
      // For other errors, try to return minimal user to prevent logout
      return {
        id: payload.userId,
        email: undefined,
        name: undefined,
        phone: undefined
      };
    }
  } catch {
    return null;
  }
}

// Email/Password Authentication
export async function signUpWithEmail(
  email: string,
  password: string,
  name: string,
  phone?: string
): Promise<AuthResponse> {
  try {
    // Check if user exists
    const db = (await import('../db/database')).getDatabase();
    const existing = db.exec(`SELECT * FROM users WHERE email = '${email.replace(/'/g, "''")}'`);
    
    if (existing.length > 0 && existing[0].values.length > 0) {
      return {
        success: false,
        error: 'Email already registered'
      };
    }

    // Hash password (simple hash for demo - use bcrypt in production)
    const hashedPassword = btoa(password);

    // Create user
    const user = userQueries.createOrGetUser(phone || '', email, name);
    
    // Update with password
    const updateDb = (await import('../db/database')).getDatabase();
    updateDb.run(
      `UPDATE users SET password = ?, auth_provider = 'email' WHERE id = ?`,
      [hashedPassword, user.id]
    );
    (await import('../db/database')).saveDatabase();

    const token = generateToken(user.id);
    setAuthToken(token);

    // Send welcome email
    if (email) {
      emailService.sendWelcomeEmail(email, name).catch(err => {
        console.error('Failed to send welcome email:', err);
      });
    }

    return {
      success: true,
      user: { ...user, email, name },
      token
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Sign up failed'
    };
  }
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const db = (await import('../db/database')).getDatabase();
    const result = db.exec(`SELECT * FROM users WHERE email = '${email.replace(/'/g, "''")}'`);
    
    if (result.length === 0 || result[0].values.length === 0) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    const row = result[0].values[0];
    const storedPassword = row[4]; // password column
    const hashedPassword = btoa(password);

    if (storedPassword !== hashedPassword) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    const user: User = {
      id: row[0],
      phone: row[1],
      email: row[2],
      name: row[3],
      auth_provider: row[6] || 'email'
    };

    const token = generateToken(user.id);
    setAuthToken(token);

    return {
      success: true,
      user,
      token
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Sign in failed'
    };
  }
}

// Google OAuth Authentication
export async function signInWithGoogle(
  googleUser: any
): Promise<AuthResponse> {
  try {
    const profile = googleUser.getBasicProfile();
    const email = profile.getEmail();
    const name = profile.getName();
    const googleId = profile.getId();
    const avatarUrl = profile.getImageUrl();

    const db = (await import('../db/database')).getDatabase();
    
    // Check if user exists by email
    let result = db.exec(`SELECT * FROM users WHERE email = '${email.replace(/'/g, "''")}'`);
    
    let user: User;
    
    if (result.length > 0 && result[0].values.length > 0) {
      // User exists, update Google ID if needed
      const row = result[0].values[0];
      user = {
        id: row[0],
        phone: row[1],
        email: row[2],
        name: row[3] || name,
        avatar_url: avatarUrl,
        auth_provider: 'google'
      };
      
      // Update Google ID
      db.run(
        `UPDATE users SET google_id = ?, auth_provider = 'google', avatar_url = ?, name = ? WHERE id = ?`,
        [googleId, avatarUrl, name, user.id]
      );
    } else {
      // Create new user
      db.run(
        `INSERT INTO users (email, name, google_id, auth_provider, avatar_url) VALUES (?, ?, ?, 'google', ?)`,
        [email, name, googleId, avatarUrl]
      );
      (await import('../db/database')).saveDatabase();
      
      result = db.exec(`SELECT * FROM users WHERE email = '${email.replace(/'/g, "''")}'`);
      const row = result[0].values[0];
      user = {
        id: row[0],
        email: row[2],
        name: row[3],
        avatar_url: row[7],
        auth_provider: 'google'
      };
    }

    (await import('../db/database')).saveDatabase();

    const token = generateToken(user.id);
    setAuthToken(token);

    return {
      success: true,
      user,
      token
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Google sign in failed'
    };
  }
}

// Sign out
export function signOut() {
  removeAuthToken();
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  if (!token) return false;
  
  // If token exists, user is authenticated (even if DB not ready yet)
  // This prevents false negatives during hot reload
  try {
    const user = getCurrentUser();
    return user !== null && user.id !== undefined;
  } catch {
    // If getCurrentUser fails but token exists, still consider authenticated
    // This handles hot reload scenarios where DB might not be ready
    return true;
  }
}

// Generate OTP (6-digit code)
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Request password reset with OTP
export async function requestPasswordResetOTP(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = userQueries.getUserByEmail(email);

    if (!user || user.auth_provider === 'google') {
      // For security, always return success even if user not found or is Google auth
      return { success: true };
    }

    // Generate 6-digit OTP
    const otp = generateOTP();
    const expires = Date.now() + 600000; // 10 minutes expiry

    // Store OTP in database
    const db = (await import('../db/database')).getDatabase();
    db.run(
      `UPDATE users SET password_reset_otp = ?, password_reset_otp_expires = ? WHERE id = ?`,
      [otp, expires, user.id]
    );
    (await import('../db/database')).saveDatabase();

    // Send OTP email
    await emailService.sendPasswordResetOTP(email, otp);

    return { success: true };
  } catch (error: any) {
    console.error('Error requesting password reset OTP:', error);
    return { success: false, error: error.message || 'Failed to request password reset' };
  }
}

// Verify OTP
export async function verifyPasswordResetOTP(email: string, otp: string): Promise<{ success: boolean; error?: string; userId?: number }> {
  try {
    const db = (await import('../db/database')).getDatabase();
    const userResult = db.exec(`SELECT id, password_reset_otp, password_reset_otp_expires FROM users WHERE email = '${email.replace(/'/g, "''")}'`);

    if (userResult.length === 0 || userResult[0].values.length === 0) {
      return { success: false, error: 'Invalid email or OTP' };
    }

    const row = userResult[0].values[0];
    const userId = row[0] as number;
    const storedOTP = row[1] as string;
    const expires = row[2] as number;

    if (!storedOTP || storedOTP !== otp) {
      return { success: false, error: 'Invalid OTP' };
    }

    if (Date.now() > expires) {
      // Clear expired OTP
      db.run(`UPDATE users SET password_reset_otp = NULL, password_reset_otp_expires = NULL WHERE id = ?`, [userId]);
      (await import('../db/database')).saveDatabase();
      return { success: false, error: 'OTP has expired. Please request a new one.' };
    }

    // OTP is valid, clear it and allow password reset
    db.run(`UPDATE users SET password_reset_otp = NULL, password_reset_otp_expires = NULL WHERE id = ?`, [userId]);
    (await import('../db/database')).saveDatabase();

    return { success: true, userId };
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return { success: false, error: error.message || 'Failed to verify OTP' };
  }
}

// Reset password after OTP verification
export async function resetPasswordWithOTP(userId: number, newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long' };
    }

    const hashedPassword = btoa(newPassword);
    const db = (await import('../db/database')).getDatabase();
    db.run(`UPDATE users SET password = ? WHERE id = ?`, [hashedPassword, userId]);
    (await import('../db/database')).saveDatabase();

    return { success: true };
  } catch (error: any) {
    console.error('Error resetting password:', error);
    return { success: false, error: error.message || 'Failed to reset password' };
  }
}

// Change password
export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = (await import('../db/database')).getDatabase();
    
    // Get user from database
    const user = userQueries.getUserById(userId);
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Check if user is using email/password auth (not Google OAuth)
    const userResult = db.exec(`SELECT password, auth_provider FROM users WHERE id = ${userId}`);
    if (userResult.length === 0 || userResult[0].values.length === 0) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    const row = userResult[0].values[0];
    const authProvider = row[1]; // auth_provider column
    const storedPassword = row[0]; // password column

    // If user is using Google OAuth, they don't have a password
    if (authProvider === 'google' || !storedPassword) {
      return {
        success: false,
        error: 'Password change is not available for Google accounts. Please use Google to sign in.'
      };
    }

    // Verify current password
    const hashedCurrentPassword = btoa(currentPassword);
    if (storedPassword !== hashedCurrentPassword) {
      return {
        success: false,
        error: 'Current password is incorrect'
      };
    }

    // Validate new password
    if (newPassword.length < 6) {
      return {
        success: false,
        error: 'New password must be at least 6 characters'
      };
    }

    // Update password
    const hashedNewPassword = btoa(newPassword);
    db.run(
      `UPDATE users SET password = ? WHERE id = ?`,
      [hashedNewPassword, userId]
    );
    (await import('../db/database')).saveDatabase();

    return {
      success: true
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to change password'
    };
  }
}

