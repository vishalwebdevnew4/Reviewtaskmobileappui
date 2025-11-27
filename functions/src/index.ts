// Cloud Functions for ReviewTask Mobile App
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

/**
 * Middleware to verify admin authentication
 */
const verifyAdmin = async (context: functions.https.CallableContext): Promise<boolean> => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userDoc = await db.collection('users').doc(context.auth.uid).get();
  const userData = userDoc.data();
  
  if (userData?.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required');
  }

  return true;
};

/**
 * Approve a review and add reward to user earnings
 */
export const approveReview = functions.https.onCall(async (data, context) => {
  await verifyAdmin(context);

  const { reviewId } = data;
  if (!reviewId) {
    throw new functions.https.HttpsError('invalid-argument', 'Review ID is required');
  }

  const reviewRef = db.collection('reviews').doc(reviewId);
  const reviewDoc = await reviewRef.get();

  if (!reviewDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Review not found');
  }

  const reviewData = reviewDoc.data();
  if (reviewData?.status === 'approved') {
    throw new functions.https.HttpsError('already-exists', 'Review already approved');
  }

  // Update review status
  await reviewRef.update({
    status: 'approved',
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Add reward to user earnings
  const userRef = db.collection('users').doc(reviewData.userId);
  await userRef.update({
    earnings: admin.firestore.FieldValue.increment(reviewData.rewardAmount),
    totalEarnings: admin.firestore.FieldValue.increment(reviewData.rewardAmount),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, message: 'Review approved and reward added' };
});

/**
 * Reject a review
 */
export const rejectReview = functions.https.onCall(async (data, context) => {
  await verifyAdmin(context);

  const { reviewId, reason } = data;
  if (!reviewId) {
    throw new functions.https.HttpsError('invalid-argument', 'Review ID is required');
  }

  const reviewRef = db.collection('reviews').doc(reviewId);
  const reviewDoc = await reviewRef.get();

  if (!reviewDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Review not found');
  }

  await reviewRef.update({
    status: 'rejected',
    adminNotes: reason || 'Review rejected by admin',
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, message: 'Review rejected' };
});

/**
 * Approve KYC request
 */
export const approveKYC = functions.https.onCall(async (data, context) => {
  await verifyAdmin(context);

  const { kycId } = data;
  if (!kycId) {
    throw new functions.https.HttpsError('invalid-argument', 'KYC ID is required');
  }

  const kycRef = db.collection('kyc_requests').doc(kycId);
  const kycDoc = await kycRef.get();

  if (!kycDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'KYC request not found');
  }

  const kycData = kycDoc.data();

  // Update KYC status
  await kycRef.update({
    status: 'approved',
    reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Update user profile
  const userRef = db.collection('users').doc(kycData.userId);
  await userRef.update({
    kycStatus: 'approved',
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, message: 'KYC approved' };
});

/**
 * Reject KYC request
 */
export const rejectKYC = functions.https.onCall(async (data, context) => {
  await verifyAdmin(context);

  const { kycId, reason } = data;
  if (!kycId) {
    throw new functions.https.HttpsError('invalid-argument', 'KYC ID is required');
  }

  const kycRef = db.collection('kyc_requests').doc(kycId);
  const kycDoc = await kycRef.get();

  if (!kycDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'KYC request not found');
  }

  const kycData = kycDoc.data();

  // Update KYC status
  await kycRef.update({
    status: 'rejected',
    adminNotes: reason || 'KYC rejected by admin',
    reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Update user profile
  const userRef = db.collection('users').doc(kycData.userId);
  await userRef.update({
    kycStatus: 'rejected',
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, message: 'KYC rejected' };
});

/**
 * Approve withdrawal request
 */
export const approveWithdrawal = functions.https.onCall(async (data, context) => {
  await verifyAdmin(context);

  const { withdrawalId, transactionId } = data;
  if (!withdrawalId) {
    throw new functions.https.HttpsError('invalid-argument', 'Withdrawal ID is required');
  }

  const withdrawalRef = db.collection('withdrawals').doc(withdrawalId);
  const withdrawalDoc = await withdrawalRef.get();

  if (!withdrawalDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Withdrawal not found');
  }

  const withdrawalData = withdrawalDoc.data();
  
  if (withdrawalData.status !== 'pending') {
    throw new functions.https.HttpsError('failed-precondition', 'Withdrawal already processed');
  }

  // Check user balance
  const userRef = db.collection('users').doc(withdrawalData.userId);
  const userDoc = await userRef.get();
  const userData = userDoc.data();

  if ((userData?.earnings || 0) < withdrawalData.amount) {
    throw new functions.https.HttpsError('failed-precondition', 'Insufficient balance');
  }

  // Deduct amount from user earnings
  await userRef.update({
    earnings: admin.firestore.FieldValue.increment(-withdrawalData.amount),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Update withdrawal status
  await withdrawalRef.update({
    status: 'approved',
    transactionId: transactionId || '',
    processedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, message: 'Withdrawal approved' };
});

/**
 * Reject withdrawal request
 */
export const rejectWithdrawal = functions.https.onCall(async (data, context) => {
  await verifyAdmin(context);

  const { withdrawalId, reason } = data;
  if (!withdrawalId) {
    throw new functions.https.HttpsError('invalid-argument', 'Withdrawal ID is required');
  }

  const withdrawalRef = db.collection('withdrawals').doc(withdrawalId);
  const withdrawalDoc = await withdrawalRef.get();

  if (!withdrawalDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Withdrawal not found');
  }

  await withdrawalRef.update({
    status: 'rejected',
    adminNotes: reason || 'Withdrawal rejected by admin',
    processedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, message: 'Withdrawal rejected' };
});

