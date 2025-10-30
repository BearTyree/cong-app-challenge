"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import FormField from "./FormField";
import ImagePreview from "./ImagePreview";
import {
  listingSchema,
  ListingFormData,
  CATEGORIES,
  CONDITIONS,
  FORM_LIMITS,
  validateImageFile,
} from "@/lib/listing";

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

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { autocomplete } from "@/lib/google";
import { PlaceData } from "@googlemaps/google-maps-services-js";

interface ListingFormProps {
  mode?: "create" | "edit";
  listingId?: number;
  initialData?: {
    title: string;
    category: string;
    condition: string;
    description: string;
    images: string[];
    pickupAddress: string;
    pickupInstructions: string | null;
  };
}

export default function ListingForm({
  mode = "create",
  listingId,
  initialData,
}: ListingFormProps) {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    initialData?.images ?? []
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
    reset,
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      category: initialData?.category as ListingFormData["category"],
      condition: initialData?.condition as ListingFormData["condition"],
      description: initialData?.description ?? "",
      pickupAddress: initialData?.pickupAddress ?? "",
      pickupInstructions: initialData?.pickupInstructions ?? "",
    },
  });

  const onSubmit = async (data: ListingFormData) => {
    setServerError(null);
    setSuccessMessage(null);
    setUploadProgress(0);

    // Validate that we have at least one image (new files OR existing images in edit mode)
    const hasNewImages = data.images && data.images.length > 0;
    const hasExistingImages = existingImages.length > 0;

    if (!hasNewImages && !hasExistingImages) {
      setServerError("Please add at least one image before submitting.");
      return;
    }

    // In create mode, images are required
    if (mode === "create" && !hasNewImages) {
      setServerError("Please add at least one image before submitting.");
      return;
    }

    try {
      let finalImageKeys: string[] = [...existingImages];

      // Only upload new images if any were selected
      if (data.images && data.images.length > 0) {
        const presignResponse = await fetch("/api/uploads/presign", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            files: data.images.map((file, index) => ({
              size: file.size,
              type: file.type,
              index,
            })),
          }),
        });

        if (!presignResponse.ok) {
          const errorBody = parseErrorPayload(
            await presignResponse.json().catch(() => ({}))
          );
          throw new Error(
            errorBody.error ??
              "Failed to request upload URLs. Please try again later."
          );
        }

        const presignData: PresignResponse = await presignResponse.json();

        const orderedUploads = presignData.uploads.sort(
          (a, b) => a.index - b.index
        );

        for (const [position, upload] of orderedUploads.entries()) {
          const file = data.images[upload.index];
          const uploadResult = await fetch(upload.uploadUrl, {
            method: "PUT",
            headers: upload.headers,
            body: file,
          });

          if (!uploadResult.ok) {
            throw new Error(
              `Upload failed for image ${upload.index + 1}. Please retry.`
            );
          }

          setUploadProgress(
            Math.round(((position + 1) / orderedUploads.length) * 100)
          );
        }

        // In edit mode, append new images to existing ones
        const newImageKeys = orderedUploads.map((upload) => upload.key);
        finalImageKeys = mode === "edit" ? [...existingImages, ...newImageKeys] : newImageKeys;
      }

      const apiUrl = mode === "edit" ? `/api/listings/${listingId}` : "/api/listings";
      const apiMethod = mode === "edit" ? "PUT" : "POST";

      const saveListingResponse = await fetch(apiUrl, {
        method: apiMethod,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          category: data.category,
          condition: data.condition,
          description: data.description,
          images: finalImageKeys,
          pickupAddress: data.pickupAddress,
          pickupInstructions: data.pickupInstructions ?? "",
        }),
      });

      if (!saveListingResponse.ok) {
        const errorBody = parseErrorPayload(
          await saveListingResponse.json().catch(() => ({}))
        );
        throw new Error(
          errorBody.error
            ? `${errorBody.error}${
                errorBody.details ? `: ${errorBody.details}` : ""
              }`
            : "Listing could not be saved. Please try again later."
        );
      }

      const listingResult: { id: number } =
        await saveListingResponse.json();

      setSuccessMessage(
        mode === "edit" ? "Listing updated successfully." : "Listing created successfully."
      );

      if (mode === "create") {
        reset();
        setImageFiles([]);
        setValue("images", [], { shouldValidate: true });
      }
      setUploadProgress(0);

      const targetId = mode === "edit" ? listingId : listingResult.id;
      if (targetId) {
        router.push(`/listing/${targetId}`);
      }
    } catch (error) {
      console.error("Listing submission failed", error);
      setUploadProgress(0);
      setServerError(
        error instanceof Error
          ? error.message
          : "Something went wrong while submitting the listing."
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(validateImageFile);

    if (validFiles.length !== files.length) {
      alert("Some files were invalid and not added");
    }

    const newFiles = [...imageFiles, ...validFiles].slice(
      0,
      FORM_LIMITS.maxImages
    );
    setImageFiles(newFiles);
    setValue("images", newFiles, { shouldValidate: true });
  };

  const removeImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setValue("images", newFiles, { shouldValidate: true });
  };

  const removeExistingImage = (index: number) => {
    const newExisting = existingImages.filter((_, i) => i !== index);
    setExistingImages(newExisting);
  };

  const [predictions, setPredictions] = useState<PlaceData[]>([]);
  const [input, setInput] = useState(initialData?.pickupAddress ?? "");

  useEffect(() => {
    const fetchPredictions = async () => {
      const predictions = await autocomplete(input);
      setPredictions(predictions as PlaceData[]);
    };
    fetchPredictions();
    // Sync input state with form state
    setValue("pickupAddress", input, { shouldValidate: true });
  }, [input, setValue]);

  useEffect(() => {
    console.log(predictions);
  }, [predictions])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Item Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Title" error={errors.title} required>
            <input
              {...register("title")}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9bc27d] focus:border-[#78A75A]"
              placeholder="e.g., Wilson Tennis Racket"
            />
          </FormField>

          <FormField label="Category" error={errors.category} required>
            <select
              {...register("category")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9bc27d] focus:border-[#78A75A]"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Condition"
            error={errors.condition}
            required
            className="md:col-span-2"
          >
            <select
              {...register("condition")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9bc27d] focus:border-[#78A75A]"
            >
              <option value="">Select condition</option>
              {CONDITIONS.map((cond) => (
                <option key={cond.value} value={cond.value}>
                  {cond.label} - {cond.description}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Description"
            error={errors.description}
            required
            className="md:col-span-2"
          >
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9bc27d] focus:border-[#78A75A]"
              placeholder="Describe your item in detail..."
            />
          </FormField>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>

        <FormField
          label={mode === "edit" ? "Upload New Images (optional)" : "Upload Images"}
          error={
            errors.images
              ? { message: errors.images.message, type: "required" }
            : undefined
          }
          required={mode === "create"}
        >
          <input
            type="file"
            multiple
            accept={FORM_LIMITS.acceptedImageTypes.join(",")}
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9bc27d] focus:border-[#78A75A] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#e8f5e9] file:text-[#2e5a1f] hover:file:bg-[#c8e6c9]"
          />
          <p className="text-xs text-gray-500 mt-1">
            JPG, PNG or WebP. Max {FORM_LIMITS.maxImages} images,{" "}
            {FORM_LIMITS.maxFileSize / 1024 / 1024}MB each
            {mode === "edit" && existingImages.length > 0 && (
              <> • You can keep existing images or upload new ones</>
            )}
          </p>
        </FormField>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <p className="text-sm text-gray-600 mt-2">
            Uploading images... {uploadProgress}%
          </p>
        )}
        {serverError && (
          <p className="text-sm text-red-600 mt-2">{serverError}</p>
        )}
        {successMessage && (
          <p className="text-sm text-green-600 mt-2">{successMessage}</p>
        )}

        {/* Display existing images in edit mode */}
        {mode === "edit" && existingImages.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Current Images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {existingImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={imageUrl}
                      alt={`Existing ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized={imageUrl.startsWith("http")}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Display new image files */}
        {imageFiles.length > 0 && (
          <div className="mt-4">
            {mode === "edit" && <h3 className="text-sm font-medium text-gray-700 mb-2">New Images</h3>}
            <ImagePreview
              files={imageFiles}
              onRemove={removeImage}
              maxImages={FORM_LIMITS.maxImages}
            />
          </div>
        )}

        {/* Show empty state only if no existing images and no new files */}
        {mode === "edit" && existingImages.length === 0 && imageFiles.length === 0 && (
          <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-gray-500 text-sm">No images selected</p>
            <p className="text-gray-400 text-xs mt-1">Maximum {FORM_LIMITS.maxImages} images</p>
          </div>
        )}

        {mode === "create" && imageFiles.length === 0 && (
          <div className="mt-4">
            <ImagePreview
              files={imageFiles}
              onRemove={removeImage}
              maxImages={FORM_LIMITS.maxImages}
            />
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Pickup Information
        </h2>

        <div className="space-y-4">
          <FormField
            label="Pickup Address"
            error={errors.pickupAddress}
            required
          >
            <Command>
              <CommandInput
                className="w-full px-3 py-2"
                placeholder="123 Main Street, City"
                value={input}
                onValueChange={setInput}
              />
              <CommandList>
                <CommandGroup>
                  {predictions.map((prediction) => (
                    <CommandItem key={prediction.place_id} className="cursor-pointer" onSelect={()=>setInput(prediction.formatted_address)}>
                      {prediction.formatted_address}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </FormField>

          <FormField
            label="Pickup Instructions"
            error={errors.pickupInstructions}
          >
            <textarea
              {...register("pickupInstructions")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9bc27d] focus:border-[#78A75A]"
              placeholder="e.g., Please text 30 minutes before arrival"
            />
          </FormField>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-[#78A75A] text-white rounded-lg hover:bg-[#638b4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? mode === "edit"
              ? "Updating..."
              : "Submitting..."
            : mode === "edit"
              ? "Update Listing"
              : "Create Listing"}
        </button>
      </div>
    </form>
  );
}
