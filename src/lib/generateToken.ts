import { SignJWT, type JWTPayload } from "jose";

interface CustomJWTPayload extends JWTPayload {
  email: string;
}

export default async function generateToken(email: string): Promise<string> {
  const secretKey = process.env.TOKEN_SECRET;
  if (!secretKey) {
    throw new Error("TOKEN_SECRET is not defined in environment variables");
  }

  const secret = new TextEncoder().encode(secretKey);

  return await new SignJWT({ email } satisfies CustomJWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}
