import apiClient from './axios';

// API response types
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  meta?: {
    page?: number;
    per_page?: number;
    total?: number;
    conversationId?: number;
    conversationKey?: string;
    pageSize?: number;
  };
  message?: string;
}

// Auth API
export const authApi = {
  login: (data: { email: string; password: string }) =>
    apiClient.post<ApiResponse>('/auth/login', data),
  
  register: (data: { name: string; email: string; password: string }) =>
    apiClient.post<ApiResponse>('/auth/register', data),
  
  getMe: () =>
    apiClient.get<ApiResponse>('/auth/me'),
  
  forgotPassword: (data: { email: string }) =>
    apiClient.post<ApiResponse>('/auth/password-recovery', data),
  
  resetPassword: (data: { email: string; password: string }, token: string) =>
    apiClient.post<ApiResponse>('/auth/reset-password', data, { params: { token } }),
  
  verifyEmail: (token: string) =>
    apiClient.get<ApiResponse>('/auth/verify-token-in-email', { params: { token } }),
  
  changePassword: (data: { email: string; password: string; new_password: string }) =>
    apiClient.post<ApiResponse>('/auth/change-password', data),
};

// Blog API
export const blogApi = {
  getPosts: (params?: { page?: number; per_page?: number; search?: string; type?: string }) =>
    apiClient.get<ApiResponse>('/blog/posts', { params }),
  
  getPostById: (id: number) =>
    apiClient.get<ApiResponse>(`/blog/post/${id}`),
  
  createPost: (data: any) =>
    apiClient.post<ApiResponse>('/blog/create', data),
  
  likePost: (id: number, type: 'post' | 'comment' = 'post') =>
    apiClient.post<ApiResponse>(`/blog/post/${id}/like_unlike`, {}, { params: { type } }),
  
  getComments: (postId: number, params?: { page?: number; per_page?: number; sort?: string }) =>
    apiClient.post<ApiResponse>(`/blog/post/${postId}/comments`, {}, { params }),
  
  getCommentReplies: (postId: number, commentId: number) =>
    apiClient.get<ApiResponse>(`/blog/${postId}/comment/${commentId}`),
  
  getRelatedPosts: (id: number) =>
    apiClient.get<ApiResponse>(`/blog/${id}/related`),
  
  incrementView: (id: number) =>
    apiClient.get<ApiResponse>(`/blog/post/${id}/view`),
};

