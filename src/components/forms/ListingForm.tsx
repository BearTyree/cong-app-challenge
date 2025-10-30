"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import FormField from "./FormField";
import ImagePreview from "./ImagePreview";
import {
  listingSchema,
  ListingFormData,
  CATEGORIES,
  CONDITIONS,
  WEEKDAYS,
  FORM_LIMITS,
  validateImageFile,
  WeekDay,
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

export default function ListingForm() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      availabilityDays: [],
      availabilityTimeStart: "",
      availabilityTimeEnd: "",
      pickupAddress: "",
      pickupInstructions: "",
    },
  });

  const selectedDays = watch("availabilityDays");

  const onSubmit = async (data: ListingFormData) => {
    setServerError(null);
    setSuccessMessage(null);
    setUploadProgress(0);

    if (!data.images?.length) {
      setServerError("Please add at least one image before submitting.");
      return;
    }

    try {
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

      const createListingResponse = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          category: data.category,
          condition: data.condition,
          description: data.description,
          images: orderedUploads.map((upload) => upload.key),
          pickupAddress: data.pickupAddress,
          pickupInstructions: data.pickupInstructions ?? "",
          availabilityDays: data.availabilityDays,
          availabilityTimeStart: data.availabilityTimeStart,
          availabilityTimeEnd: data.availabilityTimeEnd,
        }),
      });

      if (!createListingResponse.ok) {
        const errorBody = parseErrorPayload(
          await createListingResponse.json().catch(() => ({}))
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
        await createListingResponse.json();

      setSuccessMessage("Listing created successfully.");

      reset({
        availabilityDays: [],
        availabilityTimeStart: "",
        availabilityTimeEnd: "",
      });
      setImageFiles([]);
      setValue("images", [], { shouldValidate: true });
      setUploadProgress(0);

      if (listingResult?.id) {
        router.push(`/listing/${listingResult.id}`);
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

  const [predictions, setPredictions] = useState<PlaceData[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchPredictions = async () => {
      const predictions = await autocomplete(input);
      setPredictions(predictions as PlaceData[]);
    };
    fetchPredictions();
    
  }, [input]);

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
          label="Upload Images"
          error={
            errors.images
              ? { message: errors.images.message, type: "required" }
            : undefined
          }
          required
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

        <div className="mt-4">
          <ImagePreview
            files={imageFiles}
            onRemove={removeImage}
            maxImages={FORM_LIMITS.maxImages}
          />
        </div>
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
                {...register("pickupAddress")}
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
          {isSubmitting ? "Submitting..." : "Create Listing"}
        </button>
      </div>
    </form>
  );
}
