# Backend Email Service Setup

## Important Security Note

**DO NOT use SMTP credentials directly in the frontend React app.** This exposes your credentials and is a security risk.

## Setup Instructions

### Option 1: Create a Simple Backend API (Recommended)

1. Create a new Node.js backend project:
```bash
mkdir backend
cd backend
npm init -y
npm install express nodemailer cors
```

2. Create `server.js`:
```javascript
const express = require('express');
const cors = require('cors');
const emailService = require('./email-service');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/send-email', async (req, res) => {
  const { to, subject, html, type, data } = req.body;
  
  try {
    let result;
    switch(type) {
      case 'password-reset':
        result = await emailService.sendPasswordResetEmail(to, data.token);
        break;
      case 'welcome':
        result = await emailService.sendWelcomeEmail(to, data.name);
        break;
      case 'review-approval':
        result = await emailService.sendReviewApprovalEmail(to, data.taskTitle, data.reward);
        break;
      case 'review-rejection':
        result = await emailService.sendReviewRejectionEmail(to, data.taskTitle, data.reason);
        break;
      case 'kyc-status':
        result = await emailService.sendKYCStatusEmail(to, data.status, data.reason);
        break;
      default:
        result = await emailService.sendEmail(to, subject, html);
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Email service running on port ${PORT}`);
});
```

3. Update `src/config/email.ts` to call your backend:
```typescript
export const emailService = {
  sendEmail: async (to: string, subject: string, html: string, type?: string, data?: any) => {
    const response = await fetch('http://localhost:3001/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, html, type, data })
    });
    return response.json();
  },
  // ... other methods
};
```

### Option 2: Use EmailJS (Frontend-friendly, Free tier available)

1. Sign up at https://www.emailjs.com/
2. Install: `npm install @emailjs/browser`
3. Update `src/config/email.ts` to use EmailJS

### Option 3: Use a Backend-as-a-Service

- Firebase Functions
- AWS Lambda
- Vercel Serverless Functions
- Netlify Functions

## Email Configuration

The SMTP credentials are stored in `backend/email-service.js`:
- Host: smtp.gmail.com
- Port: 587
- Username: admmailnotificationstesting@gmail.com
- From: mailnotificationstesting@gmail.com

## Gmail Setup

If using Gmail, you may need to:
1. Enable "Less secure app access" (not recommended)
2. OR use an App Password: https://support.google.com/accounts/answer/185833
3. OR enable 2-Step Verification and generate an App Password

## Testing

Test the email service:
```javascript
const emailService = require('./email-service');
emailService.sendWelcomeEmail('test@example.com', 'Test User')
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

