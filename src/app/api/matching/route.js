/* eslint-disable no-console */
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// eslint-disable-next-line no-unused-vars
export async function GET(req) {
  try {
    const maxDistance = 500; // Set your desired max distance in kilometers

    const session = await getServerSession(authOptions);

    if (!session?.user) {
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

    prisma.user.findMany({ select: { id: true, name: true } });

    const users = await prisma.$queryRaw`
      SELECT *
  FROM (
    SELECT id, name,
           (6371 * ACOS(
               COS(RADIANS(${user.latitude})) * COS(RADIANS(latitude)) *
               COS(RADIANS(longitude) - RADIANS(${user.longitude})) +
               SIN(RADIANS(${user.latitude})) * SIN(RADIANS(latitude))
           )) AS distance
    FROM "User"
    WHERE state = ${user.state}
    and id != ${userId}
  ) AS subquery
  WHERE distance < ${maxDistance}
  ORDER BY distance;
    `;

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch user" }), {
      status: 500,
    });
  }
}
