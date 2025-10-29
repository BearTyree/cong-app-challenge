// Edge-safe R2 presigner (no Node APIs, works on Cloudflare Workers)

const requiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

// Build the R2 endpoint host from account id when constructing URLs

// --- Minimal AWS SigV4 (query) presign for S3-compatible R2 ---
const toHex = (buffer: ArrayBuffer): string =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

const utf8 = (s: string): Uint8Array => new TextEncoder().encode(s);

const sha256 = async (data: string | ArrayBuffer): Promise<ArrayBuffer> => {
  const bytes = typeof data === "string" ? utf8(data) : new Uint8Array(data);
  return crypto.subtle.digest("SHA-256", bytes as unknown as BufferSource);
};

const hmac = async (
  key: ArrayBuffer | string,
  data: string
): Promise<ArrayBuffer> => {
  const rawKey = typeof key === "string" ? utf8(key) : new Uint8Array(key);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    rawKey as unknown as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    utf8(data) as unknown as BufferSource
  );
};

const getSigningKey = async (
  secretAccessKey: string,
  dateStamp: string,
  region: string,
  service: string
): Promise<ArrayBuffer> => {
  const kDate = await hmac("AWS4" + secretAccessKey, dateStamp);
  const kRegion = await hmac(kDate, region);
  const kService = await hmac(kRegion, service);
  const kSigning = await hmac(kService, "aws4_request");
  return kSigning;
};

// Encode a single URI path segment per RFC 3986
const encodePath = (path: string): string =>
  path
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");

// Build a presigned URL for PUT using query auth (SigV4)
const presignPutObject = async (params: {
  accountId: string;
  bucket: string;
  key: string;
  accessKeyId: string;
  secretAccessKey: string;
  expiresIn: number; // seconds
}): Promise<string> => {
  const { accountId, bucket, key, accessKeyId, secretAccessKey, expiresIn } =
    params;
  const host = `${accountId}.r2.cloudflarestorage.com`;
  const region = "auto"; // R2 uses "auto" for SigV4 scope
  const service = "s3";
  const now = new Date();
  const amzDate = now
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z"); // YYYYMMDDTHHMMSSZ
  const dateStamp = amzDate.slice(0, 8); // YYYYMMDD

  const encodedPath = `/${encodeURIComponent(bucket)}/${encodePath(key)}`;

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;

  // Query params to sign (sorted later)
  const qp: Record<string, string> = {
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": `${accessKeyId}/${credentialScope}`,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": String(Math.min(Math.max(1, expiresIn), 604800)), // 1..7d
    "X-Amz-SignedHeaders": "host",
    // Not strictly required, but mirrors AWS SDK for clarity of intent
    "x-id": "PutObject",
  };

  const canonicalQuery = Object.keys(qp)
    .sort()
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(qp[k])}`)
    .join("&");

  const canonicalHeaders = `host:${host}\n`;
  const signedHeaders = "host";
  const payloadHash = "UNSIGNED-PAYLOAD";

  const canonicalRequest = [
    "PUT",
    encodedPath,
    canonicalQuery,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const hashedCanonicalRequest = toHex(await sha256(canonicalRequest));
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    hashedCanonicalRequest,
  ].join("\n");

  const signingKey = await getSigningKey(
    secretAccessKey,
    dateStamp,
    region,
    service
  );
  const signature = toHex(await hmac(signingKey, stringToSign));

  const finalQuery = `${canonicalQuery}&X-Amz-Signature=${signature}`;
  return `https://${host}${encodedPath}?${finalQuery}`;
};

interface PresignedUploadParams {
  key: string;
  contentType: string;
  contentLength: number;
  expiresIn?: number;
}

export interface PresignedUpload {
  key: string;
  uploadUrl: string;
  headers: Record<string, string>;
}

export const createPresignedUpload = async ({
  key,
  contentType,
  contentLength: _contentLength,
  expiresIn = 600,
}: PresignedUploadParams): Promise<PresignedUpload> => {
  // not used in query-signing; retained for API compatibility
  void _contentLength;
  // Build a presigned URL without Node-specific AWS SDK
  const accountId = requiredEnv("R2_ACCOUNT_ID");
  const accessKeyId = requiredEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = requiredEnv("R2_SECRET_ACCESS_KEY");
  const bucket = requiredEnv("R2_BUCKET_NAME");

  const uploadUrl = await presignPutObject({
    accountId,
    bucket,
    key,
    accessKeyId,
    secretAccessKey,
    expiresIn,
  });

  return {
    key,
    uploadUrl,
    headers: {
      "Content-Type": contentType,
    },
  };
};

export const getPublicObjectUrl = (key: string): string => {
  const baseUrl = requiredEnv("R2_PUBLIC_BASE_URL").replace(/\/+$/, "");
  return `${baseUrl}/${key}`;
};
