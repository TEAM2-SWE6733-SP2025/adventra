import prisma from "@/app/lib/prisma";

export async function POST(req) {
  try {
    const { likerId, likedId } = await req.json();

    if (!likerId || !likedId) {
      return new Response(
        JSON.stringify({ error: "Missing likerId or likedId" }),
        { status: 400 },
      );
    }

    const like = await prisma.like.findFirst({
      where: {
        likerId,
        likedId,
      },
    });

    const mutualLike = await prisma.like.findFirst({
      where: {
        likerId: likedId,
        likedId: likerId,
      },
    });

    if (like && mutualLike) {
      return new Response(JSON.stringify({ status: "matched" }), {
        status: 200,
      });
    } else if (like) {
      return new Response(JSON.stringify({ status: "liked" }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ status: "none" }), { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching match status:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch status" }), {
      status: 500,
    });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const matchId = searchParams.get("matchId");

    if (!matchId) {
      return new Response(
        JSON.stringify({ error: "Missing matchId in request" }),
        { status: 400 },
      );
    }

    const matches = await prisma.match.findFirst({ where: { id: matchId } });
    return new Response(JSON.stringify(matches), { status: 200 });
  } catch (error) {
    console.error("Error fetching match status:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch status" }), {
      status: 500,
    });
  }
}
