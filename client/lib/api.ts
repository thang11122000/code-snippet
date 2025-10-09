import axios from "axios";
import { Snippet, Tag, ApiResponse } from "./types";
import { ComplexityLevel } from "./complexity";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Snippet API
export const snippetApi = {
  // Get all snippets with filters
  getAll: async (params?: {
    page?: number;
    limit?: number;
    languageCode?: string;
    tag?: string;
    search?: string;
    sort?: "latest" | "popular" | "views";
  }) => {
    const response = await api.get<ApiResponse<Snippet[]>>("/snippets", {
      params,
    });
    return response.data;
  },

  // Get snippet by ID
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Snippet>>(`/snippets/${id}`);
    return response.data;
  },

  // Get snippets by user
  getByUser: async (
    userId: string,
    params?: { page?: number; limit?: number }
  ) => {
    const response = await api.get<ApiResponse<Snippet[]>>(
      `/snippets/user/${userId}`,
      { params }
    );
    return response.data;
  },

  // Get liked snippets by user
  getLikedByUser: async (
    userId: string,
    params?: { page?: number; limit?: number }
  ) => {
    const response = await api.get<ApiResponse<Snippet[]>>(
      `/snippets/liked/${userId}`,
      { params }
    );
    return response.data;
  },

  // Create snippet
  create: async (data: {
    title: string;
    description: string;
    code: string;
    languageCode: string;
    tags?: string[];
    authorId: string;
    authorName: string;
    authorImage?: string;
    complexity?: ComplexityLevel;
    isPublic?: boolean;
  }) => {
    const response = await api.post<ApiResponse<Snippet>>("/snippets", data);
    return response.data;
  },

  // Update snippet
  update: async (
    id: string,
    data: Partial<{
      title: string;
      description: string;
      code: string;
      language: string;
      tags: string[];
      complexity: ComplexityLevel;
      isPublic: boolean;
    }>
  ) => {
    const response = await api.put<ApiResponse<Snippet>>(
      `/snippets/${id}`,
      data
    );
    return response.data;
  },

  // Delete snippet
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<{ message: string }>>(
      `/snippets/${id}`
    );
    return response.data;
  },

  // Toggle like
  toggleLike: async (id: string, userId: string) => {
    const response = await api.post<
      ApiResponse<{ liked: boolean; likes: number }>
    >(`/snippets/${id}/like`, { userId });
    return response.data;
  },

  // Get search suggestions
  getSearchSuggestions: async (query: string) => {
    const response = await api.get<
      ApiResponse<{
        tags: Array<{ name: string; count: number }>;
        authors: Array<{ name: string; count: number }>;
      }>
    >("/snippets/search-suggestions", { params: { q: query } });
    return response.data;
  },
};

// Tag API
export const tagApi = {
  // Get all tags
  getAll: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get<ApiResponse<Tag[]>>("/tags", { params });
    return response.data;
  },

  // Get popular tags
  getPopular: async (limit?: number) => {
    const response = await api.get<ApiResponse<Tag[]>>("/tags/popular", {
      params: { limit },
    });
    return response.data;
  },

  // Search tags
  search: async (query: string) => {
    const response = await api.get<ApiResponse<Tag[]>>("/tags/search", {
      params: { q: query },
    });
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await api.get("/health");
  return response.data;
};

export default api;
