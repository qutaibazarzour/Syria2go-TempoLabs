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
  username?: string;
  photo_url?: string;
  about_intro?: string;
  languages?: string[];
  legal_name?: string;
  phone?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;
};
