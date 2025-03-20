import prisma from "../../lib/prisma";

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, name, bio, location } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, bio, location },
    });

    return new Response(
      JSON.stringify({
        message: "Account updated successfully",
        user: updatedUser,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating account:", error);
    return new Response(JSON.stringify({ error: "Failed to update account" }), {
      status: 500,
    });
  }
}
