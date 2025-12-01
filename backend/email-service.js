// Backend Email Service
// This should be run as a separate Node.js service or integrated into your backend API
// Install required packages: npm install nodemailer

const nodemailer = require('nodemailer');

// Email Configuration
const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'admmailnotificationstesting@gmail.com',
    pass: 'sgfsdnxjznjkstgt'
  },
  tls: {
    // Do not fail on invalid certificates (for development)
    rejectUnauthorized: false
  }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Email service functions
const emailService = {
  sendEmail: async (to, subject, html, text) => {
    try {
      const info = await transporter.sendMail({
        from: '"Interior Design Platform" <mailnotificationstesting@gmail.com>',
        to: to,
        subject: subject,
        text: text || html.replace(/<[^>]*>/g, ''), // Plain text version
        html: html
      });
      
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }
  },

  sendPasswordResetOTP: async (to, otp) => {
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
    return emailService.sendEmail(to, 'Password Reset OTP', html);
  },

  sendPasswordResetEmail: async (to, resetToken) => {
    // Use root path with query params for SPA compatibility
    const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/?token=${resetToken}&screen=resetPassword`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #6B4BFF;">Password Reset Request</h2>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #6B4BFF; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">Reset Password</a>
        <p>Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">This link will expire in 1 hour.</p>
        <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    `;
    return emailService.sendEmail(to, 'Password Reset Request', html);
  },

  sendWelcomeEmail: async (to, name) => {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #6B4BFF;">Welcome to SurveyTask!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for joining our platform. Start earning by completing survey tasks!</p>
        <p>Happy surveying!</p>
        <p style="margin-top: 30px; color: #666; font-size: 12px;">Best regards,<br>SurveyTask Team</p>
      </div>
    `;
    return emailService.sendEmail(to, 'Welcome to SurveyTask', html);
  },

  sendSurveyApprovalEmail: async (to, taskTitle, reward) => {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #22C55E;">Survey Approved! 🎉</h2>
        <p>Great news! Your survey for "<strong>${taskTitle}</strong>" has been approved.</p>
        <div style="background-color: #22C55E10; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Reward: ₹${reward}</strong> has been credited to your wallet.</p>
        </div>
        <p>Keep up the great work!</p>
        <p style="margin-top: 30px; color: #666; font-size: 12px;">Best regards,<br>SurveyTask Team</p>
      </div>
    `;
    return emailService.sendEmail(to, 'Survey Approved - Reward Credited', html);
  },

  sendSurveyRejectionEmail: async (to, taskTitle, reason) => {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #EF4444;">Survey Status Update</h2>
        <p>Your survey for "<strong>${taskTitle}</strong>" was not approved.</p>
        ${reason ? `<div style="background-color: #EF444410; padding: 15px; border-radius: 8px; margin: 20px 0;"><p style="margin: 0;"><strong>Reason:</strong> ${reason}</p></div>` : ''}
        <p>Please review the guidelines and submit again.</p>
        <p style="margin-top: 30px; color: #666; font-size: 12px;">Best regards,<br>SurveyTask Team</p>
      </div>
    `;
    return emailService.sendEmail(to, 'Survey Status Update', html);
  },

  sendKYCStatusEmail: async (to, status, reason) => {
    const isApproved = status === 'approved';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: ${isApproved ? '#22C55E' : '#EF4444'};">
          KYC Verification ${isApproved ? 'Approved' : 'Rejected'}
        </h2>
        <p>Your KYC verification has been <strong>${status}</strong>.</p>
        ${!isApproved && reason ? `<div style="background-color: #EF444410; padding: 15px; border-radius: 8px; margin: 20px 0;"><p style="margin: 0;"><strong>Reason:</strong> ${reason}</p></div>` : ''}
        ${isApproved ? '<p style="color: #22C55E; font-weight: bold;">You can now withdraw your earnings!</p>' : '<p>Please update your information and resubmit.</p>'}
        <p style="margin-top: 30px; color: #666; font-size: 12px;">Best regards,<br>ReviewTask Team</p>
      </div>
    `;
    return emailService.sendEmail(to, `KYC Verification ${isApproved ? 'Approved' : 'Rejected'}`, html);
  }
};

module.exports = emailService;

