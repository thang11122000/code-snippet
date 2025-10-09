"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

/**
 * Client-side helper that can be used for future session-aware side effects.
 * User synchronization with the backend now happens on the server during sign-in.
 */
export default function AuthSyncProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      // Placeholder for client-side side effects that require an authenticated session.
    }
  }, [status]);

  return <>{children}</>;
}
