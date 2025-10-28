import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { createPresignedUpload, getPublicObjectUrl } from "@/lib/r2";
import { FORM_LIMITS } from "@/lib/listing";
import { authenticated } from "@/controllers/auth";

const fileSchema = z.object({
  size: z.number().int().positive(),
  type: z.string(),
  index: z.number().int().nonnegative(),
});

const presignRequestSchema = z.object({
  files: z
    .array(fileSchema)
    .min(1, "At least one file must be provided")
    .max(FORM_LIMITS.maxImages),
  prefix: z
    .string()
    .max(64)
    .regex(/^[a-zA-Z0-9/_-]*$/, "Prefix may only contain URL-safe characters")
    .optional(),
});

const ACCEPTED_TYPES = new Set(FORM_LIMITS.acceptedImageTypes);

const getFileExtension = (mime: string): string => {
  switch (mime) {
    case "image/jpeg":
    case "image/jpg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    default:
      throw new Error(`Unsupported MIME type ${mime}`);
  }
};

export async function POST(request: NextRequest) {
  const username = await authenticated();

  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parseResult = presignRequestSchema.safeParse(payload);

  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Validation error", details: parseResult.error.format() },
      { status: 400 }
    );
  }

  const { files, prefix } = parseResult.data;

  for (const file of files) {
    if (file.size > FORM_LIMITS.maxFileSize) {
      return NextResponse.json(
        {
          error: "File size exceeds limit",
          details: { index: file.index, maxSize: FORM_LIMITS.maxFileSize },
        },
        { status: 400 }
      );
    }

    if (!ACCEPTED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          error: "Unsupported file type",
          details: { index: file.index, type: file.type },
        },
        { status: 400 }
      );
    }
  }

  const uploads = await Promise.all(
    files.map(async (file) => {
      const uuid = crypto.randomUUID();
      const key = `${prefix ? `${prefix.replace(/\/+$/, "")}/` : ""}${uuid}${getFileExtension(file.type)}`;
      const presigned = await createPresignedUpload({
        key,
        contentType: file.type,
        contentLength: file.size,
      });

      return {
        index: file.index,
        key: presigned.key,
        uploadUrl: presigned.uploadUrl,
        headers: presigned.headers,
        publicUrl: getPublicObjectUrl(presigned.key),
      };
    })
  );

  // Ensure uploads are sorted in the same order as incoming files
  uploads.sort((a, b) => a.index - b.index);

  return NextResponse.json({
    uploads,
  });
}
