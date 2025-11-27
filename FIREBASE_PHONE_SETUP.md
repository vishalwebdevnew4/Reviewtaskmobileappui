# Enable Phone Authentication in Firebase

## Step-by-Step Guide

### 1. Go to Firebase Console
Visit: https://console.firebase.google.com/project/tournament-app-42bf9

### 2. Navigate to Authentication
- Click on **"Authentication"** in the left sidebar
- If you see "Get started", click it to enable Authentication

### 3. Enable Phone Sign-in Method
- Click on the **"Sign-in method"** tab
- Find **"Phone"** in the list of providers
- Click on **"Phone"** to open settings
- Toggle **"Enable"** to ON
- Click **"Save"**

### 4. Configure reCAPTCHA (if needed)
- Firebase will automatically use reCAPTCHA v3 for phone authentication
- For testing, you can add test phone numbers:
  - Scroll down to "Phone numbers for testing"
  - Click "Add phone number"
  - Add your test number (e.g., +91 9876543210)
  - Add the test code (e.g., 123456)

### 5. Verify Setup
- Make sure Phone provider shows as "Enabled"
- The status should be green/active

## Important Notes

1. **Billing**: Phone authentication requires a paid Firebase plan (Blaze plan)
   - Free tier (Spark) does NOT support phone authentication
   - You need to upgrade to Blaze (pay-as-you-go) plan

2. **Quota**: 
   - Free tier: 0 phone verifications
   - Blaze plan: First 10,000 verifications/month are free, then $0.06 per verification

3. **Testing**: 
   - Use test phone numbers during development to avoid charges
   - Test numbers work without sending real SMS

## Alternative: Use Email Authentication Only

If you can't enable phone authentication, we can modify the app to use email-only authentication. Let me know if you'd like me to do that.

