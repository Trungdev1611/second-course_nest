import apiClient from './axios';

// API response types
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  meta?: {
    page?: number;
    per_page?: number;
    total?: number;
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
    apiClient.get<ApiResponse>('/auth/change-password', { data }),
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
    apiClient.get<ApiResponse>(`/blog/post/${postId}/comments`, { params }),
  
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
    apiClient.get<ApiResponse>('/tag/getlist', { params }),
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

