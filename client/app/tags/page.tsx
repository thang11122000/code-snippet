"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Hash, TrendingUp, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { tagApi } from "@/lib/api";
import { Tag } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AllTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tags from API
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await tagApi.getAll();
        if (response.success) {
          setTags(response.data);
        } else {
          setError("Failed to fetch tags");
        }
      } catch (err) {
        console.error("Error fetching tags:", err);
        setError("Failed to fetch tags. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  // Sort tags by count
  const sortedTags = [...tags].sort((a, b) => b.count - a.count);
  const topTags = sortedTags.slice(0, 5);

  return (
    <div className="container max-w-6xl px-4 py-8 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Hash className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">All Tags</h1>
            <p className="text-muted-foreground">
              Browse snippets by topic and language
            </p>
          </div>
        </div>
      </div>

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
          {/* Top Tags */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Tags
              </CardTitle>
              <CardDescription>
                Most popular tags in the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topTags.map((tag, index) => (
                  <Link key={tag.name} href={`/tags/${tag.name}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary/50">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            variant="secondary"
                            className="text-lg px-3 py-1"
                          >
                            #{tag.name}
                          </Badge>
                          <span className="text-2xl font-bold text-muted-foreground">
                            #{index + 1}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {tag.count} {tag.count === 1 ? "snippet" : "snippets"}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* All Tags */}
          <Card>
            <CardHeader>
              <CardTitle>All Tags</CardTitle>
              <CardDescription>
                Click on any tag to view related snippets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {sortedTags.map((tag) => (
                  <Link key={tag.name} href={`/tags/${tag.name}`}>
                    <Badge
                      variant="outline"
                      className="px-4 py-2 text-base hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                    >
                      #{tag.name}
                      <span className="ml-2 text-sm opacity-70">
                        {tag.count}
                      </span>
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
