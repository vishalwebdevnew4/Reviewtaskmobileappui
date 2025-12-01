import { getDatabase, saveDatabase } from './database';

// User queries
export const userQueries = {
  // Create or get user
  createOrGetUser: (phone: string, email?: string, name?: string) => {
    const db = getDatabase();
    
    // Check if user exists by phone or email
    let existing;
    if (phone) {
      existing = db.exec(`SELECT * FROM users WHERE phone = '${phone.replace(/'/g, "''")}'`);
    }
    if ((!existing || existing.length === 0 || existing[0].values.length === 0) && email) {
      existing = db.exec(`SELECT * FROM users WHERE email = '${email.replace(/'/g, "''")}'`);
    }
    
    if (existing && existing.length > 0 && existing[0].values.length > 0) {
      const row = existing[0].values[0];
      return {
        id: row[0],
        phone: row[1],
        email: row[2],
        name: row[3],
        auth_provider: row[6],
        avatar_url: row[7]
      };
    }

    // Create new user
    db.run(`INSERT INTO users (phone, email, name) VALUES (?, ?, ?)`, [phone || null, email || null, name || null]);
    saveDatabase();
    
    const result = db.exec(`SELECT * FROM users WHERE ${phone ? `phone = '${phone.replace(/'/g, "''")}'` : `email = '${email?.replace(/'/g, "''")}'`}`);
    const row = result[0].values[0];
    return {
      id: row[0],
      phone: row[1],
      email: row[2],
      name: row[3],
      auth_provider: row[6],
      avatar_url: row[7]
    };
  },

  // Get user by ID
  getUserById: (userId: number) => {
    const db = getDatabase();
    const result = db.exec(`SELECT * FROM users WHERE id = ${userId}`);
    if (result.length === 0 || result[0].values.length === 0) return null;
    
    const row = result[0].values[0];
    // Column order: id, phone, email, name, password, google_id, auth_provider, avatar_url, notification_settings, password_reset_token, password_reset_expires, created_at
    return {
      id: row[0],
      phone: row[1],
      email: row[2],
      name: row[3],
      password: row[4],
      google_id: row[5],
      auth_provider: row[6],
      avatar_url: row[7],
      notification_settings: row[8] || null, // Handle case where column might not exist
      password_reset_token: row[9] || null,
      password_reset_expires: row[10] || null,
      created_at: row[11] || row[9] // Fallback for older schemas
    };
  },

  // Get user by email
  getUserByEmail: (email: string) => {
    const db = getDatabase();
    const result = db.exec(`SELECT * FROM users WHERE email = '${email.replace(/'/g, "''")}'`);
    if (result.length === 0 || result[0].values.length === 0) return null;
    
    const row = result[0].values[0];
    return {
      id: row[0],
      phone: row[1],
      email: row[2],
      name: row[3],
      auth_provider: row[6],
      avatar_url: row[7],
      created_at: row[8]
    };
  },

  // Update user
  updateUser: (userId: number, updates: { name?: string; email?: string; phone?: string; notification_settings?: string | null }) => {
    const db = getDatabase();
    
    // Helper function to escape SQL strings
    const escapeSQL = (value: any): string => {
      if (value === null || value === undefined) return 'NULL';
      if (typeof value === 'string') {
        return `'${value.replace(/'/g, "''")}'`;
      }
      return String(value);
    };
    
    // Filter out undefined values (null is allowed to clear fields)
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    
    const setClause = Object.entries(filteredUpdates)
      .map(([key, value]) => `${key} = ${escapeSQL(value)}`)
      .join(', ');
    
    if (setClause) {
      db.run(`UPDATE users SET ${setClause} WHERE id = ${userId}`);
      saveDatabase();
    }
  }
};

