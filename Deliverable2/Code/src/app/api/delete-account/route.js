import prisma from "../../lib/prisma";

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { id } = body;

    console.log("ID received in request:", id);

    if (!id) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    await prisma.account.deleteMany({
      where: { userId: id },
    });

    await prisma.session.deleteMany({
      where: { userId: id },
    });

    await prisma.user.delete({
      where: { id },
    });

    return new Response(
      JSON.stringify({ message: "Account deleted successfully" }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error deleting account:", error);
    return new Response(JSON.stringify({ error: "Failed to delete account" }), {
      status: 500,
    });
  }
}
