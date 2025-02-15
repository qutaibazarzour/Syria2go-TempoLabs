import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/lib/types";

export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserProfile>,
): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select(
      `
      *,
      verifications:user_verifications(*),
      reviews:reviews(reviewer_id, rating, comment, created_at),
      properties:properties(*)
    `,
    )
    .single();

  if (error) {
    console.error("Error updating user profile:", error);
    return null;
  }

  return data;
};
