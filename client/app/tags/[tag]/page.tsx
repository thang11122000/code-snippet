import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockSnippets, mockTags } from "@/lib/mock-data";
import { SnippetCard } from "@/components/snippet-card";

interface PageProps {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `#${decodedTag} - CodeSnippet`,
    description: `Browse code snippets tagged with ${decodedTag}`,
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  const tagInfo = mockTags.find((t) => t.name === decodedTag);
  const snippets = mockSnippets.filter((s) =>
    s.tags.some((t) => t.toLowerCase() === decodedTag.toLowerCase())
  );

  if (snippets.length === 0) {
    notFound();
  }

  const relatedTags = mockTags
    .filter((t) => t.name !== decodedTag)
    .slice(0, 10);

  return (
    <div className="container max-w-6xl px-4 py-8">
      {/* Back Button */}
      <Link href="/">
        <Button variant="ghost" size="sm" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Hash className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">#{decodedTag}</h1>
            <p className="text-muted-foreground">
              {tagInfo
                ? `${tagInfo.count} snippets`
                : `${snippets.length} snippets`}
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
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </div>
      </div>
    </div>
  );
}
