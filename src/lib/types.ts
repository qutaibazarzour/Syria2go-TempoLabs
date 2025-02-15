import { Database } from "@/types/supabase";

export type Property = Database["public"]["Tables"]["properties"]["Row"];
export type PropertyImage =
  Database["public"]["Tables"]["property_images"]["Row"];
export type Favorite = Database["public"]["Tables"]["favorites"]["Row"];
export type UserVerification =
  Database["public"]["Tables"]["user_verifications"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];

export type PropertyWithImages = Property & {
  property_images: PropertyImage[];
  isFavorite?: boolean;
};

export type UserProfile = Database["public"]["Tables"]["users"]["Row"] & {
  verifications?: UserVerification;
  reviews?: Review[];
  properties?: PropertyWithImages[];
};
