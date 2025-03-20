import prisma from "../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new Response(
        JSON.stringify({ error: "User not authenticated" }),
        { status: 401 }
      );
    }

    const userId = session.user.id;
    console.log("Current User ID:", userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch user" }), {
      status: 500,
    });
  }
}