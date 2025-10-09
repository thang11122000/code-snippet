"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="max-w-md w-full space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>
              {error.message ||
                "An unexpected error occurred. Please try again."}
            </p>

            {error.digest && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
                <span className="font-semibold">Error Code:</span>{" "}
                <code className="font-mono">{error.digest}</code>
              </div>
            )}
          </AlertDescription>
        </Alert>

        {error.stack && (
          <div className="rounded-md border bg-muted/40 p-4 text-left">
            <p className="mb-2 text-sm font-semibold">Stack trace</p>
            <pre className="max-h-[240px] overflow-auto whitespace-pre-wrap break-words text-xs leading-relaxed">
              {error.stack}
            </pre>
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={reset} className="flex-1">
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="flex-1"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
