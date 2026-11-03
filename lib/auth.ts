// "use cache"
import argon2 from "argon2";
import { randomBytes, createHash } from "crypto";
import { cookies } from "next/headers";
import prisma from "./prisma";
const SESSION_COOKIE = "session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Hash a password before storing it
export async function hashPassword(password: string) {
  return argon2.hash(password);
}

// Verify a submitted password against its stored hash
export async function verifyPassword(
  password: string,
  hash: string
) {
  return argon2.verify(hash, password);
}

// Create a session and set its cookie
export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256")
    .update(token)
    .digest("hex");

  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await prisma.session.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

// Get the currently authenticated user
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  const tokenHash = createHash("sha256")
    .update(token)
    .digest("hex");

  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!session || session.expiresAt <= new Date()) {
    await deleteSession();
    return null;
  }

  return session.user;
}

// Delete the session and clear its cookie
export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    const tokenHash = createHash("sha256")
      .update(token)
      .digest("hex");

    await prisma.session.deleteMany({
      where: { tokenHash },
    });
  }

  cookieStore.delete(SESSION_COOKIE);
}