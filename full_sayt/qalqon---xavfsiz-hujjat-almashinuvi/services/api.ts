const API_BASE_URL = 'http://localhost:3001/api/v1';

// Auth token management
class AuthManager {
  private static TOKEN_KEY = 'safedoc_token';
  private static USER_KEY = 'safedoc_user';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static getUser(): any | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  static setUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// API Client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = AuthManager.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          AuthManager.removeToken();
          window.location.href = '/login';
          throw new Error('Unauthorized');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return response as any;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // File upload
  async uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = AuthManager.getToken();
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Upload failed');
    }

    return await response.json();
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post<{ access_token: string; user: any }>('/auth/login', credentials),
  
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
    companyId?: string;
  }) => apiClient.post<any>('/auth/register', userData),
  
  getProfile: () => apiClient.get<any>('/auth/profile'),
  
  logout: () => apiClient.post<{ message: string }>('/auth/logout'),
};

// Companies API
export const companiesAPI = {
  getAll: (params?: { page?: number; limit?: number; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.status) query.append('status', params.status);
    
    return apiClient.get<{
      companies: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/companies?${query.toString()}`);
  },
  
  getById: (id: string) => apiClient.get<any>(`/companies/${id}`),
  
  create: (companyData: {
    name: string;
    industry: string;
    adminEmail: string;
    plan?: string;
    settings?: any;
  }) => apiClient.post<any>('/companies', companyData),
  
  update: (id: string, data: any) => apiClient.patch<any>(`/companies/${id}`, data),
  
  delete: (id: string) => apiClient.delete<{ message: string }>(`/companies/${id}`),
  
  updateStatus: (id: string, status: string) =>
    apiClient.patch<any>(`/companies/${id}/status`, { status }),
  
  getStats: () => apiClient.get<{
    companies: { total: number; active: number; trial: number; suspended: number };
    users: number;
    documents: number;
    storage: number;
  }>('/companies/stats'),
};

// Users API
export const usersAPI = {
  getAll: (params?: { companyId?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.companyId) query.append('companyId', params.companyId);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    
    return apiClient.get<{
      users: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/users?${query.toString()}`);
  },
  
  getById: (id: string) => apiClient.get<any>(`/users/${id}`),
  
  create: (userData: any) => apiClient.post<any>('/users', userData),
  
  update: (id: string, data: any) => apiClient.patch<any>(`/users/${id}`, data),
  
  delete: (id: string) => apiClient.delete<{ message: string }>(`/users/${id}`),
  
  updateStatus: (id: string, status: string) =>
    apiClient.patch<any>(`/users/${id}/status`, { status }),
  
  updateRiskScore: (id: string, riskScore: number) =>
    apiClient.patch<any>(`/users/${id}/risk-score`, { riskScore }),
};

// Documents API
export const documentsAPI = {
  getAll: (params?: {
    companyId?: string;
    securityLevel?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.companyId) query.append('companyId', params.companyId);
    if (params?.securityLevel) query.append('securityLevel', params.securityLevel);
    if (params?.status) query.append('status', params.status);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    
    return apiClient.get<{
      documents: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/documents?${query.toString()}`);
  },
  
  getById: (id: string) => apiClient.get<any>(`/documents/${id}`),
  
  upload: (formData: FormData) => apiClient.uploadFile<any>('/documents/upload', formData),
  
  download: (id: string) => {
    const token = AuthManager.getToken();
    const url = `${API_BASE_URL}/documents/${id}/download`;
    
    return fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  },
  
  update: (id: string, data: any) => apiClient.patch<any>(`/documents/${id}`, data),
  
  delete: (id: string) => apiClient.delete<{ message: string }>(`/documents/${id}`),
};

// Audit API
export const auditAPI = {
  getLogs: (params?: {
    companyId?: string;
    action?: string;
    riskLevel?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value) query.append(key, value.toString());
    });
    
    return apiClient.get<{
      logs: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/audit/logs?${query.toString()}`);
  },
  
  getStats: (params?: { companyId?: string; days?: number }) => {
    const query = new URLSearchParams();
    if (params?.companyId) query.append('companyId', params.companyId);
    if (params?.days) query.append('days', params.days.toString());
    
    return apiClient.get<any>(`/audit/stats?${query.toString()}`);
  },
  
  getRecentActivity: (params?: { companyId?: string; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.companyId) query.append('companyId', params.companyId);
    if (params?.limit) query.append('limit', params.limit.toString());
    
    return apiClient.get<any[]>(`/audit/recent?${query.toString()}`);
  },
  
  getSecurityAlerts: (params?: { companyId?: string; days?: number }) => {
    const query = new URLSearchParams();
    if (params?.companyId) query.append('companyId', params.companyId);
    if (params?.days) query.append('days', params.days.toString());
    
    return apiClient.get<any[]>(`/audit/alerts?${query.toString()}`);
  },
  
  exportLogs: (params?: {
    companyId?: string;
    startDate?: string;
    endDate?: string;
    format?: string;
  }) => {
    const query = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value) query.append(key, value);
    });
    
    return apiClient.get<any>(`/audit/export?${query.toString()}`);
  },
};

