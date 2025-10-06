"use client"
import Link from "next/link"
import ListingForm from "@/components/forms/ListingForm"

export default function NewListingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-18">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Listing</h1>
          <p className="text-gray-600 mt-2">Share your item with the community</p>
        </div>

        <ListingForm />
      </div>
    </div>
  )
}