import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // 1. Read data sent by the client
    const { name, email, password } = await request.json();

    // 2. Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // 3. Check whether the email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // 4. Hash the password
    const passwordHash = await hashPassword(password);

    // 5. Create the user in PostgreSQL
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // 6. Return successful response
    return NextResponse.json(
      {
        message: "Registration successful",
        user,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}