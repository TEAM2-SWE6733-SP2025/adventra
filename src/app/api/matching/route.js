/* eslint-disable no-console */
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// eslint-disable-next-line no-unused-vars
export async function GET(req) {
  try {
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

    const userPreferences = await prisma.preferences.findUnique({
      where: { userId: userId },
    });

    const genderCondition =
      userPreferences?.gender === "Male" || userPreferences?.gender === "Female"
        ? ` AND gender = '${userPreferences.gender}'`
        : " ";

    const ageCondition =
      userPreferences?.ageStart != null && userPreferences?.ageEnd != null
        ? ` AND age BETWEEN ${userPreferences.ageStart} AND ${userPreferences.ageEnd}`
        : " ";

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    prisma.user.findMany({ select: { id: true, name: true } });

    const query = `
        SELECT * 
  FROM (
    SELECT 
      id,
      name,
      (6371 * ACOS(
        COS(RADIANS(${user.latitude})) * COS(RADIANS(latitude)) *
        COS(RADIANS(longitude) - RADIANS(${user.longitude})) +
        SIN(RADIANS(${user.latitude})) * SIN(RADIANS(latitude))
      )) AS distance, gender, EXTRACT(YEAR FROM AGE(birthDate)) AS age, bio, city || ', ' || state AS location, "profilePic"
    FROM "User"
    WHERE state = '${user.state}'
      AND id != '${userId}'
  ) AS subquery
  WHERE 
    distance <= ${userPreferences?.distance || 100}
     ${genderCondition} ${ageCondition}
    ORDER BY distance;
      `;

    console.log("Query:", query);
    const users = await prisma.$queryRawUnsafe(query);

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch user" }), {
      status: 500,
    });
  }
}
