# Email Setup Instructions

## Quick Start

The email backend server is now set up and ready to use!

### Starting the Email Server

**Option 1: Using npm script (Recommended)**
```bash
npm run email:server
```

**Option 2: Manual start**
```bash
cd backend
node server.js
```

The server will start on `http://localhost:3001`

### Verifying the Server is Running

1. Open your browser and go to: `http://localhost:3001/health`
2. You should see: `{"status":"ok","message":"Email service is running"}`

### Testing Email Functionality

1. Make sure the backend server is running
2. Go to the Forgot Password screen in your app
3. Enter your email address
4. Click "Send Reset Link"
5. Check your email inbox (and spam folder)

## Troubleshooting

### Email Not Received?

1. **Check if server is running**: Visit `http://localhost:3001/health`
2. **Check browser console**: Look for any error messages
3. **Check server logs**: The server terminal will show email sending status
4. **Check spam folder**: Emails might be filtered as spam
5. **Gmail App Password**: If using Gmail, you may need to:
   - Enable 2-Step Verification
   - Generate an App Password: https://support.google.com/accounts/answer/185833
   - Update the password in `backend/email-service.js`

### Server Won't Start?

1. Make sure Node.js is installed: `node --version`
2. Install dependencies: `cd backend && npm install`
3. Check if port 3001 is already in use

### Gmail Authentication Issues

If you see authentication errors:
1. Go to Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password
4. Update `backend/email-service.js` with the new App Password

## Current Email Configuration

- **SMTP Host**: smtp.gmail.com
- **Port**: 587
- **From Email**: mailnotificationstesting@gmail.com
- **Username**: admmailnotificationstesting@gmail.com

## Notes

- The server must be running for emails to be sent
- For production, use environment variables for email credentials
- Consider using a dedicated email service (SendGrid, Mailgun, etc.) for better deliverability

