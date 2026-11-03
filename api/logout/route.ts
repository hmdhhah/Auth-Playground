import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";

export async function POST() {
  try {
    await deleteSession();

    return NextResponse.redirect(
      new URL("/login", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
      { status: 303 }
    );
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      { error: "Could not log out" },
      { status: 500 }
    );
  }
}