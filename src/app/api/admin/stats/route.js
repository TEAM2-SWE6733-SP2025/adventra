// filepath: /Users/louis/code_sandbox/adventra/src/app/api/admin/stats/route.js
import prisma from "@/app/lib/prisma";

export async function GET(req) {
  try {
    // Fetch total users and total admins
    const totalUsers = await prisma.user.count();
    const totalAdmins = await prisma.user.count({
      where: { isAdmin: true },
    });

    return new Response(JSON.stringify({ totalUsers, totalAdmins }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch stats" }), {
      status: 500,
    });
  }
}
