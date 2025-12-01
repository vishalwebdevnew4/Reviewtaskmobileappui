// Review Service
// Handles review submission and management
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

export interface Review {
  id?: string;
  userId: string;
  taskId: string;
  rating: number;
  reviewText: string;
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
  rewardAmount: number;
  createdAt: Date;
  updatedAt: Date;
  adminNotes?: string;
}

/**
 * Upload image to Firebase Storage
 */
export const uploadReviewImage = async (
  file: File,
  userId: string,
  taskId: string,
  index: number
): Promise<string> => {
  try {
    const fileName = `reviews/${userId}/${taskId}/${Date.now()}_${index}_${file.name}`;
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to upload image');
  }
};

/**
 * Submit a review
 */
export const submitReview = async (
  userId: string,
  taskId: string,
  rating: number,
  reviewText: string,
  images: File[]
): Promise<string> => {
  try {
    // Validate inputs
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    if (reviewText.length < 50) {
      throw new Error('Review text must be at least 50 characters');
    }
    if (images.length < 2) {
      throw new Error('At least 2 images are required');
    }

    // Upload images
    const imageUrls: string[] = [];
    for (let i = 0; i < images.length; i++) {
      const url = await uploadReviewImage(images[i], userId, taskId, i);
      imageUrls.push(url);
    }

    // Get task to determine reward
    const taskDoc = await getDoc(doc(db, 'tasks', taskId));
    if (!taskDoc.exists()) {
      throw new Error('Task not found');
    }
    const taskData = taskDoc.data();
    const rewardAmount = taskData.reward || 0;

    // Create review document
    const reviewData: Omit<Review, 'id'> = {
      userId,
      taskId,
      rating,
      reviewText,
      images: imageUrls,
      status: 'pending',
      rewardAmount,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const reviewRef = await addDoc(collection(db, 'reviews'), {
      ...reviewData,
      createdAt: Timestamp.fromDate(reviewData.createdAt),
      updatedAt: Timestamp.fromDate(reviewData.updatedAt),
    });

    // Note: Reward will be added to user earnings when admin approves the review
    // This is handled by Cloud Functions (see functions/index.ts)

    return reviewRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to submit review');
  }
};

/**
 * Get user's reviews
 */
export const getUserReviews = async (userId: string): Promise<Review[]> => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(
      reviewsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Review;
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch reviews');
  }
};

/**
 * Get review by ID
 */
export const getReviewById = async (reviewId: string): Promise<Review | null> => {
  try {
    const reviewDoc = await getDoc(doc(db, 'reviews', reviewId));
    if (reviewDoc.exists()) {
      const data = reviewDoc.data();
      return {
        id: reviewDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Review;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch review');
  }
};

/**
 * Get reviews by task ID
 */
export const getReviewsByTaskId = async (taskId: string): Promise<Review[]> => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(
      reviewsRef,
      where('taskId', '==', taskId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Review;
    });
  } catch (error: any) {
    console.error('Error fetching reviews by task:', error);
    return [];
  }
};

/**
 * Get pending earnings for user
 */
export const getPendingEarnings = async (userId: string): Promise<number> => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(
      reviewsRef,
      where('userId', '==', userId),
      where('status', '==', 'pending')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.reduce((sum, doc) => {
      const data = doc.data();
      return sum + (data.rewardAmount || 0);
    }, 0);
  } catch (error: any) {
    return 0;
  }
};

