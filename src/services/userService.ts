// User Service
// Handles user-related operations and earnings
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getUserProfile } from './authService';

export interface UserEarnings {
  totalEarnings: number;
  availableBalance: number;
  pendingEarnings: number;
  withdrawnAmount: number;
}

/**
 * Get user earnings summary
 */
export const getUserEarnings = async (userId: string): Promise<UserEarnings> => {
  try {
    const userProfile = await getUserProfile(userId);
    if (!userProfile) {
      throw new Error('User not found');
    }

    // Calculate pending earnings from pending reviews
    const { getPendingEarnings } = await import('./reviewService');
    const pendingEarnings = await getPendingEarnings(userId);

    // Calculate withdrawn amount from withdrawals
    const { getUserWithdrawals } = await import('./withdrawalService');
    const withdrawals = await getUserWithdrawals(userId);
    const withdrawnAmount = withdrawals
      .filter((w) => w.status === 'approved' || w.status === 'completed')
      .reduce((sum, w) => sum + w.amount, 0);

    return {
      totalEarnings: userProfile.totalEarnings || 0,
      availableBalance: userProfile.earnings || 0,
      pendingEarnings,
      withdrawnAmount,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get user earnings');
  }
};

/**
 * Get earnings by category
 */
export const getEarningsByCategory = async (userId: string): Promise<Record<string, number>> => {
  try {
    const { getUserReviews } = await import('./reviewService');
    const reviews = await getUserReviews(userId);
    const approvedReviews = reviews.filter((r) => r.status === 'approved');

    const categoryEarnings: Record<string, number> = {};

    for (const review of approvedReviews) {
      const { getTaskById } = await import('./taskService');
      const task = await getTaskById(review.taskId);
      if (task) {
        const category = task.category || 'other';
        categoryEarnings[category] = (categoryEarnings[category] || 0) + review.rewardAmount;
      }
    }

    return categoryEarnings;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get earnings by category');
  }
};

