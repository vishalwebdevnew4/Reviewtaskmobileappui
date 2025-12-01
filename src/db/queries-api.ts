// PostgreSQL API-based queries (alternative to localStorage)
import { api } from '../services/api';
import { DB_CONFIG } from '../config/database';

// User queries
export const userQueriesAPI = {
  createOrGetUser: async (phone: string, email?: string, name?: string) => {
    // Check by email first, then phone
    if (email) {
      const existing = await api.getUserByEmail(email);
      if (existing) return existing;
    }
    
    // Create new user
    return await api.createOrUpdateUser({ phone, email, name });
  },

  getUserById: async (userId: number) => {
    return await api.getUserById(userId);
  },

  getUserByEmail: async (email: string) => {
    return await api.getUserByEmail(email);
  },

  updateUser: async (userId: number, updates: any) => {
    // Ensure all password reset fields are included
    const updateData = {
      id: userId,
      ...updates,
      password_reset_token: updates.password_reset_token ?? null,
      password_reset_expires: updates.password_reset_expires ?? null,
      password_reset_otp: updates.password_reset_otp ?? null,
      password_reset_otp_expires: updates.password_reset_otp_expires ?? null,
    };
    return await api.createOrUpdateUser(updateData);
  },
};

// Task queries
export const taskQueriesAPI = {
  getAllTasks: async (category?: string) => {
    return await api.getAllTasks(category);
  },

  getTaskById: async (taskId: number) => {
    return await api.getTaskById(taskId);
  },

  createTask: async (task: any) => {
    return await api.createTask(task);
  },

  updateTask: async (taskId: number, updates: any) => {
    return await api.updateTask(taskId, updates);
  },

  deleteTask: async (taskId: number) => {
    await api.deleteTask(taskId);
  },

  updateTaskStatus: async (taskId: number, status: 'active' | 'paused' | 'completed') => {
    return await api.updateTask(taskId, { status });
  },
};

// Survey queries
export const surveyQueriesAPI = {
  createSurvey: async (survey: any) => {
    return await api.createSurvey({
      task_id: survey.taskId,
      user_id: survey.userId,
      rating: survey.rating,
      survey_text: survey.surveyText,
      images: survey.images,
      custom_responses: survey.customResponses,
    });
  },

  getSurveysByTask: async (taskId: number) => {
    return await api.getSurveysByTask(taskId);
  },

  getUserSurveys: async (userId: number) => {
    return await api.getUserSurveys(userId);
  },

  updateSurveyStatus: async (surveyId: number, status: 'pending' | 'approved' | 'rejected', feedbackText?: string, surveyorRating?: number) => {
    return await api.updateSurveyStatus(surveyId, {
      status,
      company_feedback: feedbackText,
      company_rating: surveyorRating,
    });
  },
};

// Wallet queries
export const walletQueriesAPI = {
  getBalance: async (userId: number) => {
    const result = await api.getWalletBalance(userId);
    return result.balance || 0;
  },

  getTransactions: async (userId: number) => {
    return await api.getWalletTransactions(userId);
  },

  addTransaction: async (transaction: any) => {
    return await api.addWalletTransaction(transaction);
  },
};

// KYC queries
export const kycQueriesAPI = {
  getKYCInfo: async (userId: number) => {
    return await api.getKYCInfo(userId);
  },

  saveKYCInfo: async (userId: number, kycData: any) => {
    return await api.saveKYCInfo({ user_id: userId, ...kycData });
  },
};

// User tasks queries
export const userTaskQueriesAPI = {
  getUserTasks: async (userId: number) => {
    return await api.getUserTasks(userId);
  },

  assignTask: async (userId: number, taskId: number) => {
    return await api.assignTask({ user_id: userId, task_id: taskId, status: 'assigned' });
  },

  updateTaskStatus: async (userId: number, taskId: number, status: string) => {
    return await api.updateUserTaskStatus(userId, taskId, { 
      status,
      completed_at: status === 'submitted' ? new Date().toISOString() : null,
    });
  },
};

