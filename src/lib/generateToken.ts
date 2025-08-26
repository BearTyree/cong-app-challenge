import { SignJWT, type JWTPayload } from "jose";

interface CustomJWTPayload extends JWTPayload {
  username: string;
}

export default async function generateToken(username: string): Promise<string> {
  const secretKey = process.env.TOKEN_SECRET;

  if (!secretKey) {
    throw new Error("TOKEN_SECRET is not defined in environment variables");
  }

  const secret = new TextEncoder().encode(secretKey);
  const alg = "HS256";

  const payload: CustomJWTPayload = { username };

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setExpirationTime("2h")
    .sign(secret);

  return jwt;
}