// Task queries
export const taskQueries = {
  // Get all tasks
  getAllTasks: (category?: string) => {
    const db = getDatabase();
    let query = 'SELECT * FROM tasks WHERE status = "active"';
    if (category && category !== 'all') {
      query += ` AND category = '${category}'`;
    }
    query += ' ORDER BY created_at DESC';
    
    const result = db.exec(query);
    if (result.length === 0) return [];
    
    return result[0].values.map(row => ({
      id: row[0],
      title: row[1],
      brand: row[2],
      image: row[3],
      reward: row[4],
      deadline: row[5],
      category: row[6],
      tag: row[7],
      description: row[8],
      status: row[9],
      created_at: row[10]
    }));
  },

  // Get task by ID
  getTaskById: (taskId: number) => {
    const db = getDatabase();
    const result = db.exec(`SELECT * FROM tasks WHERE id = ${taskId}`);
    if (result.length === 0 || result[0].values.length === 0) return null;
    
    const row = result[0].values[0];
    return {
      id: row[0],
      title: row[1],
      brand: row[2],
      image: row[3],
      reward: row[4],
      deadline: row[5],
      category: row[6],
      tag: row[7],
      description: row[8],
      survey_fields: row[9] || null,
      status: row[10] || row[9],
      created_at: row[11] || row[10]
    };
  },

  // Create task
  createTask: (task: {
    title: string;
    brand: string;
    image?: string;
    reward: number;
    deadline?: string;
    category?: string;
    tag?: string;
    description?: string;
    survey_fields?: string;
  }) => {
    const db = getDatabase();
    db.run(
      `INSERT INTO tasks (title, brand, image, reward, deadline, category, tag, description, survey_fields) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        task.title,
        task.brand,
        task.image || null,
        task.reward,
        task.deadline || null,
        task.category || null,
        task.tag || null,
        task.description || null,
        task.survey_fields || null
      ]
    );
    saveDatabase();
    
    const result = db.exec('SELECT * FROM tasks ORDER BY id DESC LIMIT 1');
    const row = result[0].values[0];
    return {
      id: row[0],
      title: row[1],
      brand: row[2],
      image: row[3],
      reward: row[4],
      deadline: row[5],
      category: row[6],
      tag: row[7],
      description: row[8],
      survey_fields: row[9] || null,
      status: row[10] || row[9],
      created_at: row[11] || row[10]
    };
  },

  // Update task
  updateTask: (taskId: number, updates: {
    title?: string;
    brand?: string;
    image?: string;
    reward?: number;
    deadline?: string;
    category?: string;
    tag?: string;
    description?: string;
    survey_fields?: string;
    status?: string;
  }) => {
    const db = getDatabase();
    const escapeSQL = (value: any): string => {
      if (value === null || value === undefined) return 'NULL';
      if (typeof value === 'string') {
        return `'${value.replace(/'/g, "''")}'`;
      }
      return String(value);
    };

    const setClause = Object.entries(updates)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key} = ${escapeSQL(value)}`)
      .join(', ');
    
    if (setClause) {
      db.run(`UPDATE tasks SET ${setClause} WHERE id = ${taskId}`);
      saveDatabase();
    }
  },

  // Delete task
  deleteTask: (taskId: number) => {
    const db = getDatabase();
    // First delete related reviews
    db.run(`DELETE FROM reviews WHERE task_id = ${taskId}`);
    // Then delete user_tasks
    db.run(`DELETE FROM user_tasks WHERE task_id = ${taskId}`);
    // Finally delete the task
    db.run(`DELETE FROM tasks WHERE id = ${taskId}`);
    saveDatabase();
  },

  // Update task status
  updateTaskStatus: (taskId: number, status: 'active' | 'paused' | 'completed') => {
    const db = getDatabase();
    db.run(`UPDATE tasks SET status = '${status}' WHERE id = ${taskId}`);
    saveDatabase();
  }
};

// Review queries
export const surveyQueries = {
  // Create survey
  createSurvey: (survey: {
    taskId: number;
    userId: number;
    rating?: number;
    surveyText?: string;
    images?: string;
    customResponses?: string;
  }) => {
    const db = getDatabase();
    
    // Helper function to escape SQL strings
    const escapeSQL = (value: any): string => {
      if (value === null || value === undefined) return 'NULL';
      if (typeof value === 'string') {
        return `'${value.replace(/'/g, "''")}'`;
      }
      return String(value);
    };
    
    db.run(
      `INSERT INTO surveys (task_id, user_id, rating, survey_text, images, custom_responses, status) 
       VALUES (${survey.taskId}, ${survey.userId}, ${survey.rating || 'NULL'}, ${escapeSQL(survey.surveyText || null)}, ${escapeSQL(survey.images || null)}, ${escapeSQL(survey.customResponses || null)}, 'pending')`
    );
    saveDatabase();
  },

  // Get surveys by task
  getSurveysByTask: (taskId: number) => {
    const db = getDatabase();
    const result = db.exec(`
      SELECT s.*, u.name as user_name 
      FROM surveys s 
      JOIN users u ON s.user_id = u.id 
      WHERE s.task_id = ${taskId}
      ORDER BY s.created_at DESC
    `);
    
    if (result.length === 0) return [];
    
    return result[0].values.map(row => ({
      id: row[0],
      task_id: row[1],
      user_id: row[2],
      rating: row[3],
      survey_text: row[4],
      images: row[5],
      custom_responses: row[6] || null,
      status: row[7] || row[6],
      created_at: row[8] || row[7],
      user_name: row[9] || row[8]
    }));
  },

  // Get user's surveys
  getUserSurveys: (userId: number) => {
    const db = getDatabase();
    const result = db.exec(`
      SELECT s.*, t.title as task_title, t.brand, t.reward
      FROM surveys s 
      JOIN tasks t ON s.task_id = t.id 
      WHERE s.user_id = ${userId}
      ORDER BY s.created_at DESC
    `);
    
    if (result.length === 0) return [];
    
    return result[0].values.map(row => ({
      id: row[0],
      task_id: row[1],
      user_id: row[2],
      rating: row[3],
      survey_text: row[4],
      images: row[5],
      custom_responses: row[6] || null,
      status: row[7] || row[6],
      created_at: row[8] || row[7],
      task_title: row[9] || row[8],
      brand: row[10] || row[9],
      reward: row[11] || row[10]
    }));
  },

  // Update survey status and credit wallet if approved
  updateSurveyStatus: (surveyId: number, status: 'pending' | 'approved' | 'rejected', feedbackText?: string, surveyorRating?: number) => {
    const db = getDatabase();
    
    // Helper function to escape SQL strings
    const escapeSQL = (value: any): string => {
      if (value === null || value === undefined) return 'NULL';
      if (typeof value === 'string') {
        return `'${value.replace(/'/g, "''")}'`;
      }
      return String(value);
    };
    
    // Get survey details
    const surveyResult = db.exec(`SELECT s.*, t.reward FROM surveys s JOIN tasks t ON s.task_id = t.id WHERE s.id = ${surveyId}`);
    if (surveyResult.length === 0 || surveyResult[0].values.length === 0) {
      throw new Error('Survey not found');
    }
    
    const survey = surveyResult[0].values[0];
    const surveyUserId = survey[2];
    const taskReward = survey[7]; // task reward
    
    // Build update query with optional feedback fields
    const updateParts = [`status = '${status}'`];
    if (feedbackText !== undefined) {
      updateParts.push(`company_feedback = ${escapeSQL(feedbackText)}`);
    }
    if (surveyorRating !== undefined) {
      updateParts.push(`company_rating = ${surveyorRating}`);
    }
    
    // Update survey status
    db.run(`UPDATE surveys SET ${updateParts.join(', ')} WHERE id = ${surveyId}`);
    
    // If approved, credit wallet
    if (status === 'approved') {
      // Check if already credited
      const existingCredit = db.exec(`
        SELECT id FROM wallet_transactions 
        WHERE user_id = ${surveyUserId} 
        AND description LIKE '%Survey Reward%' 
        AND description LIKE '%Survey ID: ${surveyId}%'
      `);
      
      if (existingCredit.length === 0 || existingCredit[0].values.length === 0) {
        // Credit wallet
        walletQueries.addTransaction({
          userId: surveyUserId,
          amount: taskReward,
          type: 'credit',
          description: `Survey Reward - Survey ID: ${surveyId}`
        });
      }
    }
    
    saveDatabase();
  }
};

