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
    const foundMessages = await prisma.message.findMany({
      where: { matchId: matchId },
    });
    console.log("Found messages:", foundMessages);
    if (!foundMessages) {
      return new Response(JSON.stringify({ error: "No messages found." }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(foundMessages), {
      status: 200,
    });
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
