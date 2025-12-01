// Email Configuration
// NOTE: These credentials should be used in a backend server, not directly in frontend
// For production, create a backend API endpoint to send emails securely

export const emailConfig = {
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'admmailnotificationstesting@gmail.com',
      pass: 'sgfsdnxjznjkstgt'
    }
  },
  from: {
    address: 'mailnotificationstesting@gmail.com',
    name: 'Interior Design Platform'
  }
};

// Email service - Calls backend API
// Make sure your backend server is running (see BACKEND_EMAIL_SETUP.md)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const emailService = {
  sendEmail: async (to: string, subject: string, html: string, text?: string, type?: string, data?: any): Promise<{ success: boolean; error?: string; messageId?: string }> => {
    try {
      // Call backend API to send email
      const response = await fetch(`${API_BASE_URL}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, html, text, type, data })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to send email' }));
        throw new Error(errorData.error || 'Failed to send email');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        console.error('Email service returned error:', result.error);
        return { success: false, error: result.error || 'Failed to send email' };
      }
      
      return result;
    } catch (error: any) {
      console.error('Email service error:', error);
      
      // Check if it's a network error (backend not running)
      if (error.message?.includes('fetch') || error.message?.includes('Failed to fetch') || error.code === 'ECONNREFUSED') {
        return { 
          success: false, 
          error: 'Email server is not running. Please start the backend server with: npm run email:server' 
        };
      }
      
      // Fallback: log email details (for development)
      console.log('Email would be sent:', { to, subject, type });
      return { success: false, error: error.message || 'Email service unavailable. Please check backend connection.' };
    }
  },

  sendPasswordResetOTP: async (to: string, otp: string) => {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #6B4BFF;">Password Reset OTP</h2>
        <p>You requested to reset your password. Use the OTP below to verify your identity:</p>
        <div style="background-color: #F6F6F9; padding: 20px; border-radius: 12px; text-align: center; margin: 30px 0;">
          <p style="font-size: 32px; font-weight: bold; color: #6B4BFF; letter-spacing: 8px; margin: 0;">${otp}</p>
        </div>
        <p style="color: #666; font-size: 14px;">This OTP will expire in 10 minutes.</p>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">If you didn't request this, please ignore this email.</p>
      </div>
    `;
    return emailService.sendEmail(to, 'Password Reset OTP', html, undefined, 'password-reset-otp', { otp });
  },

  sendPasswordResetEmail: async (to: string, resetToken: string) => {
    // Use root path with query param for SPA compatibility
    const resetUrl = `${window.location.origin}/?token=${resetToken}&screen=resetPassword`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6B4BFF;">Password Reset Request</h2>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #6B4BFF; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">Reset Password</a>
        <p>Or copy this link: ${resetUrl}</p>
        <p style="color: #666; font-size: 12px;">This link will expire in 1 hour.</p>
      </div>
    `;
    return emailService.sendEmail(to, 'Password Reset Request', html, undefined, 'password-reset', { token: resetToken });
  },

  sendWelcomeEmail: async (to: string, name: string) => {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6B4BFF;">Welcome to SurveyTask!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for joining our platform. Start earning by completing survey tasks!</p>
        <p>Happy surveying!</p>
      </div>
    `;
    return emailService.sendEmail(to, 'Welcome to SurveyTask', html, undefined, 'welcome', { name });
  },

  sendSurveyApprovalEmail: async (to: string, taskTitle: string, reward: number) => {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #22C55E;">Survey Approved! 🎉</h2>
        <p>Great news! Your survey for "${taskTitle}" has been approved.</p>
        <p><strong>Reward: ₹${reward}</strong> has been credited to your wallet.</p>
        <p>Keep up the great work!</p>
      </div>
    `;
    return emailService.sendEmail(to, 'Survey Approved - Reward Credited', html, undefined, 'survey-approval', { taskTitle, reward });
  },

  sendSurveyRejectionEmail: async (to: string, taskTitle: string, reason?: string) => {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #EF4444;">Survey Status Update</h2>
        <p>Your survey for "${taskTitle}" was not approved.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        <p>Please review the guidelines and submit again.</p>
      </div>
    `;
    return emailService.sendEmail(to, 'Survey Status Update', html, undefined, 'survey-rejection', { taskTitle, reason });
  },

  sendKYCStatusEmail: async (to: string, status: 'approved' | 'rejected', reason?: string) => {
    const isApproved = status === 'approved';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${isApproved ? '#22C55E' : '#EF4444'};">
          KYC Verification ${isApproved ? 'Approved' : 'Rejected'}
        </h2>
        <p>Your KYC verification has been ${status}.</p>
        ${!isApproved && reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        ${isApproved ? '<p>You can now withdraw your earnings!</p>' : '<p>Please update your information and resubmit.</p>'}
      </div>
    `;
    return emailService.sendEmail(to, `KYC Verification ${isApproved ? 'Approved' : 'Rejected'}`, html, undefined, 'kyc-status', { status, reason });
  }
};

