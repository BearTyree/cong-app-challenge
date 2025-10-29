"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getDbAsync } from "@/lib/drizzle";
import hash from "@/lib/hash";
import generateToken from "@/lib/generateToken";
import { authenticated } from "@/controllers/auth";
import { usersTable } from "@/lib/schema";

export async function authenticate(
  _: void | null,
  formData: FormData
): Promise<void> {
  const cookieStore = await cookies();

  const db = await getDbAsync();

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return;
  }

  const user = await db.query.usersTable.findFirst({
    where: (users, { eq }) => eq(users.username, username),
  });

  if (!user) {
    return;
  }

  const salt = user.passwordSalt;

  const passwordHash = await hash(password + salt);

  if (passwordHash !== user.passwordHash) {
    return;
  }

  cookieStore.set({
    name: "token",
    value: await generateToken(username),
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 2, // 2 days
    path: "/",
  });

  redirect("/");
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete("token");

  redirect("/login");
}

export async function createUser(
  _: void | null,
  formData: FormData
): Promise<void> {
  const cookieStore = await cookies();

  const db = await getDbAsync();

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  console.log(username, password);

  if (!username || !password) {
    return;
  }

  const arrayBuffer = new Uint8Array(16);
  crypto.getRandomValues(arrayBuffer);
  const salt = Array.from(arrayBuffer, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");

  const passwordHash = await hash(password + salt);

  try {
    await db.insert(usersTable).values({
      username,
      passwordHash,
      passwordSalt: salt,
    });

    cookieStore.set({
      name: "token",
      value: await generateToken(username),
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 2, // 2 days
      path: "/",
    });
  } catch (error) {
    console.log(error);
    return;
  }
  redirect("/");
}

export async function checkToken(): Promise<void> {
  const cookieStore = await cookies();

  const username = await authenticated();

  if (!username) {
    cookieStore.delete("token");
    return;
  }

  cookieStore.set("token", await generateToken(username));
}
