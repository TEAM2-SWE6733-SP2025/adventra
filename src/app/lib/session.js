import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";

export async function getSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      name: true,
      profilePic: true,
      isAdmin: true,
    },
  });

  if (!user) return null;

  return { ...session, user };
}
