import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SnippetCard } from "@/components/snippet-card";
import { snippetApi, tagApi } from "@/lib/api";
import { Snippet, Tag } from "@/lib/types";

export default async function Home() {
  const [snippetsResult, tagsResult] = await Promise.allSettled([
    snippetApi.getAll({ limit: 6, sort: "latest" }),
    tagApi.getPopular(8),
  ]);

  if (snippetsResult.status === "rejected") {
    console.error("Failed to fetch snippets:", snippetsResult.reason);
  }

  if (tagsResult.status === "rejected") {
    console.error("Failed to fetch tags:", tagsResult.reason);
  }

  const recentSnippets: Snippet[] =
    snippetsResult.status === "fulfilled" && snippetsResult.value.success
      ? snippetsResult.value.data
      : [];

  const popularTags: Tag[] =
    tagsResult.status === "fulfilled" && tagsResult.value.success
      ? tagsResult.value.data
      : [];

  return (
    <div className="flex flex-col">
      {/* Hero Section - Mobile First */}
      <section className="relative bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container px-4 py-12 md:py-20 lg:py-24 mx-auto">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Share Your Code Snippets
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl">
              Discover, share, and analyze code snippets from developers
              worldwide. Get instant time complexity estimates for your
              algorithms.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-4">
              <Link href="/snippets/create" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Create Snippet
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/explore" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Explore Snippets
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tags Section */}
      <section className="container px-4 py-8 md:py-12 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Popular Tags</h2>
          <Link href="/tags">
            <Button variant="ghost" size="sm" className="gap-1">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          {popularTags.length > 0 ? (
            popularTags.map((tag) => (
              <Link key={tag.id} href={`/tags/${tag.slug ?? tag.name}`}>
                <Badge
                  variant="secondary"
                  className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  #{tag.name}
                  <span className="ml-2 text-xs opacity-70">{tag.count}</span>
                </Badge>
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Popular tags are not available right now.
            </p>
          )}
        </div>
      </section>

      {/* Recent Snippets Section */}
      <section className="container px-4 py-8 md:py-12 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Recent Snippets</h2>
          <Link href="/explore">
            <Button variant="ghost" size="sm" className="gap-1">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {recentSnippets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {recentSnippets.map((snippet) => (
              <SnippetCard key={snippet._id} snippet={snippet} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No snippets available at the moment. Check back soon!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
