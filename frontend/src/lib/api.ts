/** @fileoverview API client for frontend-backend communication */
/** @description Centralized API functions for all backend endpoints */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * Generic API request function
 * @description Handles common API request patterns with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'API request failed')
  }
  
  return response.json()
}

/**
 * Company API functions
 * @description Handles company creation and retrieval
 */
export const companyApi = {
  /**
   * Create or update company
   * @description Sends company data to backend
   */
  async createOrUpdate(data: {
    name: string
    sector: string
    targetRaise: number
    revenue: number
  }) {
    console.log('Sending company data:', data)
    return apiRequest('/api/company', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  
  /**
   * Get company data
   * @description Retrieves company information from backend
   */
  async get() {
    return apiRequest('/api/company')
  }
}

/**
 * KYC API functions
 * @description Handles KYC verification
 */
export const kycApi = {
  /**
   * Verify KYC
   * @description Initiates KYC verification process
   */
  async verify() {
    return apiRequest('/api/kyc/verify', {
      method: 'POST',
      body: JSON.stringify({})
    })
  },
  
  /**
   * Get KYC status
   * @description Retrieves current KYC verification status
   */
  async getStatus() {
    return apiRequest('/api/kyc/status')
  }
}

/**
 * Financials API functions
 * @description Handles financials linking
 */
export const financialsApi = {
  /**
   * Link financials
   * @description Links financial accounts with token
   */
  async link(token: string) {
    return apiRequest('/api/financials/link', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
  },
  
  /**
   * Get financials status
   * @description Retrieves current financials linking status
   */
  async getStatus() {
    return apiRequest('/api/financials/status')
  }
}

/**
 * Files API functions
 * @description Handles file uploads and management
 */
export const filesApi = {
  /**
   * Upload file
   * @description Uploads a file to the backend
   */
  async upload(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`${API_BASE_URL}/api/files`, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'File upload failed')
    }
    
    return response.json()
  },
  
  /**
   * Get files list
   * @description Retrieves list of uploaded files
   */
  async getList() {
    return apiRequest('/api/files')
  },
  
  /**
   * Delete file
   * @description Deletes a file by ID
   */
  async delete(id: number) {
    return apiRequest(`/api/files/${id}`, {
      method: 'DELETE',
    })
  }
}

/**
 * Score API functions
 * @description Handles investability score calculation
 */
export const scoreApi = {
  /**
   * Get investability score
   * @description Retrieves current investability score
   */
  async get() {
    return apiRequest('/api/score')
  },
  
  /**
   * Get score breakdown
   * @description Retrieves detailed score breakdown
   */
  async getBreakdown() {
    return apiRequest('/api/score/breakdown')
  }
}

/**
 * Notifications API functions
 * @description Handles notification management
 */
export const notificationsApi = {
  /**
   * Get notifications
   * @description Retrieves user notifications
   */
  async get() {
    return apiRequest('/api/notifications')
  },
  
  /**
   * Mark notification as read
   * @description Marks a specific notification as read
   */
  async markAsRead(id: number) {
    return apiRequest(`/api/notifications/${id}/read`, {
      method: 'PATCH',
    })
  },
  
  /**
   * Mark all notifications as read
   * @description Marks all notifications as read
   */
  async markAllAsRead() {
    return apiRequest('/api/notifications/read-all', {
      method: 'PATCH',
    })
  },
  
  /**
   * Get unread count
   * @description Retrieves count of unread notifications
   */
  async getUnreadCount() {
    return apiRequest('/api/notifications/unread-count')
  }
}

/**
 * Messages API functions
 * @description Handles chat messages
 */
export const messagesApi = {
  /**
   * Get messages
   * @description Retrieves chat messages
   */
  async get() {
    return apiRequest('/api/messages')
  },
  
  /**
   * Send message
   * @description Sends a new chat message
   */
  async send(sender: string, text: string) {
    return apiRequest('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ sender, text }),
    })
  }
}

/**
 * Auth API functions
 * @description Handles login/logout and current user
 */
export const authApi = {
  async login(email: string) {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
  },
  async me() {
    return apiRequest('/api/auth/me')
  },
  async logout() {
    return apiRequest('/api/auth/logout', { method: 'POST' })
  }
}

