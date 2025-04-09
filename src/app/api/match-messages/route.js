import prisma from "../../lib/prisma";

//Find a match by its matchId and return the messages associated with it
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const matchId = searchParams.get("matchId");
    if (!matchId) {
      return new Response(
        JSON.stringify({ error: "Request query did not contain matchId." }),
        {
          status: 400,
        },
      );
    }
    const targetMatch = await prisma.match.findUnique({
      where: { id: matchId },
      include: { messages: true }, // Include messages in the response
    });

    if (!targetMatch) {
      return new Response(JSON.stringify({ error: "Match not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(targetMatch.messages), { status: 200 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching match messages:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch match messages" }),
      {
        status: 500,
      },
    );
  }
}
