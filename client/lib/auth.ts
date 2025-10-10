import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { authApiClient as apiClient } from "./http";

/**
 * Get the current session on the server side
 * Use this in Server Components and API routes
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

/**
 * Check if user is authenticated
 * Use this in Server Components
 */
export async function isAuthenticated() {
  const session = await getServerSession(authOptions);
  return !!session;
}

/**
 * Require authentication for a page
 * Throws error if not authenticated (will be caught by error boundary)
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized - Please sign in");
  }

  return session;
}

export async function getUserFromServer(userId: string) {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user from server:", error);
    return null;
  }
}

export async function updateUserProfile(
  userId: string,
  data: { name?: string; image?: string }
) {
  try {
    const response = await apiClient.put(`/users/${userId}`, data);
    return response.data.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}
