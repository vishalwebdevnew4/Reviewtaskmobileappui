// API Service for PostgreSQL backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/db';

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
}

export const api = {
  // User queries
  getUserById: (id: number) => apiRequest(`/users/${id}`),
  getUserByEmail: (email: string) => apiRequest(`/users/email/${encodeURIComponent(email)}`),
  createOrUpdateUser: (userData: any) => apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  // Task queries
  getAllTasks: (category?: string) => {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return apiRequest(`/tasks${query}`);
  },
  getTaskById: (id: number) => apiRequest(`/tasks/${id}`),
  createTask: (taskData: any) => apiRequest('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  }),
  updateTask: (id: number, updates: any) => apiRequest(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }),
  deleteTask: (id: number) => apiRequest(`/tasks/${id}`, { method: 'DELETE' }),

  // Survey queries
  getSurveysByTask: (taskId: number) => apiRequest(`/surveys/task/${taskId}`),
  getUserSurveys: (userId: number) => apiRequest(`/surveys/user/${userId}`),
  createSurvey: (surveyData: any) => apiRequest('/surveys', {
    method: 'POST',
    body: JSON.stringify(surveyData),
  }),
  updateSurveyStatus: (id: number, statusData: any) => apiRequest(`/surveys/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(statusData),
  }),

  // Wallet queries
  getWalletBalance: (userId: number) => apiRequest(`/wallet/balance/${userId}`),
  getWalletTransactions: (userId: number) => apiRequest(`/wallet/transactions/${userId}`),
  addWalletTransaction: (transactionData: any) => apiRequest('/wallet/transactions', {
    method: 'POST',
    body: JSON.stringify(transactionData),
  }),

  // KYC queries
  getKYCInfo: (userId: number) => apiRequest(`/kyc/${userId}`),
  saveKYCInfo: (kycData: any) => apiRequest('/kyc', {
    method: 'POST',
    body: JSON.stringify(kycData),
  }),

  // User tasks queries
  getUserTasks: (userId: number) => apiRequest(`/user-tasks/${userId}`),
  assignTask: (userTaskData: any) => apiRequest('/user-tasks', {
    method: 'POST',
    body: JSON.stringify(userTaskData),
  }),
  updateUserTaskStatus: (userId: number, taskId: number, statusData: any) => 
    apiRequest(`/user-tasks/${userId}/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    }),
};

