# Enable Real OTP (SMS) in Firebase

## Step 1: Upgrade to Blaze Plan (Required)

Phone Authentication with real SMS requires a **paid Firebase plan** (Blaze).

### How to Upgrade:

1. Go to Firebase Console: https://console.firebase.google.com/project/tournament-app-42bf9
2. Click on **⚙️ Settings** (gear icon) → **Usage and billing**
3. Click **"Modify plan"** or **"Upgrade"**
4. Select **Blaze Plan** (Pay as you go)
5. Complete the billing setup:
   - Add a payment method (credit card)
   - Accept terms
   - Confirm upgrade

**Note**: 
- First 10,000 phone verifications/month are **FREE**
- After that: $0.06 per verification
- You only pay for what you use beyond the free tier

## Step 2: Enable Phone Authentication

1. In Firebase Console, go to **Authentication**
2. Click **"Get started"** if you haven't enabled it yet
3. Go to **"Sign-in method"** tab
4. Find **"Phone"** in the providers list
5. Click on **"Phone"**
6. Toggle **"Enable"** to **ON**
7. Click **"Save"**

## Step 3: Configure reCAPTCHA (Automatic)

Firebase automatically handles reCAPTCHA v3 for phone authentication. No manual configuration needed.

## Step 4: Verify Setup

1. Check that Phone shows as **"Enabled"** (green checkmark)
2. Your app should now send real OTP via SMS

## Step 5: Test Real OTP

1. Open your app: http://localhost:3000
2. Enter a real phone number (e.g., +91 9876543210)
3. Click "Send OTP"
4. You should receive an SMS with the verification code
5. Enter the code to verify

## Cost Information

- **Free Tier**: 10,000 verifications/month
- **After Free Tier**: $0.06 per verification
- **Example**: 15,000 verifications = $0.30 (only 5,000 are charged)

## Troubleshooting

### Still getting "operation-not-allowed"?
- Make sure Phone is enabled in Sign-in method
- Wait 1-2 minutes after enabling (propagation delay)
- Clear browser cache and try again

### Not receiving SMS?
- Check phone number format: Must include country code (e.g., +91 for India)
- Verify phone number is correct
- Check spam folder
- Wait up to 2 minutes for SMS delivery

### Billing concerns?
- You can set budget alerts in Google Cloud Console
- First 10K verifications are free
- You can disable phone auth anytime

## Security Notes

- Firebase handles all SMS delivery securely
- OTP codes expire after a few minutes
- Rate limiting is automatically applied
- No need to store phone numbers in your code

