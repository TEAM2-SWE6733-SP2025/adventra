import prisma from "@/app/lib/prisma";

export async function POST(req) {
  try {
    const { senderId, receiverId, matchId, content } = await req.json();

    if (!senderId || !receiverId || !matchId || !content) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 },
      );
    }

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        matchId,
        content,
      },
    });

    return new Response(JSON.stringify(message), { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return new Response(JSON.stringify({ error: "Failed to send message" }), {
      status: 500,
    });
  }
}
