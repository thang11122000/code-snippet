import { redirect } from "next/navigation";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { mockSnippets } from "@/lib/mock-data";
import { SnippetCard } from "@/components/snippet-card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      title: "Sign In Required - CodeSnippet",
    };
  }

  return {
    title: `${session.user.name} - CodeSnippet`,
    description:
      session.user.email || `View ${session.user.name}'s code snippets`,
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  // Redirect to sign in if not authenticated
  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Check if viewing own profile
  const isOwnProfile = session.user.id === id;

  // If not own profile, redirect to own profile (for now)
  // Later you can allow viewing other users' profiles
  if (!isOwnProfile) {
    redirect(`/profile/${session.user.id}`);
  }

  const user = {
    id: session.user.id,
    name: session.user.name || "Anonymous User",
    email: session.user.email || "",
    avatar: session.user.image || "",
    bio: "", // TODO: Get from database
    createdAt: new Date().toISOString(), // TODO: Get from database
  };

  // TODO: Get user snippets from database
  const userSnippets = mockSnippets.filter((s) => s.author.id === id);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="container max-w-6xl px-4 py-8 mx-auto">
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <Avatar className="h-24 w-24 md:h-32 md:w-32 mx-auto md:mx-0">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-3xl">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {user.name}
                  </h1>
                </div>
                <p className="text-muted-foreground">{user.email}</p>
              </div>

              {user.bio && <p className="text-sm md:text-base">{user.bio}</p>}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {userSnippets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {userSnippets.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">No snippets yet</p>
            {isOwnProfile && <Button>Create Your First Snippet</Button>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
