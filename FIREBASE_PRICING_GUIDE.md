# Firebase Pricing Guide - What's Free vs Paid

## ✅ FREE Features (Spark Plan - No Credit Card Required)

### Authentication
- ✅ **Email/Password** - **100% FREE** (unlimited)
- ✅ **Google Sign-In** - **100% FREE** (unlimited)
- ✅ **Password Reset Emails** - **100% FREE** (unlimited)

### Firestore Database
- ✅ **50,000 reads/day** - FREE
- ✅ **20,000 writes/day** - FREE
- ✅ **20,000 deletes/day** - FREE
- ✅ **1 GB storage** - FREE

### Storage
- ✅ **5 GB storage** - FREE
- ✅ **1 GB downloads/day** - FREE

### Cloud Functions
- ✅ **2 million invocations/month** - FREE
- ✅ **400,000 GB-seconds compute time** - FREE
- ✅ **200,000 CPU-seconds** - FREE

## 💰 PAID Features (Blaze Plan - Pay as you go)

### Phone Authentication
- ❌ **NOT FREE** - Requires Blaze Plan
- 💰 **First 10,000 verifications/month** - FREE
- 💰 **After that: $0.06 per verification**

### Additional Usage (if you exceed free tier)
- 💰 Firestore: $0.06 per 100K reads (after free tier)
- 💰 Storage: $0.026 per GB/month (after free tier)
- 💰 Functions: $0.40 per million invocations (after free tier)

## 🎯 Your Current Setup - What Works FREE

### ✅ Works 100% FREE:
1. **Email/Password Login** ✅
2. **Google Sign-In** ✅
3. **User Registration** ✅
4. **Password Reset** ✅
5. **Firestore Database** (up to free limits) ✅
6. **File Storage** (up to free limits) ✅
7. **Cloud Functions** (up to free limits) ✅

### ❌ Requires Payment:
1. **Phone OTP** - Needs Blaze Plan upgrade

## 💡 Recommendation

### For Development/Testing:
- **Use FREE Spark Plan** ✅
- Use Email/Password + Google Sign-In
- Everything else works perfectly!

### For Production:
- **Start with FREE Spark Plan**
- Monitor usage in Firebase Console
- Upgrade to Blaze only if you:
  - Need Phone OTP
  - Exceed free tier limits
  - Want to scale beyond free limits

## 📊 Free Tier Limits (Per Day)

| Service | Free Limit | Typical Usage |
|---------|-----------|---------------|
| Firestore Reads | 50,000/day | ~1,000 users/day |
| Firestore Writes | 20,000/day | ~500 new records/day |
| Storage | 5 GB total | ~1,000 images |
| Functions | 2M/month | ~66K/day |

**For most apps, free tier is MORE than enough!**

## 🚀 Cost Estimate for Your App

### Small App (< 1,000 users):
- **Cost: $0/month** ✅
- Everything works on free tier

### Medium App (1,000-10,000 users):
- **Cost: $0-10/month** (if you stay within free tier)
- Only pay if you exceed limits

### Large App (10,000+ users):
- **Cost: $10-50/month** (pay-as-you-go)
- Only pay for what you use beyond free tier

## ✅ Summary

**YES! Almost everything is FREE:**

- ✅ Email/Password Auth - FREE
- ✅ Google Sign-In - FREE  
- ✅ Database - FREE (up to limits)
- ✅ Storage - FREE (up to limits)
- ✅ Cloud Functions - FREE (up to limits)

**Only Phone OTP requires payment** (but you can use it later when needed)

## 🎯 Current Status

Your app is configured to use:
- ✅ Email/Password (FREE)
- ✅ Google Sign-In (FREE)
- ⏸️ Phone OTP (requires upgrade - but not needed now)

**You can use the app 100% FREE right now!**

