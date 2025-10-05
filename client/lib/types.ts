import { ComplexityLevel } from "./complexity";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  complexity: ComplexityLevel;
  author: User;
  createdAt: string;
  updatedAt: string;
  likes: number;
  views: number;
}

export interface Tag {
  name: string;
  count: number;
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
