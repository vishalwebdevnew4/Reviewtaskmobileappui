// Task Service
// Handles task-related operations
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

export interface Task {
  id: string;
  title: string;
  brand: string;
  description: string;
  image: string;
  reward: number;
  deadline: Date;
  category: 'tech' | 'food' | 'health' | 'fashion' | 'apps' | 'all';
  tag?: string;
  status: 'active' | 'completed' | 'expired';
  createdAt: Date;
  updatedAt: Date;
  requirements?: string[];
  maxSubmissions?: number;
  currentSubmissions?: number;
}

/**
 * Get all active tasks
 */
export const getActiveTasks = async (): Promise<Task[]> => {
  try {
    const tasksRef = collection(db, 'tasks');
    const q = query(
      tasksRef,
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        deadline: data.deadline?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Task;
    });
  } catch (error: any) {
    console.error('Error in getActiveTasks:', error);
    // Return empty array instead of throwing to prevent infinite loading
    return [];
  }
};

/**
 * Get tasks by category
 */
export const getTasksByCategory = async (category: string): Promise<Task[]> => {
  try {
    const tasksRef = collection(db, 'tasks');
    let q;
    
    if (category === 'all') {
      q = query(
        tasksRef,
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );
    } else {
      // Try category query first
      try {
        q = query(
          tasksRef,
          where('status', '==', 'active'),
          where('category', '==', category),
          orderBy('createdAt', 'desc')
        );
      } catch (indexError) {
        // If index missing, get all and filter client-side
        console.warn('Category index missing, filtering client-side');
        q = query(
          tasksRef,
          where('status', '==', 'active'),
          orderBy('createdAt', 'desc')
        );
      }
    }
    
    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        deadline: data.deadline?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Task;
    });
    
    // If category is not 'all' and we got all tasks (due to missing index), filter client-side
    if (category !== 'all') {
      return tasks.filter(task => task.category === category);
    }
    
    return tasks;
  } catch (error: any) {
    console.error('Error in getTasksByCategory:', error);
    // Return empty array instead of throwing to prevent infinite loading
    return [];
  }
};

/**
 * Get featured tasks (tasks with tags)
 */
export const getFeaturedTasks = async (): Promise<Task[]> => {
  try {
    // Simplified query - get all active tasks and filter for tags client-side
    // This avoids complex index requirements
    const tasksRef = collection(db, 'tasks');
    const q = query(
      tasksRef,
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
      limit(20) // Get more to filter
    );
    
    const querySnapshot = await getDocs(q);
    const allTasks = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        deadline: data.deadline?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Task;
    });
    
    // Filter for tasks with tags and return first 6
    return allTasks.filter(task => task.tag).slice(0, 6);
  } catch (error: any) {
    console.error('Error in getFeaturedTasks:', error);
    // If query fails, return empty array instead of calling getActiveTasks (which might also fail)
    return [];
  }
};

/**
 * Get task by ID
 */
