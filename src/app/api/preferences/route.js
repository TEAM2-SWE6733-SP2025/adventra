/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { distance } from "framer-motion";

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

    const updatedPreferences = await prisma.preferences.upsert({
      where: { userId: userId },
      update: {
        userId: userId,
        gender: body.gender || null,
        ageStart: body.ageStart || 0,
        ageEnd: body.ageEnd || 100,
        distance: body.distance || 99,
      },
      create: {
        userId: userId,
        gender: body.gender || null,
        ageStart: body.ageStart || 0,
        ageEnd: body.ageEnd || 100,
        distance: body.distance || 99,
      },
    });

    return new Response(JSON.stringify(updatedPreferences), { status: 200 });
  } catch (error) {
    console.error("Error updating userPreferences:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update userPreferences" }),
      {
        status: 500,
      },
    );
  }
}
