// Database API endpoints for PostgreSQL
const express = require('express');
const router = express.Router();
const db = require('./database-service');

// ============ USER QUERIES ============

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.json(null);
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by email
router.get('/users/email/:email', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [req.params.email]);
    if (result.rows.length === 0) {
      return res.json(null);
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update user
router.post('/users', async (req, res) => {
  try {
    const { id, phone, email, name, password, google_id, auth_provider, avatar_url, notification_settings, password_reset_token, password_reset_expires, password_reset_otp, password_reset_otp_expires } = req.body;
    
    if (id) {
      // Update existing user
      const updates = [];
      const values = [];
      let paramIndex = 1;
      
      if (phone !== undefined) { updates.push(`phone = $${paramIndex++}`); values.push(phone); }
      if (email !== undefined) { updates.push(`email = $${paramIndex++}`); values.push(email); }
      if (name !== undefined) { updates.push(`name = $${paramIndex++}`); values.push(name); }
      if (password !== undefined) { updates.push(`password = $${paramIndex++}`); values.push(password); }
      if (google_id !== undefined) { updates.push(`google_id = $${paramIndex++}`); values.push(google_id); }
      if (auth_provider !== undefined) { updates.push(`auth_provider = $${paramIndex++}`); values.push(auth_provider); }
      if (avatar_url !== undefined) { updates.push(`avatar_url = $${paramIndex++}`); values.push(avatar_url); }
      if (notification_settings !== undefined) { updates.push(`notification_settings = $${paramIndex++}`); values.push(notification_settings); }
      if (password_reset_token !== undefined) { updates.push(`password_reset_token = $${paramIndex++}`); values.push(password_reset_token); }
      if (password_reset_expires !== undefined) { updates.push(`password_reset_expires = $${paramIndex++}`); values.push(password_reset_expires); }
      if (password_reset_otp !== undefined) { updates.push(`password_reset_otp = $${paramIndex++}`); values.push(password_reset_otp); }
      if (password_reset_otp_expires !== undefined) { updates.push(`password_reset_otp_expires = $${paramIndex++}`); values.push(password_reset_otp_expires); }
      
      values.push(id);
      const result = await db.query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
      );
      res.json(result.rows[0]);
    } else {
      // Create new user
      const result = await db.query(
        `INSERT INTO users (phone, email, name, password, google_id, auth_provider, avatar_url, notification_settings, password_reset_token, password_reset_expires, password_reset_otp, password_reset_otp_expires)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
        [
          phone || null, 
          email || null, 
          name || null, 
          password || null, 
          google_id || null, 
          auth_provider || 'email', 
          avatar_url || null, 
          notification_settings || null,
          password_reset_token || null,
          password_reset_expires || null,
          password_reset_otp || null,
          password_reset_otp_expires || null
        ]
      );
      res.json(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ TASK QUERIES ============

// Get all tasks
router.get('/tasks', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM tasks WHERE status = $1';
    const params = ['active'];
    
    if (category && category !== 'all') {
      query += ' AND category = $2';
      params.push(category);
    }
    query += ' ORDER BY created_at DESC';
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get task by ID
router.get('/tasks/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.json(null);
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create task
router.post('/tasks', async (req, res) => {
  try {
    const { title, brand, image, reward, deadline, category, tag, description, survey_fields } = req.body;
    const result = await db.query(
      `INSERT INTO tasks (title, brand, image, reward, deadline, category, tag, description, survey_fields)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [title, brand, image || null, reward, deadline || null, category || null, tag || null, description || null, survey_fields || null]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task
router.put('/tasks/:id', async (req, res) => {
  try {
    const { title, brand, image, reward, deadline, category, tag, description, survey_fields, status } = req.body;
    const updates = [];
    const values = [];
    let paramIndex = 1;
    
    if (title !== undefined) { updates.push(`title = $${paramIndex++}`); values.push(title); }
    if (brand !== undefined) { updates.push(`brand = $${paramIndex++}`); values.push(brand); }
    if (image !== undefined) { updates.push(`image = $${paramIndex++}`); values.push(image); }
    if (reward !== undefined) { updates.push(`reward = $${paramIndex++}`); values.push(reward); }
    if (deadline !== undefined) { updates.push(`deadline = $${paramIndex++}`); values.push(deadline); }
    if (category !== undefined) { updates.push(`category = $${paramIndex++}`); values.push(category); }
    if (tag !== undefined) { updates.push(`tag = $${paramIndex++}`); values.push(tag); }
    if (description !== undefined) { updates.push(`description = $${paramIndex++}`); values.push(description); }
    if (survey_fields !== undefined) { updates.push(`survey_fields = $${paramIndex++}`); values.push(survey_fields); }
    if (status !== undefined) { updates.push(`status = $${paramIndex++}`); values.push(status); }
    
    values.push(req.params.id);
    const result = await db.query(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete task
router.delete('/tasks/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ SURVEY QUERIES ============

// Get surveys by task
router.get('/surveys/task/:taskId', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT s.*, u.name as user_name 
       FROM surveys s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.task_id = $1
       ORDER BY s.created_at DESC`,
      [req.params.taskId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user surveys
router.get('/surveys/user/:userId', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT s.*, t.title as task_title, t.brand, t.reward
       FROM surveys s 
       JOIN tasks t ON s.task_id = t.id 
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC`,
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create survey
router.post('/surveys', async (req, res) => {
  try {
    const { task_id, user_id, rating, survey_text, images, custom_responses } = req.body;
    const result = await db.query(
      `INSERT INTO surveys (task_id, user_id, rating, survey_text, images, custom_responses, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING *`,
      [task_id, user_id, rating || null, survey_text || null, images || null, custom_responses || null]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update survey status
router.put('/surveys/:id/status', async (req, res) => {
  try {
    const { status, company_feedback, company_rating } = req.body;
    const updates = [`status = $1`];
    const values = [status];
    let paramIndex = 2;
    
    if (company_feedback !== undefined) {
      updates.push(`company_feedback = $${paramIndex++}`);
      values.push(company_feedback);
    }
    if (company_rating !== undefined) {
      updates.push(`company_rating = $${paramIndex++}`);
      values.push(company_rating);
    }
    
    values.push(req.params.id);
    const result = await db.query(
      `UPDATE surveys SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    
    // If approved, credit wallet
    if (status === 'approved' && result.rows.length > 0) {
      const survey = result.rows[0];
      const taskResult = await db.query('SELECT reward FROM tasks WHERE id = $1', [survey.task_id]);
      if (taskResult.rows.length > 0) {
        const reward = taskResult.rows[0].reward;
        // Check if already credited
        const existing = await db.query(
          `SELECT id FROM wallet_transactions 
           WHERE user_id = $1 AND description LIKE $2 AND description LIKE $3`,
          [survey.user_id, `%Survey Reward%`, `%Survey ID: ${survey.id}%`]
        );
        
        if (existing.rows.length === 0) {
          await db.query(
            `INSERT INTO wallet_transactions (user_id, amount, type, description)
             VALUES ($1, $2, 'credit', $3)`,
            [survey.user_id, reward, `Survey Reward - Survey ID: ${survey.id}`]
          );
        }
      }
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ WALLET QUERIES ============

// Get wallet balance
router.get('/wallet/balance/:userId', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE -amount END), 0) as balance
       FROM wallet_transactions 
       WHERE user_id = $1`,
      [req.params.userId]
    );
    res.json({ balance: parseInt(result.rows[0].balance) || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get wallet transactions
router.get('/wallet/transactions/:userId', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM wallet_transactions 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add wallet transaction
router.post('/wallet/transactions', async (req, res) => {
  try {
    const { user_id, amount, type, description, status, withdrawal_method, account_details } = req.body;
    const result = await db.query(
      `INSERT INTO wallet_transactions (user_id, amount, type, description, status, withdrawal_method, account_details)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [user_id, amount, type, description || null, status || 'completed', withdrawal_method || null, account_details || null]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ KYC QUERIES ============

// Get KYC info
router.get('/kyc/:userId', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM kyc_info WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [req.params.userId]);
    if (result.rows.length === 0) {
      return res.json(null);
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save KYC info
router.post('/kyc', async (req, res) => {
  try {
    const { user_id, full_name, date_of_birth, address, city, state, pincode, document_type, document_number, document_image, verification_method, status } = req.body;
    
    // Check if KYC exists
    const existing = await db.query('SELECT id FROM kyc_info WHERE user_id = $1', [user_id]);
    
    if (existing.rows.length > 0) {
      // Update
      const result = await db.query(
        `UPDATE kyc_info SET 
         full_name = $1, date_of_birth = $2, address = $3, city = $4, state = $5, pincode = $6,
         document_type = $7, document_number = $8, document_image = $9, verification_method = $10, status = $11
         WHERE user_id = $12 RETURNING *`,
        [full_name, date_of_birth, address, city, state, pincode, document_type, document_number, document_image, verification_method, status, user_id]
      );
      res.json(result.rows[0]);
    } else {
      // Create
      const result = await db.query(
        `INSERT INTO kyc_info (user_id, full_name, date_of_birth, address, city, state, pincode, document_type, document_number, document_image, verification_method, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
        [user_id, full_name, date_of_birth, address, city, state, pincode, document_type, document_number, document_image, verification_method, status]
      );
      res.json(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ USER TASKS QUERIES ============

// Get user tasks
router.get('/user-tasks/:userId', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM user_tasks WHERE user_id = $1 ORDER BY assigned_at DESC`,
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Assign task to user
router.post('/user-tasks', async (req, res) => {
  try {
    const { user_id, task_id, status } = req.body;
    const result = await db.query(
      `INSERT INTO user_tasks (user_id, task_id, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, task_id) DO UPDATE SET status = $3
       RETURNING *`,
      [user_id, task_id, status || 'assigned']
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user task status
router.put('/user-tasks/:userId/:taskId', async (req, res) => {
  try {
    const { status, completed_at } = req.body;
    const result = await db.query(
      `UPDATE user_tasks SET status = $1, completed_at = $2
       WHERE user_id = $3 AND task_id = $4 RETURNING *`,
      [status, completed_at || null, req.params.userId, req.params.taskId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

