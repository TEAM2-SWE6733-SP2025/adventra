import prisma from "@/app/lib/prisma";

export async function POST(req) {
  try {
    const { likerId, likedId } = await req.json();

    await prisma.like.create({
      data: {
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

    if (mutualLike) {
      const match = await prisma.match.create({
        data: {
          user1Id: likerId,
          user2Id: likedId,
        },
      });

      return new Response(JSON.stringify({ message: "It's a match!", match }), {
        status: 200,
      });
    }

    return new Response(
      JSON.stringify({ message: "Like recorded, waiting for mutual like." }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error handling match:", error);
    return new Response(JSON.stringify({ error: "Failed to handle match" }), {
      status: 500,
    });
  }
}
