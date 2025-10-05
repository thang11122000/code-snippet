import { notFound } from "next/navigation";
import { Calendar, MapPin, Link as LinkIcon, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { mockUsers, mockSnippets } from "@/lib/mock-data";
import { SnippetCard } from "@/components/snippet-card";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const user = mockUsers.find((u) => u.id === id);

  if (!user) {
    return {
      title: "User Not Found",
    };
  }

  return {
    title: `${user.name} - CodeSnippet`,
    description: user.bio || `View ${user.name}'s code snippets`,
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { id } = await params;
  const user = mockUsers.find((u) => u.id === id);

  if (!user) {
    notFound();
  }

  const userSnippets = mockSnippets.filter((s) => s.author.id === id);
  const isOwnProfile = false; // Mock - would check against current user

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="container max-w-6xl px-4 py-8">
      {/* Profile Header */}
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
                  {isOwnProfile && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 mx-auto md:mx-0"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
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

              {/* Stats */}
              <div className="flex items-center justify-center md:justify-start gap-6 pt-2">
                <div className="text-center md:text-left">
                  <p className="text-2xl font-bold">{userSnippets.length}</p>
                  <p className="text-sm text-muted-foreground">Snippets</p>
                </div>
                <Separator orientation="vertical" className="h-12" />
                <div className="text-center md:text-left">
                  <p className="text-2xl font-bold">
                    {userSnippets.reduce((acc, s) => acc + s.likes, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Likes</p>
                </div>
                <Separator orientation="vertical" className="h-12" />
                <div className="text-center md:text-left">
                  <p className="text-2xl font-bold">
                    {userSnippets.reduce((acc, s) => acc + s.views, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="snippets" className="space-y-6">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="snippets" className="flex-1 md:flex-none">
            Snippets ({userSnippets.length})
          </TabsTrigger>
          <TabsTrigger value="liked" className="flex-1 md:flex-none">
            Liked
          </TabsTrigger>
        </TabsList>

        <TabsContent value="snippets" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="liked">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No liked snippets yet</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
