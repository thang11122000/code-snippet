"use client";

import Link from "next/link";
import { memo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Snippet } from "@/lib/types";
import { getComplexityColor, getComplexityLabel } from "@/lib/complexity";

interface SnippetCardProps {
  snippet: Snippet;
}

export const SnippetCard = memo(function SnippetCard({
  snippet,
}: SnippetCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/snippets/${snippet._id}`} className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {snippet.title}
            </h3>
          </Link>
          <Badge variant="secondary" className="shrink-0">
            {snippet.languageCode}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {snippet.description}
        </p>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="bg-muted/50 rounded-md p-3 font-mono text-xs overflow-hidden">
          <pre className="line-clamp-5 overflow-x-auto">
            <code>{snippet.code}</code>
          </pre>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {snippet.tags.slice(0, 3).map((tag) => (
            <Link key={tag} href={`/tags/${tag}`}>
              <Badge
                variant="outline"
                className="hover:bg-primary/10 cursor-pointer"
              >
                #{tag}
              </Badge>
            </Link>
          ))}
          {snippet.tags.length > 3 && (
            <Badge variant="outline">+{snippet.tags.length - 3}</Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between text-sm text-muted-foreground border-t">
        <Link
          href={`/profile/${snippet.authorId}`}
          className="flex items-center gap-2 hover:text-foreground transition-colors"
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src={snippet.authorImage} alt={snippet.authorName} />
            <AvatarFallback>{snippet.authorName[0]}</AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium">{snippet.authorName}</span>
        </Link>

        <div className="flex items-center gap-3">
          <Badge
            className={`text-xs ${getComplexityColor(snippet.complexity)}`}
          >
            {getComplexityLabel(snippet.complexity)}
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
});
