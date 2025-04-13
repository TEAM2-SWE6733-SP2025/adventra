import prisma from "@/app/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { matchId } = params;

    if (!matchId) {
      return new Response(JSON.stringify({ error: "Match ID is required" }), {
        status: 400,
      });
    }

    const messages = await prisma.message.findMany({
      where: { matchId },
      orderBy: { createdAt: "asc" },
    });

    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { matchId } = params;

    if (!matchId) {
      return new Response(JSON.stringify({ error: "Match ID is required" }), {
        status: 400,
      });
    }

    await prisma.message.deleteMany({
      where: { matchId },
    });

    await prisma.match.delete({
      where: { id: matchId },
    });

    return new Response(
      JSON.stringify({
        message: "Match and associated messages deleted successfully",
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting match and messages:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
