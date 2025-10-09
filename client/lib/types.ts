import { ComplexityLevel } from "./complexity";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  createdAt: string;
}

export interface Snippet {
  _id: string;
  title: string;
  description: string;
  code: string;
  languageCode: string;
  tags: string[];
  complexity: ComplexityLevel;
  authorId: string;
  authorName: string;
  authorImage?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  likes: number;
  views: number;
}

export interface Tag {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: PaginationMeta;
  message?: string;
}

export const LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "SQL",
  "HTML",
  "CSS",
  "Other",
] as const;

export type Language = (typeof LANGUAGES)[number];
