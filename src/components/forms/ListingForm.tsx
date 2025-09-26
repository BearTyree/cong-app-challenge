"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import FormField from "./FormField"
import ImagePreview from "./ImagePreview"
import {
  listingSchema,
  ListingFormData,
  CATEGORIES,
  CONDITIONS,
  WEEKDAYS,
  FORM_LIMITS,
  validateImageFile,
  WeekDay
} from "@/lib/listing"

export default function ListingForm() {
  const [imageFiles, setImageFiles] = useState<File[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      availabilityDays: []
    }
  })

  const selectedDays = watch("availabilityDays")

  const onSubmit = (data: ListingFormData) => {
    console.log("Form submitted with data:", data)
    alert("Form validated successfully! Check console for data.")
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(validateImageFile)

    if (validFiles.length !== files.length) {
      alert("Some files were invalid and not added")
    }

    const newFiles = [...imageFiles, ...validFiles].slice(0, FORM_LIMITS.maxImages)
    setImageFiles(newFiles)
    setValue("images", newFiles, { shouldValidate: true })
  }

  const removeImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index)
    setImageFiles(newFiles)
    setValue("images", newFiles, { shouldValidate: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Item Details</h2>

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
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Condition" error={errors.condition} required className="md:col-span-2">
            <select
              {...register("condition")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9bc27d] focus:border-[#78A75A]"
            >
              <option value="">Select condition</option>
              {CONDITIONS.map(cond => (
                <option key={cond.value} value={cond.value}>
                  {cond.label} - {cond.description}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Description" error={errors.description} required className="md:col-span-2">
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

        <FormField label="Upload Images" error={errors.images ? { message: errors.images.message, type: 'required' } : undefined} required>
          <input
            type="file"
            multiple
            accept={FORM_LIMITS.acceptedImageTypes.join(",")}
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9bc27d] focus:border-[#78A75A] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#e8f5e9] file:text-[#2e5a1f] hover:file:bg-[#c8e6c9]"
          />
          <p className="text-xs text-gray-500 mt-1">
            JPG, PNG or WebP. Max {FORM_LIMITS.maxImages} images, {FORM_LIMITS.maxFileSize / 1024 / 1024}MB each
          </p>
        </FormField>

        <div className="mt-4">
          <ImagePreview
            files={imageFiles}
            onRemove={removeImage}
            maxImages={FORM_LIMITS.maxImages}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pickup Information</h2>

        <div className="space-y-4">
          <FormField label="Pickup Address" error={errors.pickupAddress} required>
            <input
              {...register("pickupAddress")}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9bc27d] focus:border-[#78A75A]"
              placeholder="123 Main Street, City"
            />
          </FormField>

          <FormField label="Pickup Instructions" error={errors.pickupInstructions}>
            <textarea
              {...register("pickupInstructions")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9bc27d] focus:border-[#78A75A]"
              placeholder="e.g., Please text 30 minutes before arrival"
            />
          </FormField>

          <FormField label="Available Days" error={errors.availabilityDays ? { message: errors.availabilityDays.message, type: 'required' } : undefined} required>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {WEEKDAYS.map(day => (
                <label key={day.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={day.value}
                    checked={selectedDays?.includes(day.value)}
                    onChange={(e) => {
                      const value = e.target.value as WeekDay
                      if (e.target.checked) {
                        setValue("availabilityDays", [...(selectedDays || []), value], { shouldValidate: true })
                      } else {
                        setValue("availabilityDays", selectedDays?.filter(d => d !== value) || [], { shouldValidate: true })
                      }
                    }}
                    className="rounded border-gray-300 text-[#78A75A] focus:ring-[#9bc27d]"
                  />
                  <span className="text-sm text-gray-700">{day.label}</span>
                </label>
              ))}
            </div>
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Available From" error={errors.availabilityTimeStart} required>
              <input
                {...register("availabilityTimeStart")}
                type="time"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9bc27d] focus:border-[#78A75A]"
              />
            </FormField>

            <FormField label="Available Until" error={errors.availabilityTimeEnd} required>
              <input
                {...register("availabilityTimeEnd")}
                type="time"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9bc27d] focus:border-[#78A75A]"
              />
            </FormField>
          </div>
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
  )
}