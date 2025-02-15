import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/lib/types";

export const fetchUserProfile = async (
  userId: string,
): Promise<UserProfile | null> => {
  const { data: user, error: userError } = await supabase
    .from("users")
    .select(
      `
      *,
      verifications:user_verifications(*),
      reviews:reviews(reviewer_id, rating, comment, created_at),
      properties:properties(*)
    `,
    )
    .eq("id", userId)
    .single();

  if (userError) {
    console.error("Error fetching user profile:", userError);
    return null;
  }

  return user;
};

export const updateUserProfile = async (
  userId: string,
  updates: {
    username?: string;
    photo_url?: string;
    about_intro?: string;
    languages?: string[];
  },
): Promise<boolean> => {
  const { error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId);

  if (error) {
    console.error("Error updating user profile:", error);
    return false;
  }

  return true;
};

export const uploadProfilePhoto = async (
  userId: string,
  file: File,
): Promise<string | null> => {
  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}/profile.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("profile-photos")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error("Error uploading profile photo:", uploadError);
    return null;
  }

  const { data } = supabase.storage
    .from("profile-photos")
    .getPublicUrl(filePath);
  return data.publicUrl;
};
