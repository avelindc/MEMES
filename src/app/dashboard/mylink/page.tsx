import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import MyLinkClient from "./MyLinkClient";

export default async function MyLinkPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");

  // Fetch all releases for this user that are RELEASED
  const artistIds = (await prisma.artist.findMany({ where: { userId: session.user.id } })).map(a => a.id);
  
  const releases = await prisma.release.findMany({
    where: { artistId: { in: artistIds }, status: "RELEASED" },
    select: { id: true, title: true, coverArtworkUrl: true }
  });

  if (releases.length === 1) {
    // Jika hanya punya 1 lagu yang rilis, langsung redirect ke Smartlink!
    redirect(`/listen/${releases[0].id}`);
  }

  // Jika tidak punya lagu, atau lebih dari 1 lagu, tampilkan halaman pilihan
  return <MyLinkClient releases={releases} />;
}
