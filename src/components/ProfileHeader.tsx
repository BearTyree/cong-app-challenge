import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  profileId: number;
  username: string;
  bio: string | null;
  avatar: string | null;
  isOwnProfile: boolean;
}

export default function ProfileHeader({
  profileId,
  username,
  bio,
  avatar,
  isOwnProfile,
}: ProfileHeaderProps) {
  // Get first letter of username for fallback avatar
  const fallbackInitial = username.charAt(0).toUpperCase();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatar ?? undefined} alt={username} />
          <AvatarFallback className="text-2xl bg-[#9bc27d] text-white">
            {fallbackInitial}
          </AvatarFallback>
        </Avatar>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2 gap-4">
            <h1 className="text-3xl font-bold text-gray-900 break-words overflow-wrap-anywhere min-w-0">{username}</h1>
            {isOwnProfile && (
              <Link href={`/profile/${profileId}/edit`} className="flex-shrink-0">
                <Button
                  className="bg-[#78A75A] hover:bg-[#638b4a] text-white"
                >
                  Edit Profile
                </Button>
              </Link>
            )}
          </div>
          {bio && (
            <p className="text-gray-700 max-w-2xl break-words overflow-wrap-anywhere">{bio}</p>
          )}
          {!bio && isOwnProfile && (
            <p className="text-gray-400 italic">Add a bio to tell others about yourself</p>
          )}
        </div>
      </div>
    </div>
  );
}
