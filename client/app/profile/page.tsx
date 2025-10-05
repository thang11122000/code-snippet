import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ProfileRedirectPage() {
  const session = await getServerSession(authOptions);

  // Redirect to sign in if not authenticated
  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Redirect to user's profile page
  redirect(`/profile/${session.user.id}`);
}
