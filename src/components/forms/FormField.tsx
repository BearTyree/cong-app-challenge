import { ReactNode } from "react"
import { FieldError } from "react-hook-form"

interface FormFieldProps {
  label: string
  error?: FieldError
  required?: boolean
  children: ReactNode
  className?: string
}

export default function FormField({
  label,
  error,
  required = false,
  children,
  className = ""
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error.message}</p>
      )}
    </div>
  )
}