export const getTaskById = async (taskId: string): Promise<Task | null> => {
  try {
    const taskDoc = await getDoc(doc(db, 'tasks', taskId));
    if (taskDoc.exists()) {
      const data = taskDoc.data();
      return {
        id: taskDoc.id,
        ...data,
        deadline: data.deadline?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Task;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch task');
  }
};

/**
 * Get user's completed tasks
 */
export const getUserTasks = async (userId: string): Promise<Task[]> => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(
      reviewsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const taskIds = querySnapshot.docs.map((doc) => doc.data().taskId);
    
    // Fetch task details for each review
    const tasks: Task[] = [];
    for (const taskId of taskIds) {
      const task = await getTaskById(taskId);
      if (task) {
        tasks.push(task);
      }
    }
    
    return tasks;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch user tasks');
  }
};

/**
 * Upload task image to Firebase Storage
 */
export const uploadTaskImage = async (imageData: string, taskId?: string): Promise<string> => {
  try {
    // If it's already a URL, return it
    if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
      return imageData;
    }

    // If it's a base64 data URL, convert to blob and upload
    if (imageData.startsWith('data:image/')) {
      // Convert base64 to blob
      const response = await fetch(imageData);
      const blob = await response.blob();
      
      // Check file size (limit to 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (blob.size > maxSize) {
        console.warn('Image too large, skipping upload. Size:', blob.size, 'Max:', maxSize);
        return ''; // Return empty string if too large
      }
      
      // Create a file name
      const fileName = taskId 
        ? `tasks/${taskId}/image_${Date.now()}.${blob.type.split('/')[1] || 'png'}`
        : `tasks/temp/image_${Date.now()}.${blob.type.split('/')[1] || 'png'}`;
      
      console.log('Uploading image to Storage:', fileName, 'Size:', blob.size);
      const storageRef = ref(storage, fileName);
      
      // Add timeout for upload (20 seconds)
      const uploadPromise = uploadBytes(storageRef, blob);
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Upload timeout')), 20000);
      });
      
      await Promise.race([uploadPromise, timeoutPromise]);
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Image uploaded successfully:', downloadURL);
      return downloadURL;
    }

    // If it's not a valid format, return empty string
    return '';
  } catch (error: any) {
    console.error('Error uploading task image:', error);
    console.error('Error code:', error.code);
    
    // Provide helpful error message
    if (error.code === 'storage/unauthorized') {
      console.error('Storage permission denied. Please check Firebase Storage rules allow authenticated users to upload.');
    } else if (error.code === 'storage/retry-limit-exceeded') {
      console.error('Storage upload failed: Network issue or permission denied. Check Storage rules.');
    }
    
    // Return empty string if upload fails - task can still be created without image
    return '';
  }
};

/**
 * Create a new task (Admin only)
 */
export const createTask = async (taskData: {
  title: string;
  brand: string;
  description?: string;
  image?: string;
  reward: number;
  deadline?: string | Date;
  category: string;
  tag?: string;
  status?: 'active' | 'completed' | 'expired';
}): Promise<string> => {
  try {
    console.log('createTask called with:', taskData);
    
    const deadlineDate = taskData.deadline 
      ? (typeof taskData.deadline === 'string' ? new Date(taskData.deadline) : taskData.deadline)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default: 7 days from now

    // Upload image to Storage if it's a base64 string
    let imageUrl = taskData.image || '';
    if (imageUrl && imageUrl.startsWith('data:image/')) {
      console.log('Uploading image to Firebase Storage...');
      imageUrl = await uploadTaskImage(imageUrl);
      console.log('Image uploaded, URL:', imageUrl);
    }

    const taskDoc = {
      title: taskData.title,
      brand: taskData.brand,
      description: taskData.description || '',
      image: imageUrl, // Store URL instead of base64
      reward: taskData.reward,
      deadline: Timestamp.fromDate(deadlineDate),
      category: taskData.category as Task['category'],
      tag: taskData.tag || null,
      status: taskData.status || 'active',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    console.log('Adding document to Firestore...');
    console.log('Task document:', taskDoc);
    
    // Add timeout but longer (30 seconds) to allow for image upload
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout: Task creation took too long. Please check your internet connection and Firestore rules.')), 30000);
    });
    
    const addDocPromise = addDoc(collection(db, 'tasks'), taskDoc);
    const docRef = await Promise.race([addDocPromise, timeoutPromise]);
    
    console.log('Document added with ID:', docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error('Error in createTask:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Full error:', JSON.stringify(error, null, 2));
    
    // Provide more detailed error message
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check your Firestore security rules allow authenticated users to create tasks. Go to Firebase Console → Firestore → Rules and update the tasks collection rule.');
    } else if (error.code === 'unavailable') {
      throw new Error('Firebase is unavailable. Please check your internet connection.');
    } else if (error.code === 'failed-precondition') {
      throw new Error('Database error. Please try again.');
    } else if (error.message?.includes('timeout')) {
      throw error; // Re-throw timeout errors as-is
    } else {
      throw new Error(error.message || `Failed to create task. Error code: ${error.code || 'unknown'}. Please check the browser console for details.`);
    }
  }
};

/**
 * Update a task (Admin only)
 */
export const updateTask = async (
  taskId: string,
  updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    // Convert Date objects to Timestamps
    if (updates.deadline instanceof Date) {
      updateData.deadline = Timestamp.fromDate(updates.deadline);
    }

    await updateDoc(taskRef, updateData);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update task');
  }
};

/**
 * Delete a task (Admin only)
 */
export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete task');
  }
};

