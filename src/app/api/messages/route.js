import prisma from "@/app/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { matchId } = await params;

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
