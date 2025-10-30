import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { authenticated } from "@/controllers/auth";
import { canEditProfile } from "@/lib/auth-helpers";
import { getProfileById } from "@/lib/profiles";
import ProfileForm from "@/components/forms/ProfileForm";

interface ProfileEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfileEditPage({ params }: ProfileEditPageProps) {
  const userEmail = await authenticated();

  if (!userEmail) {
    redirect("/login");
  }

  const { id } = await params;
  const profileId = Number(id);

  if (Number.isNaN(profileId)) {
    notFound();
  }

  // Check if user owns this profile
  const canEdit = await canEditProfile(profileId, userEmail);
  if (!canEdit) {
    redirect("/");
  }

  const profile = await getProfileById(profileId);

  if (!profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-10">
        <Link
          href={`/profile/${profileId}`}
          className="text-gray-600 hover:text-gray-900 mb-6 inline-block"
        >
          ← Back to profile
        </Link>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-2">
            Update your profile information
          </p>
        </div>

        <ProfileForm
          profileId={profileId}
          initialData={{
            username: profile.username,
            bio: profile.bio,
            avatar: profile.avatar,
          }}
        />
      </div>
    </div>
  );
}