// Keep reviewQueries as alias for backward compatibility during migration
export const reviewQueries = surveyQueries;

// Wallet queries
export const walletQueries = {
  // Get wallet balance
  getBalance: (userId: number) => {
    const db = getDatabase();
    const result = db.exec(`
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE -amount END), 0) as balance
      FROM wallet_transactions 
      WHERE user_id = ${userId}
    `);
    
    return result.length > 0 && result[0].values.length > 0 
      ? result[0].values[0][0] as number 
      : 0;
  },

  // Add transaction
  addTransaction: (transaction: {
    userId: number;
    amount: number;
    type: 'credit' | 'debit';
    description?: string;
    status?: 'pending' | 'processing' | 'completed' | 'failed';
    withdrawalMethod?: string;
    accountDetails?: string;
  }) => {
    const db = getDatabase();
    
    // Helper function to escape SQL strings
    const escapeSQL = (value: any): string => {
      if (value === null || value === undefined) return 'NULL';
      if (typeof value === 'string') {
        return `'${value.replace(/'/g, "''")}'`;
      }
      return String(value);
    };
    
    const status = transaction.status || (transaction.type === 'debit' ? 'pending' : 'completed');
    
    db.run(
      `INSERT INTO wallet_transactions (user_id, amount, type, description, status, withdrawal_method, account_details) 
       VALUES (${transaction.userId}, ${transaction.amount}, ${escapeSQL(transaction.type)}, ${escapeSQL(transaction.description || null)}, ${escapeSQL(status)}, ${escapeSQL(transaction.withdrawalMethod || null)}, ${escapeSQL(transaction.accountDetails || null)})`
    );
    saveDatabase();
  },

  // Update withdrawal status
  updateWithdrawalStatus: (transactionId: number, status: 'pending' | 'processing' | 'completed' | 'failed') => {
    const db = getDatabase();
    db.run(`UPDATE wallet_transactions SET status = '${status}' WHERE id = ${transactionId}`);
    saveDatabase();
  },

  // Get transaction history
  getTransactions: (userId: number, limit: number = 50) => {
    const db = getDatabase();
    const result = db.exec(`
      SELECT * FROM wallet_transactions 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC 
      LIMIT ${limit}
    `);
    
    if (result.length === 0) return [];
    
    return result[0].values.map(row => ({
      id: row[0],
      user_id: row[1],
      amount: row[2],
      type: row[3],
      description: row[4],
      status: row[5] || 'completed',
      withdrawal_method: row[6] || null,
      account_details: row[7] || null,
      created_at: row[8] || row[5] // Handle both old and new schema
    }));
  },

  // Get withdrawals
  getWithdrawals: (userId: number) => {
    const db = getDatabase();
    const result = db.exec(`
      SELECT * FROM wallet_transactions 
      WHERE user_id = ${userId} AND type = 'debit'
      ORDER BY created_at DESC
    `);
    
    if (result.length === 0) return [];
    
    return result[0].values.map(row => ({
      id: row[0],
      user_id: row[1],
      amount: row[2],
      type: row[3],
      description: row[4],
      status: row[5] || 'pending',
      withdrawal_method: row[6] || null,
      account_details: row[7] || null,
      created_at: row[8] || row[5]
    }));
  }
};

