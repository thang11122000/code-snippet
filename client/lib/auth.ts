import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import axios from "axios";

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

/**
 * Sync user data with backend server
 * Call this after successful authentication
 */
export async function syncUserWithServer(user: {
  id: string;
  name: string;
  email: string;
  image?: string;
  provider?: string;
}) {
  if (!user || !user.id) {
    throw new Error("Invalid user data");
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/auth`,
      {
        userId: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        provider: user.provider || "credentials",
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Error syncing user with server:", error);
    throw error;
  }
}

/**
 * Get user data from server by ID
 */
export async function getUserFromServer(userId: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${userId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user from server:", error);
    return null;
  }
}

/**
 * Update user profile on server
 */
export async function updateUserProfile(
  userId: string,
  data: { name?: string; image?: string }
) {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${userId}`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}
