import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { snippetApi } from "@/lib/api";
import { getComplexityColor } from "@/lib/complexity";
import { CopyButton } from "@/components/copy-button";
import { CodeEditor } from "@/components/code-editor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const response = await snippetApi.getById(id);

  if (!response.success || !response.data) {
    return {
      title: "Snippet Not Found",
    };
  }

  const snippet = response.data;

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
  const response = await snippetApi.getById(id);

  if (!response.success || !response.data) {
    notFound();
  }

  const snippet = response.data;

  const relatedSnippetsResponse = await snippetApi.getAll({
    languageCode: snippet.languageCode,
    sort: "popular",
    limit: 4,
  });

  const relatedSnippets =
    relatedSnippetsResponse.success &&
    Array.isArray(relatedSnippetsResponse.data)
      ? relatedSnippetsResponse.data
          .filter((s) => s._id !== snippet._id)
          .slice(0, 3)
      : [];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="container max-w-6xl px-4 py-8 mx-auto">
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
            </div>
          </div>

          <Separator />

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-sm">
              {snippet.languageCode}
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
              <CodeEditor
                value={snippet.code}
                language={snippet.languageCode}
                placeholder=""
                readOnly={true}
              />
            </CardContent>
          </Card>
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
                href={`/profile/${snippet.authorId}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={snippet.authorImage}
                    alt={snippet.authorName}
                  />
                  <AvatarFallback>{snippet.authorName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{snippet.authorName}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {snippet.authorName}
                  </p>
                </div>
              </Link>
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
                  }/snippets/${snippet._id}`}
                  className="flex-1 px-3 py-2 text-sm bg-muted rounded-md truncate"
                />
                <CopyButton
                  text={`${
                    typeof window !== "undefined" ? window.location.origin : ""
                  }/snippets/${snippet._id}`}
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
                    key={related._id}
                    href={`/snippets/${related._id}`}
                    className="block group"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                        {related.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {related.description}
                      </p>
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
