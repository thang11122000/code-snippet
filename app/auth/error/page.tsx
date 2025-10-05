"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: "Server Configuration Error",
    description:
      "There is a problem with the server configuration. Please contact support.",
  },
  AccessDenied: {
    title: "Access Denied",
    description:
      "You do not have permission to sign in. Please contact the administrator.",
  },
  Verification: {
    title: "Verification Failed",
    description:
      "The verification token has expired or has already been used. Please try signing in again.",
  },
  OAuthSignin: {
    title: "OAuth Sign In Error",
    description:
      "Error occurred while trying to sign in with your OAuth provider.",
  },
  OAuthCallback: {
    title: "OAuth Callback Error",
    description: "Error occurred during the OAuth callback. Please try again.",
  },
  OAuthCreateAccount: {
    title: "Account Creation Failed",
    description:
      "Could not create an account with your OAuth provider. Please try again.",
  },
  EmailCreateAccount: {
    title: "Email Account Creation Failed",
    description:
      "Could not create an account with your email. Please try again.",
  },
  Callback: {
    title: "Callback Error",
    description:
      "Error occurred during authentication callback. Please try again.",
  },
  OAuthAccountNotLinked: {
    title: "Account Already Exists",
    description:
      "This email is already associated with another account. Please sign in with your original provider.",
  },
  EmailSignin: {
    title: "Email Sign In Error",
    description: "Could not send sign in email. Please try again.",
  },
  CredentialsSignin: {
    title: "Sign In Failed",
    description: "Invalid credentials. Please check your email and password.",
  },
  SessionRequired: {
    title: "Session Required",
    description: "You must be signed in to access this page.",
  },
  Default: {
    title: "Authentication Error",
    description: "An unexpected error occurred. Please try again.",
  },
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Default";

  const errorInfo = errorMessages[error] || errorMessages.Default;

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
      <Card className="w-full max-w-md border-2 border-destructive/20">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center border-2 border-destructive/20">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {errorInfo.title}
            </CardTitle>
            <CardDescription className="text-base">
              Something went wrong during authentication
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pb-6">
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription className="mt-2">
              {errorInfo.description}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link href="/auth/signin">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full" size="lg">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span className="px-2">Common Solutions</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid gap-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Clear your browser cookies and cache</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Try using a different browser</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Check your internet connection</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Contact support if the problem persists</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-xs text-center text-muted-foreground">
            Error Code: <span className="font-mono font-semibold">{error}</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
