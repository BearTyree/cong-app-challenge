"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getDbAsync } from "@/lib/drizzle";
import hash from "@/lib/hash";
import generateToken from "@/lib/generateToken";
import { authenticated } from "@/controllers/auth";
import { profilesTable, usersTable } from "@/lib/schema";

export type AuthFormState =
  | {
      error?: string;
      values?: {
        email?: string;
        username?: string;
      };
    }
  | null;

const oneWeek = 60 * 60 * 24 * 7;

const cookieConfig = {
  name: "token",
  httpOnly: true,
  sameSite: "strict" as const,
  path: "/",
  maxAge: oneWeek,
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function authenticate(
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const cookieStore = await cookies();
  const db = await getDbAsync();

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required.", values: { email } };
  }

  if (!emailPattern.test(email)) {
    return { error: "Enter a valid email address.", values: { email } };
  }

  const user = await db.query.usersTable.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });

  if (!user) {
    return { error: "No account found for that email.", values: { email } };
  }

  const passwordHash = await hash(password + user.passwordSalt);

  if (passwordHash !== user.passwordHash) {
    return { error: "Incorrect password. Please try again.", values: { email } };
  }

  cookieStore.set({
    ...cookieConfig,
    value: await generateToken(email),
  });

  redirect("/");
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/login");
}

export async function createUser(
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const db = await getDbAsync();

  const email = String(formData.get("email") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!email || !username || !password || !confirmPassword) {
    return {
      error: "All fields are required.",
      values: { email, username },
    };
  }

  if (!emailPattern.test(email)) {
    return { error: "Enter a valid email address.", values: { email, username } };
  }

  if (username.length < 3) {
    return {
      error: "Username must be at least 3 characters long.",
      values: { email, username },
    };
  }

  if (password.length < 8) {
    return {
      error: "Password must be at least 8 characters long.",
      values: { email, username },
    };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match.", values: { email, username } };
  }

  const existingUser = await db.query.usersTable.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });

  if (existingUser) {
    return {
      error: "An account with that email already exists.",
      values: { email, username },
    };
  }

  const saltBytes = new Uint8Array(16);
  crypto.getRandomValues(saltBytes);
  const salt = Array.from(saltBytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  const passwordHash = await hash(password + salt);

  const [createdUser] = await db
    .insert(usersTable)
    .values({
      email,
      passwordHash,
      passwordSalt: salt,
    })
    .returning({ id: usersTable.id });

  const userId =
    createdUser?.id ??
    (await db.query.usersTable.findFirst({
      where: (users, { eq }) => eq(users.email, email),
      columns: { id: true },
    }))?.id;

  if (!userId) {
    throw new Error("Failed to create user account.");
  }

  await db.insert(profilesTable).values({
    userId,
    username,
  });

  redirect("/login");
}

export async function checkToken(): Promise<void> {
  const cookieStore = await cookies();
  const email = await authenticated();

  if (!email) {
    cookieStore.delete("token");
    return;
  }

  cookieStore.set({
    ...cookieConfig,
    value: await generateToken(email),
  });
}
