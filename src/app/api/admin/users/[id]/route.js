import prisma from "@/app/lib/prisma";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch user" }), {
      status: 500,
    });
  }
}

export async function PUT(req, { params }) {
  const { id } = params; // Get the user ID from the URL

  try {
    const body = await req.json(); // Parse the request body

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: body.name || null,
        email: body.email || null,
        isAdmin: body.isAdmin || false,
        // Add other fields you want to update
      },
    });

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(JSON.stringify({ error: "Failed to update user" }), {
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params; // Get the user ID from the URL

  try {
    await prisma.user.delete({
      where: { id },
    });

    return new Response(
      JSON.stringify({ message: "User deleted successfully" }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return new Response(JSON.stringify({ error: "Failed to delete user" }), {
      status: 500,
    });
  }
}
