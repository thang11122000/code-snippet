import Link from "next/link";
import { Code2, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl"
            >
              <Code2 className="h-6 w-6" />
              <span>CodeSnippet</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Share, discover, and analyze code snippets from developers
              worldwide.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-md border flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-md border flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="mailto:contact@codesnippet.com"
                className="h-9 w-9 rounded-md border flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/explore"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Explore Snippets
                </Link>
              </li>
              <li>
                <Link
                  href="/tags"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Browse Tags
                </Link>
              </li>
              <li>
                <Link
                  href="/snippets/create"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Create Snippet
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* <Separator className="my-8" /> */}

        {/* <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} CodeSnippet. All rights reserved.</p>
          <p>
            Built with ❤️ using{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Next.js
            </a>
            {" & "}
            <a
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              TailwindCSS
            </a>
          </p>
        </div> */}
      </div>
    </footer>
  );
}