// Monitoring API
export const monitoringAPI = {
  getLiveActivity: (limit?: number) => {
    const query = limit ? `?limit=${limit}` : '';
    return apiClient.get<any[]>(`/monitoring/live-activity${query}`);
  },
  
  getStats: () => apiClient.get<{
    users: { total: number; activeToday: number };
    companies: { total: number; active: number };
    documents: { total: number; uploadedToday: number };
    storage: { total: number; formatted: string };
    activity: {
      actionsToday: number;
      actionsThisWeek: number;
      highRiskActions: number;
      anomalies: number;
    };
  }>('/monitoring/stats'),
  
  getActivityChart: (params?: { days?: number; companyId?: string }) => {
    const query = new URLSearchParams();
    if (params?.days) query.append('days', params.days.toString());
    if (params?.companyId) query.append('companyId', params.companyId);
    
    return apiClient.get<Array<{ time: string; actions: number }>>(`/monitoring/activity-chart?${query.toString()}`);
  },
  
  getTopUsers: (params?: { companyId?: string; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.companyId) query.append('companyId', params.companyId);
    if (params?.limit) query.append('limit', params.limit.toString());
    
    return apiClient.get<any[]>(`/monitoring/top-users?${query.toString()}`);
  },
  
  getPerformance: () => apiClient.get<{
    requestsPerMinute: number;
    averageResponseTime: number;
    errorRate: number;
    activeConnections: number;
    uptime: number;
    memoryUsage: any;
  }>('/monitoring/performance'),
};

// Security API
export const securityAPI = {
  getSettings: () => apiClient.get<any>('/security/settings'),
  
  updateSettings: (settings: any) => apiClient.post<any>('/security/settings', settings),
  
  getScore: () => apiClient.get<{
    score: number;
    maxScore: number;
    level: string;
    recommendations: string[];
  }>('/security/score'),
  
  validatePassword: (password: string) =>
    apiClient.post<{
      isValid: boolean;
      errors: string[];
      strength: number;
    }>('/security/validate-password', { password }),
  
  getReport: () => apiClient.get<any>('/security/report'),
};

// Phishing API
export const phishingAPI = {
  getCampaigns: (params?: {
    companyId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value) query.append(key, value.toString());
    });
    
    return apiClient.get<{
      campaigns: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/phishing/campaigns?${query.toString()}`);
  },
  
  getCampaignById: (id: string) => apiClient.get<any>(`/phishing/campaigns/${id}`),
  
  createCampaign: (campaignData: any) => apiClient.post<any>('/phishing/campaigns', campaignData),
  
  updateCampaign: (id: string, data: any) => apiClient.patch<any>(`/phishing/campaigns/${id}`, data),
  
  deleteCampaign: (id: string) => apiClient.delete<{ message: string }>(`/phishing/campaigns/${id}`),
  
  startCampaign: (id: string) => apiClient.post<{ message: string; sentCount: number }>(`/phishing/campaigns/${id}/start`),
  
  getSimulations: (campaignId: string, status?: string) => {
    const query = status ? `?status=${status}` : '';
    return apiClient.get<any[]>(`/phishing/campaigns/${campaignId}/simulations${query}`);
  },
  
  recordAction: (simulationId: string, action: string, metadata?: any) =>
    apiClient.post<{ message: string }>(`/phishing/simulations/${simulationId}/action`, {
      action,
      metadata,
    }),
  
  getCampaignStats: (id: string) => apiClient.get<{
    total: number;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    dataEntered: number;
    reported: number;
    clickRate: string;
    reportRate: string;
  }>(`/phishing/campaigns/${id}/stats`),
  
  getCompanyStats: (companyId: string, days?: number) => {
    const query = days ? `?days=${days}` : '';
    return apiClient.get<{
      totalCampaigns: number;
      totalSent: number;
      totalClicked: number;
      totalReported: number;
      clickRate: string;
      reportRate: string;
    }>(`/phishing/companies/${companyId}/stats${query}`);
  },
};

// Export AuthManager for use in components
export { AuthManager };

// Export default API client
export default apiClient;