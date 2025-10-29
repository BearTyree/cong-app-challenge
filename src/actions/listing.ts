"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getDbAsync } from "@/lib/drizzle";
import hash from "@/lib/hash";
import generateToken from "@/lib/generateToken";
import { authenticated } from "@/controllers/auth";

export async function createListing(
  _: null,
  formData: FormData
): Promise<void> {
  const username = await authenticated();

  const db = await getDbAsync();

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
}
