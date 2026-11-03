// app/actions/auth.ts
"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import {
  createSession,
  deleteSession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function signup(formData: FormData) {
  const name = getString(formData, "name");
  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");

  if (!name || !email.includes("@") || password.length < 8) {
    redirect("/signup?error=invalid");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    redirect("/signup?error=email-taken");
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  await createSession(user.id);
  redirect("/dashboard");
}

export async function login(formData: FormData) {
  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    redirect("/login?error=invalid-credentials");
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}