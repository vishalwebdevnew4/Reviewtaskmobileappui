// Task Service
// Handles task-related operations
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

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
    throw new Error(error.message || 'Failed to fetch tasks');
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
      q = query(
        tasksRef,
        where('status', '==', 'active'),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
    }
    
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
    throw new Error(error.message || 'Failed to fetch tasks by category');
  }
};

/**
 * Get featured tasks (tasks with tags)
 */
export const getFeaturedTasks = async (): Promise<Task[]> => {
  try {
    const tasksRef = collection(db, 'tasks');
    const q = query(
      tasksRef,
      where('status', '==', 'active'),
      where('tag', '!=', null),
      orderBy('tag'),
      orderBy('createdAt', 'desc'),
      limit(6)
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
    // If query fails (no index), fallback to getting all tasks
    return getActiveTasks();
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

