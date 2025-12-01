// Backend Email Server
// Run this server to handle email sending requests from the frontend
// Start with: node backend/server.js

// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const emailService = require('./email-service');
const dbApi = require('./db-api');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize database
const dbService = require('./database-service');
dbService.initDatabase()
  .then(() => {
    return dbService.createTables();
  })
  .then(() => {
    console.log('✅ Database initialized and tables ready');
  })
  .catch((error) => {
    console.error('❌ Database initialization failed:', error.message);
    console.error('   The API will still start, but database operations will fail.');
  });

// Database API routes
app.use('/api/db', dbApi);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Email service is running' });
});

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  const { to, subject, html, text, type, data } = req.body;
  
  console.log(`📧 Email request received: ${type || 'general'} to ${to}`);
  
  try {
    let result;
    switch(type) {
      case 'password-reset-otp':
        result = await emailService.sendPasswordResetOTP(to, data.otp);
        break;
      case 'password-reset':
        result = await emailService.sendPasswordResetEmail(to, data.token);
        break;
      case 'welcome':
        result = await emailService.sendWelcomeEmail(to, data.name);
        break;
      case 'survey-approval':
        result = await emailService.sendSurveyApprovalEmail(to, data.taskTitle, data.reward);
        break;
      case 'survey-rejection':
        result = await emailService.sendSurveyRejectionEmail(to, data.taskTitle, data.reason);
        break;
      case 'kyc-status':
        result = await emailService.sendKYCStatusEmail(to, data.status, data.reason);
        break;
      default:
        result = await emailService.sendEmail(to, subject, html, text);
    }
    
    if (result.success) {
      console.log(`✅ Email sent successfully to ${to}`);
    } else {
      console.error(`❌ Failed to send email to ${to}:`, result.error);
    }
    
    res.json(result);
  } catch (error) {
    console.error('❌ Email service error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Email service running on http://localhost:${PORT}`);
  console.log(`📧 Ready to send emails!\n`);
});

