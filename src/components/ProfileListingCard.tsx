"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

interface ProfileListingCardProps {
  id: number;
  title: string;
  imageSrc: string | null;
  condition: string;
  categoryLabel: string;
  showMenu?: boolean;
}

const isRemoteImage = (src: string) => /^https?:\/\//.test(src);

export default function ProfileListingCard({
  id,
  title,
  imageSrc,
  condition,
  categoryLabel,
  showMenu = false,
}: ProfileListingCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const resolvedSrc = imageSrc ?? "/window.svg";

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete listing");
      }

      // Refresh the page to show updated listings
      router.refresh();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert("Failed to delete listing. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="w-full mx-auto flex flex-col items-center relative group">
        {/* Three-dot menu (only shown when showMenu is true) */}
        {showMenu && (
          <div className="absolute top-2 right-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-all">
                <MoreVertical className="h-5 w-5 text-gray-700" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/listing/${id}/edit`}
                    className="flex items-center cursor-pointer"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="flex items-center cursor-pointer text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Listing card content */}
        <Link
          href={`/listing/${id}`}
          className="w-full flex flex-col items-center cursor-pointer"
        >
          <AspectRatio ratio={1 / 1} className="bg-muted rounded-lg">
            <Image
              src={resolvedSrc}
              alt={title}
              fill
              className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
              unoptimized={isRemoteImage(resolvedSrc)}
            />
          </AspectRatio>
          <h1 className="text-left w-full text-lg hover:underline">{title}</h1>
          <p className="text-left w-full text-sm text-gray-600">{condition}</p>
          <p className="text-left w-full text-xs uppercase tracking-wide text-gray-500">
            {categoryLabel}
          </p>
        </Link>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
