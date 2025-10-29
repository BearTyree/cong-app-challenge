import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const requiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const endpointFromAccount = (accountId: string) =>
  `https://${accountId}.r2.cloudflarestorage.com`;

let client: S3Client | null = null;

export const getR2Client = (): S3Client => {
  if (client) {
    return client;
  }

  const accountId = requiredEnv("R2_ACCOUNT_ID");
  const accessKeyId = requiredEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = requiredEnv("R2_SECRET_ACCESS_KEY");

  client = new S3Client({
    region: "auto",
    endpoint: endpointFromAccount(accountId),
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return client;
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
  contentLength,
  expiresIn = 600,
}: PresignedUploadParams): Promise<PresignedUpload> => {
  const client = getR2Client();
  const bucket = requiredEnv("R2_BUCKET_NAME");

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    ContentLength: contentLength,
    Metadata: {
      "expected-size": String(contentLength),
      "uploaded-at": new Date().toISOString(),
    },
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn });

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
