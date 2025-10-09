"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Search, Loader2, Tag, User, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { snippetApi } from "@/lib/api";
import { SnippetCard } from "@/components/snippet-card";
import { LANGUAGES, Snippet, ApiResponse } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [searchSuggestions, setSearchSuggestions] = useState<{
    tags: Array<{ name: string; count: number }>;
    authors: Array<{ name: string; count: number }>;
  }>({ tags: [], authors: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounced search query
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch search suggestions
  const fetchSearchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchSuggestions({ tags: [], authors: [] });
      return;
    }

    try {
      const response = await snippetApi.getSearchSuggestions(query);
      if (response.success) {
        setSearchSuggestions(response.data);
      }
    } catch (err) {
      console.error("Error fetching search suggestions:", err);
    }
  }, []);

  // Debounced search suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSearchSuggestions(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchSearchSuggestions]);

  // Fetch snippets from API
  const fetchSnippets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        languageCode: selectedLanguage === "all" ? undefined : selectedLanguage,
        search: debouncedSearchQuery || undefined,
        sort: (sortBy === "newest" ? "latest" : "oldest") as
          | "latest"
          | "popular"
          | "views",
        tag: selectedTags.length > 0 ? selectedTags[0] : undefined, // API only supports single tag filter
      };

      console.log("Fetching snippets with params:", params);
      const response: ApiResponse<Snippet[]> = await snippetApi.getAll(params);
      console.log("API response:", response);

      if (response.success) {
        setSnippets(response.data);
        if (response.pagination) {
          setPagination((prev) => ({
            ...prev,
            ...response.pagination!,
          }));
        }
      } else {
        setError("Failed to fetch snippets");
      }
    } catch (err) {
      console.error("Error fetching snippets:", err);
      setError("Failed to fetch snippets. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [
    debouncedSearchQuery,
    selectedLanguage,
    sortBy,
    selectedTags,
    pagination.page,
    pagination.limit,
  ]);

  // Fetch snippets when filters change
  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  // Reset to first page when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearchQuery, selectedLanguage, sortBy, selectedTags]);

  // Memoized filtered snippets for client-side tag filtering
  const filteredSnippets = useMemo(() => {
    if (selectedTags.length === 0) {
      return snippets;
    }

    return snippets.filter((snippet) =>
      selectedTags.some((tag) => snippet.tags.includes(tag))
    );
  }, [snippets, selectedTags]);

  // Memoized clear filters function
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedLanguage("all");
    setSelectedTags([]);
    setShowSuggestions(false);
  }, []);

  // Memoized load more function
  const loadMore = useCallback(() => {
    if (pagination.page < pagination.pages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [pagination.page, pagination.pages]);

  return (
    <div className="container max-w-7xl px-4 py-8 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Explore Snippets
        </h1>
        <p className="text-muted-foreground">
          Discover code snippets from developers around the world
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            placeholder="Search snippets, tags, or authors..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              // Delay hiding suggestions to allow clicking on them
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            className="pl-10"
          />

          {/* Search Suggestions Dropdown */}
          {showSuggestions &&
            (searchSuggestions.tags.length > 0 ||
              searchSuggestions.authors.length > 0) && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {searchSuggestions.tags.length > 0 && (
                  <div className="p-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">
                      <Tag className="h-3 w-3" />
                      Tags
                    </div>
                    {searchSuggestions.tags.map((tag) => (
                      <button
                        key={tag.name}
                        onClick={() => {
                          setSearchQuery(tag.name);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm flex items-center justify-between"
                      >
                        <span>#{tag.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {tag.count}
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}

                {searchSuggestions.authors.length > 0 && (
                  <div className="p-2 border-t">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">
                      <User className="h-3 w-3" />
                      Authors
                    </div>
                    {searchSuggestions.authors.map((author) => (
                      <button
                        key={author.name}
                        onClick={() => {
                          setSearchQuery(author.name);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm flex items-center justify-between"
                      >
                        <span>{author.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {author.count}
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
        </div>

        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All Languages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as "newest" | "oldest")}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {(selectedTags.length > 0 || searchQuery) && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: &ldquo;{searchQuery}&rdquo;
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1"
              >
                #{tag}
                <button
                  onClick={() =>
                    setSelectedTags((prev) => prev.filter((t) => t !== tag))
                  }
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert className="mb-4" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredSnippets.length} of {pagination.total}{" "}
          {pagination.total === 1 ? "snippet" : "snippets"}
        </p>
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </div>
        )}
      </div>

      {/* Snippets Grid */}
      {loading && filteredSnippets.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filteredSnippets.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredSnippets.map((snippet) => (
              <SnippetCard key={snippet._id} snippet={snippet} />
            ))}
          </div>

          {/* Load More Button */}
          {pagination.page < pagination.pages && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={loadMore}
                disabled={loading}
                variant="outline"
                className="min-w-[120px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No snippets found matching your criteria
          </p>
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
