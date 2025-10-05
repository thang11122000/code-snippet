import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Heart,
  Share2,
  Edit,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { mockSnippets } from "@/lib/mock-data";
import { getComplexityColor } from "@/lib/complexity";
import { SnippetCard } from "@/components/snippet-card";
import { CopyButton } from "@/components/copy-button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const snippet = mockSnippets.find((s) => s.id === id);

  if (!snippet) {
    return {
      title: "Snippet Not Found",
    };
  }

  return {
    title: `${snippet.title} - CodeSnippet`,
    description: snippet.description,
    openGraph: {
      title: snippet.title,
      description: snippet.description,
      type: "article",
    },
  };
}

export default async function SnippetDetailPage({ params }: PageProps) {
  const { id } = await params;
  const snippet = mockSnippets.find((s) => s.id === id);

  if (!snippet) {
    notFound();
  }

  const relatedSnippets = mockSnippets
    .filter((s) => s.id !== id && s.language === snippet.language)
    .slice(0, 3);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="container max-w-6xl px-4 py-8">
      {/* Back Button */}
      <Link href="/">
        <Button variant="ghost" size="sm" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 break-words">
                  {snippet.title}
                </h1>
                <p className="text-muted-foreground">{snippet.description}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(snippet.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{snippet.views} views</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>{snippet.likes} likes</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-sm">
              {snippet.language}
            </Badge>
            <Badge
              className={`text-sm ${getComplexityColor(snippet.complexity)}`}
            >
              {snippet.complexity}
            </Badge>
            {snippet.tags.map((tag) => (
              <Link key={tag} href={`/tags/${tag}`}>
                <Badge
                  variant="outline"
                  className="hover:bg-primary/10 cursor-pointer"
                >
                  #{tag}
                </Badge>
              </Link>
            ))}
          </div>

          {/* Code Block */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <h2 className="text-xl font-semibold">Code</h2>
              <CopyButton text={snippet.code} />
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-md p-4 font-mono text-sm overflow-x-auto">
                <pre>
                  <code>{snippet.code}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button className="gap-2">
              <Heart className="h-4 w-4" />
              Like
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Author Card */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Author</h3>
            </CardHeader>
            <CardContent>
              <Link
                href={`/profile/${snippet.author.id}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={snippet.author.avatar}
                    alt={snippet.author.name}
                  />
                  <AvatarFallback>{snippet.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{snippet.author.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {snippet.author.email}
                  </p>
                </div>
              </Link>
              {snippet.author.bio && (
                <p className="text-sm text-muted-foreground mt-3">
                  {snippet.author.bio}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Share Card */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Share this snippet</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${
                    typeof window !== "undefined" ? window.location.origin : ""
                  }/snippets/${snippet.id}`}
                  className="flex-1 px-3 py-2 text-sm bg-muted rounded-md truncate"
                />
                <CopyButton
                  text={`${
                    typeof window !== "undefined" ? window.location.origin : ""
                  }/snippets/${snippet.id}`}
                />
              </div>
            </CardContent>
          </Card>

          {/* Related Snippets */}
          {relatedSnippets.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Related Snippets</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedSnippets.map((related) => (
                  <Link
                    key={related.id}
                    href={`/snippets/${related.id}`}
                    className="block group"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                        {related.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {related.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{related.likes} likes</span>
                        <span>•</span>
                        <span>{related.views} views</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
