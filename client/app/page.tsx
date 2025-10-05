import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SnippetCard } from "@/components/snippet-card";
import { mockSnippets, mockTags } from "@/lib/mock-data";

export default function Home() {
  const recentSnippets = mockSnippets.slice(0, 6);
  const popularTags = mockTags.slice(0, 8);

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
          {popularTags.map((tag) => (
            <Link key={tag.name} href={`/tags/${tag.name}`}>
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
              >
                #{tag.name}
                <span className="ml-2 text-xs opacity-70">{tag.count}</span>
              </Badge>
            </Link>
          ))}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {recentSnippets.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </div>
      </section>
    </div>
  );
}
