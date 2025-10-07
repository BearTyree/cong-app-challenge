import ListingForm from "@/components/forms/ListingForm";
import Login from "@/components/login";
import { authenticated } from "@/controllers/auth";
import Link from "next/link";

export default async function NewListingPage() {
  const isAuthenticated = await authenticated();

  return isAuthenticated ? (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-10">
        <Link
          href="/"
          className="text-gray-600 hover:text-gray-900 mb-6 inline-block"
        >
          ← Back to listings
        </Link>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Listing
          </h1>
          <p className="text-gray-600 mt-2">
            Share your item with the community
          </p>
        </div>

        <ListingForm />
      </div>
    </div>
  ) : (
    <div className="w-screen flex h-screen justify-center items-center">
      <Login></Login>
    </div>
  );
}
