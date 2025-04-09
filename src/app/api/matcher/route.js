import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

//Temporary function to create matches for testing the chat feature, can be modified later to create matches when two users swipe right on each other(or however we decide that will work)
export async function POST(req) {
  try {
    const newMatches = await req.json();
    // Validate that newMatches is arriving as an array
    if (!Array.isArray(newMatches)) {
      return new Response(
        JSON.stringify({
          error: "Invalid data format. Expected an array of user IDs.",
        }),
        { status: 400 }
      );
    }

    // Temporary way to create unique matches in the database
    const createdMatches = [];

    for (const match of newMatches) {
      const existingMatch = await prisma.match.findFirst({
        where: {
          OR: [
            { userOneId: match.userOneId, userTwoId: match.userTwoId },
            { userOneId: match.userTwoId, userTwoId: match.userOneId },
          ],
        },
      });

      if (!existingMatch) {
        const newMatch = await prisma.match.create({
          data: {
            userOneId: match.userOneId,
            userTwoId: match.userTwoId,
            userOneName: match.userOneName,
            userTwoName: match.userTwoName,
          },
        });
        createdMatches.push(newMatch);
      }
    }

    return new Response(JSON.stringify({ success: true, createdMatches }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating matches:", error);
    return new Response(JSON.stringify({ error: "Failed to create matches" }), {
      status: 500,
    });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = session.user.id;
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ userOneId: userId }, { userTwoId: userId }],
      },
    });

    return new Response(JSON.stringify(matches), { status: 200 });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch matches" }), {
      status: 500,
    });
  }
}
