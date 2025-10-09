"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Sparkles,
  Loader2,
  Clock,
  AlertCircle,
  Tag,
  X,
} from "lucide-react";
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
import { snippetApi, tagApi } from "@/lib/api";

export default function CreateSnippetPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const tagsInputRef = useRef<HTMLInputElement>(null);

  // Auto-save to localStorage
  const saveDraft = useCallback(() => {
    const draft = {
      title,
      description,
      code,
      language,
      tags,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("snippet-draft", JSON.stringify(draft));
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
  }, [title, description, code, language, tags]);

  // Load draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem("snippet-draft");
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setTitle(draft.title || "");
        setDescription(draft.description || "");
        setCode(draft.code || "");
        setLanguage(draft.language || "");
        setTags(draft.tags || "");
        if (draft.timestamp) {
          setLastSaved(new Date(draft.timestamp));
        }
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
    }
  }, []);

  // Auto-save when form changes
  useEffect(() => {
    if (title || description || code || language || tags) {
      setHasUnsavedChanges(true);
      const timer = setTimeout(saveDraft, 2000); // Auto-save after 2 seconds of inactivity
      return () => clearTimeout(timer);
    }
  }, [title, description, code, language, tags, saveDraft]);

  // Fetch tag suggestions
  const fetchTagSuggestions = useCallback(
    async (query: string) => {
      if (query.length < 2) {
        setTagSuggestions([]);
        return;
      }

      try {
        const response = await tagApi.getAll();
        if (response.success) {
          const suggestions = response.data
            .filter(
              (tag) =>
                tag.name.toLowerCase().includes(query.toLowerCase()) &&
                !selectedTags.includes(tag.name)
            )
            .slice(0, 5)
            .map((tag) => tag.name);
          setTagSuggestions(suggestions);
        }
      } catch (error) {
        console.error("Failed to fetch tag suggestions:", error);
      }
    },
    [selectedTags]
  );

  // Handle tag input changes
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTags(value);

    if (value.includes(",")) {
      const newTags = value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      setSelectedTags((prev) => [
        ...prev,
        ...newTags.filter((tag) => !prev.includes(tag)),
      ]);
      setTags("");
      setShowTagSuggestions(false);
    } else {
      fetchTagSuggestions(value);
      setShowTagSuggestions(true);
    }
  };

  // Add tag from suggestion
  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
    setTags("");
    setShowTagSuggestions(false);
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  // Clear draft on successful submit
  const clearDraft = useCallback(() => {
    localStorage.removeItem("snippet-draft");
    setLastSaved(null);
    setHasUnsavedChanges(false);
  }, []);

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

    if (!session?.user?.id || !session.user.name) {
      toast.error(
        "Missing user information. Please sign out and sign in again."
      );
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title,
      description,
      code,
      languageCode: language,
      tags: selectedTags,
      complexity,
      authorId: session.user.id,
      authorName: session.user.name,
      authorImage: session.user.image ?? undefined,
      isPublic: true,
    };

    try {
      const response = await snippetApi.create(payload);

      if (!response.success) {
        throw new Error(response.message ?? "Failed to create snippet");
      }

      toast.success("Snippet created successfully!");
      clearDraft();
      router.push(`/snippets/${response.data._id}`);
    } catch (error) {
      console.error("Failed to create snippet", error);
      const message =
        error instanceof Error ? error.message : "Failed to create snippet";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container max-w-6xl px-4 py-8 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Create New Snippet
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
              Share your code with the community and get automatic complexity
              analysis
            </p>

            {/* Auto-save Status */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              {hasUnsavedChanges ? (
                <>
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span>Unsaved changes</span>
                </>
              ) : lastSaved ? (
                <>
                  <Clock className="h-4 w-4 text-green-500" />
                  <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Auto-save enabled</span>
                </>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Two Column Layout for Basic Info and Language */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Info Card */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Basic Information
                </CardTitle>
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
                    className="text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what your code does, its purpose, and any important details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Language and Tags Card */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Language & Tags</CardTitle>
                <CardDescription>
                  Select the programming language and add relevant tags
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">
                    Language <span className="text-destructive">*</span>
                  </Label>
                  <Select value={language} onValueChange={setLanguage} required>
                    <SelectTrigger id="language" className="text-base">
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

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="relative">
                    <Input
                      ref={tagsInputRef}
                      id="tags"
                      placeholder="Type to search tags or add new ones..."
                      value={tags}
                      onChange={handleTagInputChange}
                      onFocus={() => setShowTagSuggestions(true)}
                      onBlur={() => {
                        setTimeout(() => setShowTagSuggestions(false), 200);
                      }}
                      className="text-base"
                    />

                    {/* Tag Suggestions Dropdown */}
                    {showTagSuggestions && tagSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                        {tagSuggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => addTag(suggestion)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                          >
                            <Tag className="h-3 w-3" />
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Selected Tags */}
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs flex items-center gap-1"
                        >
                          #{tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Type to search existing tags or add new ones. Press comma to
                    add.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Code Editor Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Code Editor</span>
                {language && (
                  <Badge variant="outline" className="ml-2">
                    {language}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Write or paste your code snippet. The complexity will be
                automatically analyzed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>
                  Code <span className="text-destructive">*</span>
                </Label>
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language={language}
                  placeholder="// Write your code here..."
                />
              </div>

              {/* Code Stats and Complexity */}
              {code && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">Lines:</span>
                    <span className="text-sm text-muted-foreground">
                      {code.split("\n").length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Characters:</span>
                    <span className="text-sm text-muted-foreground">
                      {code.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Complexity:</span>
                    <Badge className={getComplexityColor(complexity)}>
                      {complexity}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {title && code && language ? (
                    <span className="text-green-600">✓ Ready to create</span>
                  ) : (
                    <span>Fill in all required fields to continue</span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Link href="/" className="w-full sm:w-auto">
                    <Button type="button" variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !title || !code || !language}
                    className="w-full sm:w-auto gap-2 min-w-[140px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Create Snippet
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
