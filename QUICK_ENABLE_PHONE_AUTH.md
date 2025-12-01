# ⚡ Quick Fix: Enable Phone Authentication

## 🚨 You're seeing this error because Phone Auth is not enabled in Firebase

### ✅ Solution (2 Steps):

## Step 1: Enable Phone Authentication (30 seconds)

1. **Open this link directly:**
   https://console.firebase.google.com/project/tournament-app-42bf9/authentication/providers

2. **Click on "Phone"** in the providers list

3. **Toggle "Enable" to ON** (green)

4. **Click "Save"**

5. **Wait 30 seconds** for changes to propagate

## Step 2: Upgrade to Blaze Plan (Required for Real SMS)

**⚠️ IMPORTANT:** Phone Authentication requires a paid plan (Blaze).

1. **Go to:** https://console.firebase.google.com/project/tournament-app-42bf9/settings/usage

2. **Click "Modify plan"** or **"Upgrade"**

3. **Select "Blaze Plan"** (Pay as you go)

4. **Add payment method** (credit card)

5. **Confirm upgrade**

**💰 Cost:** 
- First 10,000 verifications/month = **FREE**
- After that = $0.06 per verification
- You can set budget alerts

## ✅ Verify It's Working

1. Refresh your app
2. Try sending OTP again
3. You should receive a real SMS!

## 🔍 Still Not Working?

### Check 1: Is Phone Enabled?
- Go to: https://console.firebase.google.com/project/tournament-app-42bf9/authentication/providers
- Phone should show as **"Enabled"** with a green checkmark

### Check 2: Is Blaze Plan Active?
- Go to: https://console.firebase.google.com/project/tournament-app-42bf9/settings/usage
- Should show **"Blaze (Pay as you go)"** plan

### Check 3: Wait Time
- After enabling, wait 1-2 minutes
- Clear browser cache
- Try again

## 📞 Need Help?

If you've done both steps and it's still not working:
1. Check browser console for detailed errors
2. Verify your Firebase project ID matches: `tournament-app-42bf9`
3. Make sure you're logged into the correct Firebase account

