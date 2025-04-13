import prisma from "@/app/lib/prisma";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { name: true },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
