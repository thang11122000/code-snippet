"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { syncUserWithServer } from "@/lib/auth";
import { toast } from "sonner";

/**
 * Provider component that syncs NextAuth session with backend server
 * This should be included in the app layout to ensure user data is synced
 * whenever the user logs in or refreshes the page
 */
export default function AuthSyncProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    // Only sync when session is authenticated and not already synced
    if (status === "authenticated" && session?.user && !synced) {
      const syncUser = async () => {
        try {
          if (!session.user.id || !session.user.email || !session.user.name) {
            console.error("Missing required user data for sync");
            return;
          }

          await syncUserWithServer({
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image || "",
            provider: session.user.provider || "credentials",
          });

          setSynced(true);
        } catch (error) {
          console.error("Failed to sync user with server:", error);
          toast.error("Failed to sync user data with server");
        }
      };

      syncUser();
    }

    // Reset synced state when session changes or user logs out
    if (status !== "authenticated") {
      setSynced(false);
    }
  }, [session, status, synced]);

  return <>{children}</>;
}
