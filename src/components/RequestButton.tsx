"use client";

import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface RequestButtonProps {
  listingId: number;
}

export default function RequestButton({ listingId }: RequestButtonProps) {
  const [isRequested, setIsRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listingId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send request");
      }

      setIsRequested(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send request";
      setError(errorMessage);
      console.error("Error requesting item:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button
          onClick={handleRequest}
          disabled={isRequested || isLoading}
          className="flex-1 bg-[#9bc27d] hover:bg-[#78A75A] text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#9bc27d]"
        >
          {isLoading ? "Sending..." : isRequested ? "Request Sent" : "Request Item"}
        </button>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Request information"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p className="text-sm">
              Clicking this button notifies the lister&apos;s email and provides your email to the lister so that they may contact you.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      {error && (
        <p className="text-sm text-red-600 px-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