// KYC queries
export const kycQueries = {
  // Get KYC info
  getKYCInfo: (userId: number) => {
    const db = getDatabase();
    const result = db.exec(`SELECT * FROM kyc_info WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 1`);
    
    if (result.length === 0 || result[0].values.length === 0) return null;
    
    const row = result[0].values[0];
    return {
      id: row[0],
      user_id: row[1],
      full_name: row[2],
      date_of_birth: row[3],
      address: row[4],
      city: row[5],
      state: row[6],
      pincode: row[7],
      document_type: row[8],
      document_number: row[9],
      document_image: row[10],
      verification_method: row[11],
      status: row[12],
      created_at: row[13]
    };
  },

  // Save KYC info
  saveKYCInfo: (userId: number, kycData: {
    full_name?: string;
    date_of_birth?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    document_type?: string;
    document_number?: string;
    document_image?: string;
    verification_method?: string;
    status?: string;
  }) => {
    const db = getDatabase();
    
    // Helper function to escape SQL strings
    const escapeSQL = (value: any): string => {
      if (value === null || value === undefined) return 'NULL';
      if (typeof value === 'string') {
        return `'${value.replace(/'/g, "''")}'`;
      }
      return String(value);
    };
    
    // Check if KYC exists
    const existing = db.exec(`SELECT id FROM kyc_info WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 1`);
    
    if (existing.length > 0 && existing[0].values.length > 0) {
      // Update existing
      const updates = Object.entries(kycData)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key} = ${escapeSQL(value)}`)
        .join(', ');
      
      if (updates) {
        db.run(`UPDATE kyc_info SET ${updates} WHERE user_id = ${userId}`);
      }
    } else {
      // Insert new
      const fields = ['user_id', ...Object.keys(kycData).filter(k => kycData[k as keyof typeof kycData] !== undefined)];
      const values = [userId, ...Object.values(kycData).filter(v => v !== undefined)].map(escapeSQL);
      
      db.run(`INSERT INTO kyc_info (${fields.join(', ')}) VALUES (${values.join(', ')})`);
    }
    
    saveDatabase();
  }
};

// User tasks queries
export const userTaskQueries = {
  // Assign task to user
  assignTask: (userId: number, taskId: number) => {
    const db = getDatabase();
    // Check if already assigned
    const existing = db.exec(`SELECT id FROM user_tasks WHERE user_id = ${userId} AND task_id = ${taskId}`);
    if (existing.length === 0 || existing[0].values.length === 0) {
      db.run(`INSERT INTO user_tasks (user_id, task_id, status) VALUES (${userId}, ${taskId}, 'assigned')`);
      saveDatabase();
    }
  },

  // Get user's tasks
  getUserTasks: (userId: number, status?: string) => {
    const db = getDatabase();
    let query = `
      SELECT ut.*, t.title, t.brand, t.image, t.reward, t.deadline, t.category, t.tag
      FROM user_tasks ut
      JOIN tasks t ON ut.task_id = t.id
      WHERE ut.user_id = ${userId}
    `;
    
    if (status) {
      query += ` AND ut.status = '${status}'`;
    }
    
    query += ' ORDER BY ut.assigned_at DESC';
    
    const result = db.exec(query);
    if (result.length === 0) return [];
    
    return result[0].values.map(row => ({
      id: row[0],
      user_id: row[1],
      task_id: row[2],
      status: row[3],
      assigned_at: row[4],
      completed_at: row[5],
      title: row[6],
      brand: row[7],
      image: row[8],
      reward: row[9],
      deadline: row[10],
      category: row[11],
      tag: row[12]
    }));
  },

  // Update task status
  updateTaskStatus: (userId: number, taskId: number, status: string) => {
    const db = getDatabase();
    const completedAt = status === 'completed' ? new Date().toISOString() : null;
    
    if (completedAt) {
      db.run(
        `UPDATE user_tasks SET status = ?, completed_at = ? WHERE user_id = ? AND task_id = ?`,
        [status, completedAt, userId, taskId]
      );
    } else {
      db.run(
        `UPDATE user_tasks SET status = ? WHERE user_id = ? AND task_id = ?`,
        [status, userId, taskId]
      );
    }
    
    saveDatabase();
  }
};

