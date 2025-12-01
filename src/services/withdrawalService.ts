// Withdrawal Service
// Handles withdrawal requests
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { getKYCStatus } from './kycService';

export interface Withdrawal {
  id?: string;
  userId: string;
  amount: number;
  method: 'upi' | 'bank' | 'paytm';
  accountDetails: {
    upiId?: string;
    accountNumber?: string;
    ifscCode?: string;
    paytmNumber?: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedAt: Date;
  processedAt?: Date;
  adminNotes?: string;
  transactionId?: string;
}

/**
 * Request withdrawal
 */
export const requestWithdrawal = async (
  userId: string,
  amount: number,
  method: 'upi' | 'bank' | 'paytm',
  accountDetails: Withdrawal['accountDetails']
): Promise<string> => {
  try {
    // Check KYC status
    const kycStatus = await getKYCStatus(userId);
    if (kycStatus !== 'approved') {
      throw new Error('KYC verification required before withdrawal');
    }

    // Validate amount
    if (amount < 100) {
      throw new Error('Minimum withdrawal amount is ₹100');
    }

    // Get user balance
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    const userData = userDoc.data();
    const availableBalance = userData.earnings || 0;

    if (amount > availableBalance) {
      throw new Error('Insufficient balance');
    }

    // Validate account details based on method
    if (method === 'upi' && !accountDetails.upiId) {
      throw new Error('UPI ID is required');
    }
    if (method === 'bank' && (!accountDetails.accountNumber || !accountDetails.ifscCode)) {
      throw new Error('Account number and IFSC code are required');
    }
    if (method === 'paytm' && !accountDetails.paytmNumber) {
      throw new Error('Paytm number is required');
    }

    // Create withdrawal request
    const withdrawalData: Omit<Withdrawal, 'id'> = {
      userId,
      amount,
      method,
      accountDetails,
      status: 'pending',
      requestedAt: new Date(),
    };

    const withdrawalRef = await addDoc(collection(db, 'withdrawals'), {
      ...withdrawalData,
      requestedAt: Timestamp.fromDate(withdrawalData.requestedAt),
    });

    // Note: Amount will be deducted from user earnings when admin approves
    // This is handled by Cloud Functions (see functions/index.ts)

    return withdrawalRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to request withdrawal');
  }
};

/**
 * Get user's withdrawal history
 */
export const getUserWithdrawals = async (userId: string): Promise<Withdrawal[]> => {
  try {
    const withdrawalsRef = collection(db, 'withdrawals');
    const q = query(
      withdrawalsRef,
      where('userId', '==', userId),
      orderBy('requestedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        requestedAt: data.requestedAt?.toDate() || new Date(),
        processedAt: data.processedAt?.toDate(),
      } as Withdrawal;
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch withdrawals');
  }
};

/**
 * Get withdrawal by ID
 */
export const getWithdrawalById = async (withdrawalId: string): Promise<Withdrawal | null> => {
  try {
    const withdrawalDoc = await getDoc(doc(db, 'withdrawals', withdrawalId));
    if (withdrawalDoc.exists()) {
      const data = withdrawalDoc.data();
      return {
        id: withdrawalDoc.id,
        ...data,
        requestedAt: data.requestedAt?.toDate() || new Date(),
        processedAt: data.processedAt?.toDate(),
      } as Withdrawal;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch withdrawal');
  }
};

