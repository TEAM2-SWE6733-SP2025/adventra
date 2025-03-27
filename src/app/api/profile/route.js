import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Request:", req);
    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
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

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = session.user.id;
    const body = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: body.name || null,
        bio: body.bio || null,
        location: body.location || null,
        email: body.email || null,
        adventureTypes: body.adventureTypes || null,
        attitude: body.attitude || null,
        skillLevel: body.skillLevel || null,
        languages: body.languages || null,
        birthdate: body.birthdate ? new Date(body.birthdate) : null,
        profilePic: body.image || body.image || null,
        socialMedia: body.socialMedia || null,
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

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = session.user.id;
    const body = await req.json();

    const upsertedUser = await prisma.user.upsert({
      where: { id: userId },
      update: {
        name: body.name || null,
        bio: body.bio || null,
        location: body.location || null,
        email: body.email || null,
        adventureTypes: body.adventureTypes || null,
        attitude: body.attitude || null,
        skillLevel: body.skillLevel || null,
        languages: body.languages || null,
        birthdate: body.birthdate ? new Date(body.birthdate) : null,
        profilePic: body.profilePic || null,
        socialMedia: body.socialMedia || null,
      },
      create: {
        id: userId,
        name: body.name || null,
        bio: body.bio || null,
        location: body.location || null,
        email: body.email || null,
        adventureTypes: body.adventureTypes || null,
        attitude: body.attitude || null,
        skillLevel: body.skillLevel || null,
        languages: body.languages || null,
        birthdate: body.birthdate ? new Date(body.birthdate) : null,
        profilePic: body.profilePic || null,
        socialMedia: body.socialMedia || null,
      },
    });

    return new Response(JSON.stringify(upsertedUser), { status: 200 });
  } catch (error) {
    console.error("Error upserting user:", error);
    return new Response(JSON.stringify({ error: "Failed to upsert user" }), {
      status: 500,
    });
  }
}
