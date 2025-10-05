"use client";

import Link from "next/link";
import { Code2, Search, Plus, User, LogOut, Globe, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";
import { Locale, getTranslations } from "@/lib/i18n";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [locale, setLocale] = useState<Locale>("en");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Mock auth state
  const t = getTranslations(locale);

  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const toggleLocale = () => {
    setLocale(locale === "en" ? "vi" : "en");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Code2 className="h-6 w-6" />
            <span className="hidden sm:inline">CodeSnippet</span>
          </Link>
          <Link href="/explore">
            <Button
              variant={isActive("/explore") ? "secondary" : "ghost"}
              size="sm"
              className="gap-2 cursor-pointer"
            >
              <Search className="h-4 w-4" />
              Explore
            </Button>
          </Link>

          <Link href="/tags">
            <Button
              variant={isActive("/tags") ? "secondary" : "ghost"}
              size="sm"
              className="gap-2 cursor-pointer"
            >
              <Tag className="h-4 w-4" />
              Tags
            </Button>
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLocale}
            title="Change Language"
          >
            <Globe className="h-5 w-5" />
          </Button>

          {/* Create Button */}
          {isAuthenticated && (
            <Link href="/snippets/create">
              <Button variant="default" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline mt-[-2px]">
                  {t.nav.create}
                </span>
              </Button>
            </Link>
          )}

          {/* User Menu or Sign In */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/user.jpg" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    {t.nav.profile}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setIsAuthenticated(false)}
                  className="cursor-pointer text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t.nav.signOut}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/signin">
              <Button variant="default" size="sm">
                {t.nav.signIn}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
