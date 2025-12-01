// Unified queries wrapper - automatically uses PostgreSQL API or localStorage based on config
import { DB_CONFIG } from '../config/database';
import * as localQueries from './queries';
import * as apiQueries from './queries-api';

// Helper to check if we should use API
const useAPI = () => DB_CONFIG.usePostgreSQL;

// Convert async API functions to sync-compatible wrappers for localStorage compatibility
function makeAsync<T extends (...args: any[]) => any>(fn: T): T {
  return ((...args: any[]) => {
    const result = fn(...args);
    if (result instanceof Promise) {
      return result;
    }
    return Promise.resolve(result);
  }) as T;
}

// User queries wrapper
export const userQueries = {
  createOrGetUser: async (phone: string, email?: string, name?: string) => {
    if (useAPI()) {
      return await apiQueries.userQueriesAPI.createOrGetUser(phone, email, name);
    }
    return localQueries.userQueries.createOrGetUser(phone, email, name);
  },

  getUserById: async (userId: number) => {
    if (useAPI()) {
      return await apiQueries.userQueriesAPI.getUserById(userId);
    }
    return localQueries.userQueries.getUserById(userId);
  },

  getUserByEmail: async (email: string) => {
    if (useAPI()) {
      return await apiQueries.userQueriesAPI.getUserByEmail(email);
    }
    return localQueries.userQueries.getUserByEmail(email);
  },

  updateUser: async (userId: number, updates: any) => {
    if (useAPI()) {
      return await apiQueries.userQueriesAPI.updateUser(userId, updates);
    }
    localQueries.userQueries.updateUser(userId, updates);
    return null;
  },
};

// Task queries wrapper
export const taskQueries = {
  getAllTasks: async (category?: string) => {
    if (useAPI()) {
      return await apiQueries.taskQueriesAPI.getAllTasks(category);
    }
    return localQueries.taskQueries.getAllTasks(category);
  },

  getTaskById: async (taskId: number) => {
    if (useAPI()) {
      return await apiQueries.taskQueriesAPI.getTaskById(taskId);
    }
    return localQueries.taskQueries.getTaskById(taskId);
  },

  createTask: async (task: any) => {
    if (useAPI()) {
      return await apiQueries.taskQueriesAPI.createTask(task);
    }
    return localQueries.taskQueries.createTask(task);
  },

  updateTask: async (taskId: number, updates: any) => {
    if (useAPI()) {
      return await apiQueries.taskQueriesAPI.updateTask(taskId, updates);
    }
    return localQueries.taskQueries.updateTask(taskId, updates);
  },

  deleteTask: async (taskId: number) => {
    if (useAPI()) {
      await apiQueries.taskQueriesAPI.deleteTask(taskId);
      return;
    }
    localQueries.taskQueries.deleteTask(taskId);
  },

  updateTaskStatus: async (taskId: number, status: 'active' | 'paused' | 'completed') => {
    if (useAPI()) {
      return await apiQueries.taskQueriesAPI.updateTaskStatus(taskId, status);
    }
    localQueries.taskQueries.updateTaskStatus(taskId, status);
    return null;
  },
};

// Survey queries wrapper
export const surveyQueries = {
  createSurvey: async (survey: any) => {
    if (useAPI()) {
      return await apiQueries.surveyQueriesAPI.createSurvey(survey);
    }
    return localQueries.surveyQueries.createSurvey(survey);
  },

  getSurveysByTask: async (taskId: number) => {
    if (useAPI()) {
      return await apiQueries.surveyQueriesAPI.getSurveysByTask(taskId);
    }
    return localQueries.surveyQueries.getSurveysByTask(taskId);
  },

  getUserSurveys: async (userId: number) => {
    if (useAPI()) {
      return await apiQueries.surveyQueriesAPI.getUserSurveys(userId);
    }
    return localQueries.surveyQueries.getUserSurveys(userId);
  },

  updateSurveyStatus: async (surveyId: number, status: 'pending' | 'approved' | 'rejected', feedbackText?: string, surveyorRating?: number) => {
    if (useAPI()) {
      return await apiQueries.surveyQueriesAPI.updateSurveyStatus(surveyId, status, feedbackText, surveyorRating);
    }
    return localQueries.surveyQueries.updateSurveyStatus(surveyId, status, feedbackText, surveyorRating);
  },
};

// Wallet queries wrapper
export const walletQueries = {
  getBalance: async (userId: number) => {
    if (useAPI()) {
      return await apiQueries.walletQueriesAPI.getBalance(userId);
    }
    return localQueries.walletQueries.getBalance(userId);
  },

  getTransactions: async (userId: number) => {
    if (useAPI()) {
      return await apiQueries.walletQueriesAPI.getTransactions(userId);
    }
    return localQueries.walletQueries.getTransactions(userId);
  },

  addTransaction: async (transaction: any) => {
    if (useAPI()) {
      return await apiQueries.walletQueriesAPI.addTransaction(transaction);
    }
    return localQueries.walletQueries.addTransaction(transaction);
  },
};

// KYC queries wrapper
export const kycQueries = {
  getKYCInfo: async (userId: number) => {
    if (useAPI()) {
      return await apiQueries.kycQueriesAPI.getKYCInfo(userId);
    }
    return localQueries.kycQueries.getKYCInfo(userId);
  },

  saveKYCInfo: async (userId: number, kycData: any) => {
    if (useAPI()) {
      return await apiQueries.kycQueriesAPI.saveKYCInfo(userId, kycData);
    }
    return localQueries.kycQueries.saveKYCInfo(userId, kycData);
  },
};

// User tasks queries wrapper
export const userTaskQueries = {
  getUserTasks: async (userId: number) => {
    if (useAPI()) {
      return await apiQueries.userTaskQueriesAPI.getUserTasks(userId);
    }
    return localQueries.userTaskQueries.getUserTasks(userId);
  },

  assignTask: async (userId: number, taskId: number) => {
    if (useAPI()) {
      return await apiQueries.userTaskQueriesAPI.assignTask(userId, taskId);
    }
    return localQueries.userTaskQueries.assignTask(userId, taskId);
  },

  updateTaskStatus: async (userId: number, taskId: number, status: string) => {
    if (useAPI()) {
      return await apiQueries.userTaskQueriesAPI.updateTaskStatus(userId, taskId, status);
    }
    localQueries.userTaskQueries.updateTaskStatus(userId, taskId, status);
    return null;
  },
};

