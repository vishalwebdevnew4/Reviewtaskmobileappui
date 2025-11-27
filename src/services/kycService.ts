// KYC Service
// Handles KYC verification flow
import {
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

export interface KYCRequest {
  id?: string;
  userId: string;
  fullName: string;
  dob: string;
  phone: string;
  email: string;
  documentType: 'aadhaar' | 'pan';
  documentFront: string;
  documentBack: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  adminNotes?: string;
}

/**
 * Upload KYC document
 */
export const uploadKYCDocument = async (
  file: File,
  userId: string,
  type: 'front' | 'back',
  documentType: 'aadhaar' | 'pan'
): Promise<string> => {
  try {
    const fileName = `kyc/${userId}/${documentType}_${type}_${Date.now()}_${file.name}`;
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to upload document');
  }
};

/**
 * Submit KYC request
 */
export const submitKYC = async (
  userId: string,
  fullName: string,
  dob: string,
  phone: string,
  email: string,
  documentType: 'aadhaar' | 'pan',
  documentFront: File,
  documentBack: File
): Promise<string> => {
  try {
    // Check if user already has a KYC request
    const existingKYC = await getKYCByUserId(userId);
    if (existingKYC && existingKYC.status === 'pending') {
      throw new Error('KYC request already pending');
    }
    if (existingKYC && existingKYC.status === 'approved') {
      throw new Error('KYC already approved');
    }

    // Upload documents
    const [frontUrl, backUrl] = await Promise.all([
      uploadKYCDocument(documentFront, userId, 'front', documentType),
      uploadKYCDocument(documentBack, userId, 'back', documentType),
    ]);

    // Create KYC request
    const kycData: Omit<KYCRequest, 'id'> = {
      userId,
      fullName,
      dob,
      phone,
      email,
      documentType,
      documentFront: frontUrl,
      documentBack: backUrl,
      status: 'pending',
      submittedAt: new Date(),
    };

    const kycRef = await addDoc(collection(db, 'kyc_requests'), {
      ...kycData,
      submittedAt: Timestamp.fromDate(kycData.submittedAt),
    });

    // Update user profile with KYC status
    await updateDoc(doc(db, 'users', userId), {
      kycStatus: 'pending',
      updatedAt: Timestamp.now(),
    });

    return kycRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to submit KYC');
  }
};

/**
 * Get KYC request by user ID
 */
export const getKYCByUserId = async (userId: string): Promise<KYCRequest | null> => {
  try {
    const kycRef = collection(db, 'kyc_requests');
    const q = query(kycRef, where('userId', '==', userId), where('status', '!=', 'rejected'));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        submittedAt: data.submittedAt?.toDate() || new Date(),
        reviewedAt: data.reviewedAt?.toDate(),
      } as KYCRequest;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch KYC request');
  }
};

/**
 * Get KYC status for user
 */
export const getKYCStatus = async (userId: string): Promise<'pending' | 'approved' | 'rejected' | 'not_submitted'> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().kycStatus || 'not_submitted';
    }
    return 'not_submitted';
  } catch (error: any) {
    return 'not_submitted';
  }
};