// User API
export const userApi = {
  getUser: (id: number) =>
    apiClient.get<ApiResponse>(`/user/${id}`),
  
  getUserPosts: (id: number, params?: { page?: number; per_page?: number }) =>
    apiClient.get<ApiResponse>(`/user/${id}/posts`, { params }),
  
  followUser: (id: number) =>
    apiClient.post<ApiResponse>(`/user/${id}/follow`),
  
  unfollowUser: (id: number) =>
    apiClient.post<ApiResponse>(`/user/${id}/unfollow`),
  
  getFollowers: (id: number, params?: { page?: number; per_page?: number }) =>
    apiClient.get<ApiResponse>(`/user/${id}/followers`, { params }),
  
  getFollowings: (id: number, params?: { page?: number; per_page?: number }) =>
    apiClient.get<ApiResponse>(`/user/${id}/followings`, { params }),
  
  getStats: (id: number) =>
    apiClient.get<ApiResponse>(`/user/${id}/stats`),
  
  updateAvatar: (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.put<ApiResponse>(`/user/${id}/update-avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Friendship API
export const friendshipApi = {
  getFriends: (userId: number) =>
    apiClient.get<ApiResponse>(`/friendship/${userId}/listfriend`),
};

// Comment API
export const commentApi = {
  createComment: (postId: number, data: { content: string }) =>
    apiClient.post<ApiResponse>(`/comment/post/${postId}/create`, data),
  
  createReply: (postId: number, commentId: number, data: { content: string }) =>
    apiClient.post<ApiResponse>(`/comment/post/${postId}/parent/${commentId}`, data),
  
  editComment: (id: number, data: { content: string }) =>
    apiClient.put<ApiResponse>(`/comment/edit/${id}`, data),
  
  deleteComment: (id: number) =>
    apiClient.delete<ApiResponse>(`/comment/${id}`),
};

// Tag API
export const tagApi = {
  getTags: (params?: { page?: number; per_page?: number; search?: string }) =>
    apiClient.get<ApiResponse>('/tag/getlist', {
      params,
      headers: {
        'Cache-Control': 'no-cache', // báo server đừng trả 304
      },
    }),
};

// Chat API
export const chatApi = {
  getMessages: (params: { conversationId?: number; conversationKey?: string; page?: number }) => {
    const { conversationId, conversationKey, page } = params;

    const identifier =
      typeof conversationId === 'number' ? conversationId : conversationKey;

    if (!identifier) {
      throw new Error('conversationId hoặc conversationKey là bắt buộc');
    }

    const queryParams: Record<string, any> = {};
    if (typeof conversationId === 'number') {
      queryParams.conversationId = conversationId;
    }
    if (conversationKey) {
      queryParams.conversationKey = conversationKey;
    }
    if (page) {
      queryParams.page = page;
    }

    return apiClient.get<ApiResponse>(
      `/chat/conversation/${identifier}/messages`,
      {
        params: queryParams,
      },
    );
  },
};

// Notification API
export const notificationApi = {
  getNotifications: () => apiClient.get<ApiResponse>('/notifications'),
  
  markAsRead: (id: number) =>
    apiClient.put<ApiResponse>(`/notifications/${id}/read`),
  
  markAllAsRead: () =>
    apiClient.put<ApiResponse>('/notifications/read-all'),

  respondFriendRequest: (notificationId: number, action: 'accept' | 'reject') =>
    apiClient.put<ApiResponse>(`/notifications/${notificationId}/${action}`),
};

// Friend suggestion API
export const friendSuggestionApi = {
  getSuggestFriends: (params?: { page?: number; per_page?: number; search?: string }) =>
    apiClient.get<ApiResponse>('/user/suggest-friends', { params }),
};

// Upload API
export const uploadApi = {
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<ApiResponse>('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Search API (Elasticsearch)
export interface SearchParams {
  q?: string; // Search query (mapped to 'text' for backend)
  text?: string; // Direct text param for backend
  page?: number;
  per_page?: number;
  limit?: number; // Mapped to limit for backend
  status?: 'draft' | 'published' | 'archived' | string;
  tags?: string[]; // Array of tag names
  author?: string;
  date_from?: string; // ISO date string
  date_to?: string; // ISO date string
  sort?: 'relevance' | 'newest' | 'oldest' | 'popular' | 'trending';
}

export interface SearchSuggestionsParams {
  q: string; // Mapped to 'text' for backend
  text?: string; // Direct text param for backend
  limit?: number;
}

export const searchApi = {
  // Full-text search with filters
  // Backend endpoint: /blogs/fulltext
  search: (params: SearchParams) => {
    // Map frontend params to backend params
    const backendParams: any = {
      text: params.text || params.q, // Backend expects 'text'
      page: params.page,
      limit: params.limit || params.per_page,
      status: params.status,
      tags: params.tags,
    };
    // Remove undefined values
    Object.keys(backendParams).forEach(key => 
      backendParams[key] === undefined && delete backendParams[key]
    );
    return apiClient.get<ApiResponse>('/essearch/fulltext-blog', { params: backendParams });
  },

  // Autocomplete suggestions
  // Backend endpoint: /blogs/suggest
  getSuggestions: (params: SearchSuggestionsParams) => {
    const backendParams: any = {
      text: params.text || params.q, // Backend expects 'text'
      limit: params.limit,
    };
    // Remove undefined values
    Object.keys(backendParams).forEach(key => 
      backendParams[key] === undefined && delete backendParams[key]
    );
    return apiClient.get<ApiResponse>('/essearch/suggest-blog', { params: backendParams });
  },

  // Advanced search with all filters
  advancedSearch: (params: SearchParams) =>
    apiClient.get<ApiResponse>('/search/advanced', { params }),

  // Related posts based on current post
  getRelatedPosts: (id: number) =>
    apiClient.get<ApiResponse>(`/search/related/${id}`),
};

