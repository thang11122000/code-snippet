"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Hash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { snippetApi, tagApi } from "@/lib/api";
import { SnippetCard } from "@/components/snippet-card";
import { Snippet, Tag } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PageProps {
  params: Promise<{ tag: string }>;
}

export default function TagPage({ params }: PageProps) {
  const [tag, setTag] = useState<string>("");
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [relatedTags, setRelatedTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializePage = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get tag from params
        const resolvedParams = await params;
        const decodedTag = decodeURIComponent(resolvedParams.tag);
        setTag(decodedTag);

        // Fetch snippets for this tag
        const snippetsResponse = await snippetApi.getAll({
          tag: decodedTag,
          limit: 50, // Get more snippets for tag page
        });

        if (snippetsResponse.success) {
          setSnippets(snippetsResponse.data);
        } else {
          setError("Failed to fetch snippets");
          return;
        }

        // Fetch all tags for related tags
        const tagsResponse = await tagApi.getAll();
        if (tagsResponse.success) {
          const allTags = tagsResponse.data;
          const related = allTags
            .filter((t) => t.name !== decodedTag)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
          setRelatedTags(related);
        }
      } catch (err) {
        console.error("Error loading tag page:", err);
        setError("Failed to load tag page. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [params]);

  // Show not found if no snippets and not loading
  if (!loading && !error && snippets.length === 0) {
    notFound();
  }

  return (
    <div className="container max-w-6xl px-4 py-8">
      {/* Back Button */}
      <Link href="/tags">
        <Button variant="ghost" size="sm" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Tags
        </Button>
      </Link>

      {/* Error State */}
      {error && (
        <Alert className="mb-8" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {/* Content - Only show when not loading */}
      {!loading && !error && (
        <>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Hash className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">#{tag}</h1>
                <p className="text-muted-foreground">
                  {snippets.length}{" "}
                  {snippets.length === 1 ? "snippet" : "snippets"}
                </p>
              </div>
            </div>
          </div>

          {/* Related Tags */}
          {relatedTags.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Related Tags</h2>
              <div className="flex flex-wrap gap-2">
                {relatedTags.map((relatedTag) => (
                  <Link key={relatedTag.name} href={`/tags/${relatedTag.name}`}>
                    <Badge
                      variant="secondary"
                      className="px-3 py-1 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                    >
                      #{relatedTag.name}
                      <span className="ml-2 text-xs opacity-70">
                        {relatedTag.count}
                      </span>
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Snippets Grid */}
          <div>
            <h2 className="text-xl font-semibold mb-4">All Snippets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {snippets.map((snippet) => (
                <SnippetCard key={snippet._id} snippet={snippet} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
