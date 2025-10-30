import { cookies } from "next/headers";
import { jwtVerify, type JWTPayload } from "jose";

interface CustomJWTPayload extends JWTPayload {
  email?: string;
}

export async function authenticated(): Promise<string | false> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return false;
  }

  const secretKey = process.env.TOKEN_SECRET;
  if (!secretKey) {
    console.error("TOKEN_SECRET is not defined in environment variables");
    return false;
  }
  const secret = new TextEncoder().encode(secretKey);

  try {
    const { payload } = await jwtVerify<CustomJWTPayload>(token, secret);
    return payload.email || false;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return false;
  }
}
