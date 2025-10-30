"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import FormField from "./FormField";
import { FORM_LIMITS, validateImageFile } from "@/lib/listing";
import Image from "next/image";

const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters"),
  bio: z
    .string()
    .max(300, "Bio must be less than 300 characters")
    .optional()
    .or(z.literal("")),
  avatar: z.custom<File>().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  profileId: number;
  initialData?: {
    username: string;
    bio: string | null;
    avatar: string | null;
  };
}

type PresignedUpload = {
  index: number;
  key: string;
  uploadUrl: string;
  headers: Record<string, string>;
  publicUrl: string;
};

interface PresignResponse {
  uploads: PresignedUpload[];
}

type ErrorPayload = {
  error?: string;
  details?: string;
};

const parseErrorPayload = (payload: unknown): ErrorPayload => {
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    return {
      error: typeof record.error === "string" ? record.error : undefined,
      details: typeof record.details === "string" ? record.details : undefined,
    };
  }
  return {};
};

export default function ProfileForm({ profileId, initialData }: ProfileFormProps) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialData?.avatar ?? null
  );
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: initialData?.username ?? "",
      bio: initialData?.bio ?? "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setServerError(null);
    setSuccessMessage(null);
    setUploadProgress(0);

    try {
      let avatarKey: string | null = null;

      // Upload avatar if a new one was selected
      if (avatarFile) {
        const presignResponse = await fetch("/api/uploads/presign", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            files: [
              {
                size: avatarFile.size,
                type: avatarFile.type,
                index: 0,
              },
            ],
            prefix: "avatars",
          }),
        });

        if (!presignResponse.ok) {
          const errorBody = parseErrorPayload(
            await presignResponse.json().catch(() => ({}))
          );
          throw new Error(
            errorBody.error ?? "Failed to request upload URL. Please try again later."
          );
        }

        const presignData: PresignResponse = await presignResponse.json();
        const upload = presignData.uploads[0];

        const uploadResult = await fetch(upload.uploadUrl, {
          method: "PUT",
          headers: upload.headers,
          body: avatarFile,
        });

        if (!uploadResult.ok) {
          throw new Error("Upload failed for avatar. Please retry.");
        }

        avatarKey = upload.key;
        setUploadProgress(100);
      }

      // Update profile
      const updateProfileResponse = await fetch(`/api/profile/${profileId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          bio: data.bio && data.bio.length > 0 ? data.bio : null,
          ...(avatarKey && { avatar: avatarKey }),
        }),
      });

      if (!updateProfileResponse.ok) {
        const errorBody = parseErrorPayload(
          await updateProfileResponse.json().catch(() => ({}))
        );
        throw new Error(
          errorBody.error
            ? `${errorBody.error}${errorBody.details ? `: ${errorBody.details}` : ""}`
            : "Profile could not be updated. Please try again later."
        );
      }

      setSuccessMessage("Profile updated successfully.");
      setUploadProgress(0);

      // Redirect back to profile page
      setTimeout(() => {
        router.push(`/profile/${profileId}`);
      }, 1000);
    } catch (error) {
      console.error("Profile update failed", error);
      setUploadProgress(0);
      setServerError(
        error instanceof Error
          ? error.message
          : "Something went wrong while updating the profile."
      );
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateImageFile(file)) {
      setAvatarFile(file);
      setValue("avatar", file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert("Invalid file. Please upload a JPG, PNG, or WebP image.");
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(initialData?.avatar ?? null);
    setValue("avatar", undefined);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Profile Information
        </h2>

        <div className="space-y-4">
          <FormField label="Username" error={errors.username} required>
            <input
              {...register("username")}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9bc27d] focus:border-[#78A75A]"
              placeholder="Your username"
            />
          </FormField>

          <FormField label="Bio" error={errors.bio}>
            <textarea
              {...register("bio")}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9bc27d] focus:border-[#78A75A]"
              placeholder="Tell others about yourself..."
            />
          </FormField>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Profile Picture
        </h2>

        <FormField label="Upload Avatar" error={errors.avatar}>
          <input
            type="file"
            accept={FORM_LIMITS.acceptedImageTypes.join(",")}
            onChange={handleAvatarChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9bc27d] focus:border-[#78A75A] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#e8f5e9] file:text-[#2e5a1f] hover:file:bg-[#c8e6c9]"
          />
          <p className="text-xs text-gray-500 mt-1">
            JPG, PNG or WebP. Max {FORM_LIMITS.maxFileSize / 1024 / 1024}MB
          </p>
        </FormField>

        {avatarPreview && (
          <div className="mt-4">
            <div className="relative inline-block">
              <Image
                src={avatarPreview}
                alt="Avatar preview"
                width={120}
                height={120}
                className="rounded-full object-cover"
                unoptimized={avatarPreview.startsWith("http")}
              />
              <button
                type="button"
                onClick={removeAvatar}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {uploadProgress > 0 && uploadProgress < 100 && (
          <p className="text-sm text-gray-600 mt-2">
            Uploading... {uploadProgress}%
          </p>
        )}
        {serverError && (
          <p className="text-sm text-red-600 mt-2">{serverError}</p>
        )}
        {successMessage && (
          <p className="text-sm text-green-600 mt-2">{successMessage}</p>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.push(`/profile/${profileId}`)}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-[#78A75A] text-white rounded-lg hover:bg-[#638b4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
