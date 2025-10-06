import ListingForm from "@/components/forms/ListingForm";
import Login from "@/components/login";
import { authenticated } from "@/controllers/auth";

export default async function NewListingPage() {
  const isAuthenticated = await authenticated();

  return isAuthenticated ? (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-30">
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
