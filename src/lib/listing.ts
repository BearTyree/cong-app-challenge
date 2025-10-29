import { z } from "zod"

// Constants
export const CATEGORIES = [
  { id: "electronics", label: "Electronics" },
  { id: "furniture", label: "Furniture" },
  { id: "clothing", label: "Clothing" },
  { id: "sports", label: "Sports Equipment" },
  { id: "books", label: "Books" },
  { id: "kitchen", label: "Kitchen" },
  { id: "toys", label: "Toys" },
  { id: "garden", label: "Garden" },
  { id: "tools", label: "Tools" },
  { id: "other", label: "Other" }
] as const

export const CONDITIONS = [
  { value: "new", label: "New", description: "Brand new, never used" },
  { value: "like-new", label: "Like New", description: "Barely used, excellent condition" },
  { value: "gently-used", label: "Gently Used", description: "Used with care, minor wear" },
  { value: "used", label: "Used", description: "Normal wear and tear" },
  { value: "well-worn", label: "Well Worn", description: "Significant use but functional" }
] as const

export const WEEKDAYS = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" }
] as const

export const FORM_LIMITS = {
  maxImages: 5,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  acceptedImageTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"]
}

// Types
export type Category = typeof CATEGORIES[number]["id"]
export type Condition = typeof CONDITIONS[number]["value"]
export type WeekDay = typeof WEEKDAYS[number]["value"]

// Validation schemas
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/

export const listingSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),

  category: z.enum(
    CATEGORIES.map(c => c.id) as [Category, ...Category[]]
  ).describe("Please select a category"),

  condition: z.enum(
    CONDITIONS.map(c => c.value) as [Condition, ...Condition[]]
  ).describe("Please select a condition"),

  description: z.string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must be less than 1000 characters"),

  images: z.array(z.instanceof(File))
    .min(1, "At least one image is required")
    .max(FORM_LIMITS.maxImages, `Maximum ${FORM_LIMITS.maxImages} images allowed`)
    .refine(
      files => files.every(file => file.size <= FORM_LIMITS.maxFileSize),
      "Each image must be less than 5MB"
    )
    .refine(
      files => files.every(file => FORM_LIMITS.acceptedImageTypes.includes(file.type)),
      "Only JPG, PNG, and WebP images are allowed"
    ),

  pickupAddress: z.string()
    .min(10, "Please enter a valid pickup address"),

  pickupInstructions: z.string()
    .max(500, "Instructions must be less than 500 characters")
    .optional(),
  availabilityDays: z.array(
    z.enum(WEEKDAYS.map(d => d.value) as [WeekDay, ...WeekDay[]])
  ).min(1, "Please select at least one day"),

  availabilityTimeStart: z.string()
    .regex(timeRegex, "Please enter a valid time (HH:MM)"),

  availabilityTimeEnd: z.string()
    .regex(timeRegex, "Please enter a valid time (HH:MM)")
}).refine(
  data => {
    const start = data.availabilityTimeStart.split(":").map(Number)
    const end = data.availabilityTimeEnd.split(":").map(Number)
    const startMinutes = start[0] * 60 + start[1]
    const endMinutes = end[0] * 60 + end[1]
    return endMinutes > startMinutes
  },
  {
    message: "End time must be after start time",
    path: ["availabilityTimeEnd"]
  }
)

export type ListingFormData = z.infer<typeof listingSchema>

// Utility functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
}

export const validateImageFile = (file: File): boolean => {
  return file.size <= FORM_LIMITS.maxFileSize &&
         FORM_LIMITS.acceptedImageTypes.includes(file.type)
}

export const generatePreviewUrl = (file: File): string => {
  return URL.createObjectURL(file)
}

export const formatAvailability = (days: WeekDay[], startTime: string, endTime: string): string => {
  const dayLabels = days.map(day =>
    WEEKDAYS.find(d => d.value === day)?.label || day
  ).join(", ")
  return `${dayLabels} from ${startTime} to ${endTime}`
}

//Should not be neeeded to be done via index but via text.
export const getCategoryLabel = (categoryId: string): string => {
  return CATEGORIES.find((category) => category.id === categoryId)?.label ?? categoryId
}

export const getConditionLabel = (conditionValue: string): string => {
  return CONDITIONS.find((condition) => condition.value === conditionValue)?.label ?? conditionValue
}
