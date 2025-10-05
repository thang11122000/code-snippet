"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CodeEditor } from "@/components/code-editor";
import { LANGUAGES } from "@/lib/types";
import { estimateComplexity, getComplexityColor } from "@/lib/complexity";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function CreateSnippetPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Please sign in to create snippets");
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render form if not authenticated
  if (!session) {
    return null;
  }

  const complexity = estimateComplexity(code);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !code || !language) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Snippet created successfully!");
      router.push("/");
    }, 1000);
  };

  return (
    <div className="container max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Create New Snippet
        </h1>
        <p className="text-muted-foreground">
          Share your code with the community and get automatic complexity
          analysis
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Provide a title and description for your snippet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Binary Search Implementation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what your code does..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Code Card */}
        <Card>
          <CardHeader>
            <CardTitle>Code</CardTitle>
            <CardDescription>Write or paste your code snippet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">
                Language <span className="text-destructive">*</span>
              </Label>
              <Select value={language} onValueChange={setLanguage} required>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <CodeEditor
              value={code}
              onChange={setCode}
              label={
                <span>
                  Code <span className="text-destructive">*</span>
                </span>
              }
              placeholder="// Write your code here..."
            />

            {/* Complexity Badge */}
            {code && (
              <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">
                  Estimated Complexity:
                </span>
                <Badge className={getComplexityColor(complexity)}>
                  {complexity}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tags Card */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>
              Add tags to help others find your snippet (comma-separated)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              id="tags"
              placeholder="e.g., algorithm, search, binary-search"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            {tags && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.split(",").map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    #{tag.trim()}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Link href="/" className="w-full sm:w-auto">
            <Button type="button" variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto gap-2"
          >
            {isSubmitting ? (
              "Creating..."
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create Snippet
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
