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
            profilePic: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
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

export async function PUT(req, { params }) {
  try {
    console.log("Updating isBlocked status");
    const body = await req.json();
    const { matchId, userId } = body;

    if (!matchId || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid matchId or userId" }),
        { status: 400 },
      );
    }

    const prev = await prisma.match.findFirst({
      where: { id: matchId },
    });

    if (!prev) {
      return new Response(JSON.stringify({ error: "Match not found" }), {
        status: 404,
      });
    }

    // If isBlocked is being changed from true to false, check if the same user is updating it
    if (prev.isBlocked && prev.blockedBy !== userId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized to unblock this match" }),
        { status: 403 },
      );
    }

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        isBlocked: !prev.isBlocked,
        blockedBy: prev.isBlocked ? null : userId, // Set blockedBy to null if unblocking, otherwise set to userId
      },
    });

    return new Response(JSON.stringify(updatedMatch), { status: 200 });
  } catch (error) {
    console.error("Error updating isBlocked:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update isBlocked" }),
      { status: 500 },
    );
  }
}
