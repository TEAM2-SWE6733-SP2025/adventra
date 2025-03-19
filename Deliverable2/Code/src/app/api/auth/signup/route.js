import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      });

      return new Response(
        JSON.stringify({ message: "Password added successfully" }),
        { status: 200 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return new Response(
      JSON.stringify({ message: "User created successfully", user }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
}