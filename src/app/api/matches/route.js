import prisma from "@/app/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Missing userId in request" }),
        { status: 400 },
      );
    }

    const matches = await prisma.match.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            location: true,
            profilePic: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            location: true,
            profilePic: true,
          },
        },
      },
    });

    if (!matches || matches.length === 0) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    return new Response(JSON.stringify(matches), { status: 200 });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch matches" }), {
      status: 500,
    });
  }
}
