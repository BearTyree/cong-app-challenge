import { notFound } from "next/navigation";
import Link from "next/link";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileImageGrid from "@/components/ProfileImageGrid";
import Pagination from "@/components/listings/Pagination";
import { getProfileById, getProfileListings } from "@/lib/profiles";
import { getCurrentUserProfile } from "@/lib/auth-helpers";
import { authenticated } from "@/controllers/auth";
import { SortBy, SortOrder } from "@/lib/listings";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    page?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  const { id } = await params;
  const profileId = Number(id);

  if (Number.isNaN(profileId)) {
    notFound();
  }

  const profile = await getProfileById(profileId);

  if (!profile) {
    notFound();
  }

  // Check if this is the current user's profile
  const userEmail = await authenticated();
  let isOwnProfile = false;

  if (userEmail) {
    const currentUserProfile = await getCurrentUserProfile(userEmail);
    isOwnProfile = currentUserProfile?.id === profileId;
  }

  // Get pagination parameters
  const params_ = await searchParams;
  const currentPage = Number(params_?.page) || 1;
  const sortBy = (params_?.sortBy as SortBy) || "id";
  const sortOrder = (params_?.sortOrder as SortOrder) || "desc";

  // Fetch listings for pagination
  const { total, pageSize } = await getProfileListings(profileId, {
    page: currentPage,
    pageSize: 18,
    sortBy,
    sortOrder,
  });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 pt-20 space-y-8">
        <Link
          href="/"
          className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-2"
        >
          <span aria-hidden="true">←</span>
          Back to listings
        </Link>

        {/* Profile Header */}
        <ProfileHeader
          profileId={profile.id}
          username={profile.username}
          bio={profile.bio}
          avatar={profile.avatar}
          isOwnProfile={isOwnProfile}
        />

        {/* Listings Section */}
        <div className="w-full">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {isOwnProfile ? "Your Listings" : `${profile.username}'s Listings`}
          </h2>

          <ProfileImageGrid
            profileId={profileId}
            currentPage={currentPage}
            sortBy={sortBy}
            sortOrder={sortOrder}
            showMenu={isOwnProfile}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={total}
              pageSize={pageSize}
            />
          )}
        </div>
      </div>
    </div>
  );
}
