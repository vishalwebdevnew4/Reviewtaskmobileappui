# Brevo SMTP Configuration

## ✅ SMTP Credentials Added

Your Brevo SMTP credentials have been added to `.env` file:

```
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_AUTH_USER=75ce2b001@smtp-brevo.com
SMTP_AUTH_PASS=pFz25Iy7D8UZgfNm
EMAIL_FROM=vishal.sadyal@xcelance.com
EMAIL_TO=vishal.sadyal@xcelance.com
```

## 📧 Current Email Setup

**Note:** Firebase Authentication automatically handles:
- ✅ Password reset emails
- ✅ Email verification (if enabled)
- ✅ Account creation emails

**You don't need SMTP for basic authentication features.**

## 🔧 When to Use Brevo SMTP

Use Brevo SMTP if you want to send:
- Custom notification emails
- Admin notifications
- Marketing emails
- Transactional emails (beyond Firebase)

## 🚀 How to Use Brevo SMTP

### Option 1: Cloud Functions (Recommended)

Create a Cloud Function to send emails using Brevo:

```javascript
// functions/src/emailService.ts
import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_AUTH_USER,
    pass: process.env.SMTP_AUTH_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};
```

### Option 2: Backend API

If you have a separate backend server, use these credentials there.

## 🔒 Security Note

⚠️ **Important:** The `.env` file is in `.gitignore` and should NOT be committed to Git.

Your SMTP credentials are secure and only accessible server-side.

## 📝 Next Steps

1. **For now:** Firebase handles all authentication emails automatically
2. **Later:** Use Brevo SMTP for custom email notifications via Cloud Functions
3. **Test:** You can test SMTP connection from Cloud Functions

## ✅ Status

- ✅ SMTP credentials added to `.env`
- ✅ TypeScript types updated
- ✅ Ready for Cloud Functions integration

