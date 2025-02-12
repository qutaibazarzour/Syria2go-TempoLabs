import { Database } from "@/types/supabase";

export type Property = Database["public"]["Tables"]["properties"]["Row"];
export type PropertyImage =
  Database["public"]["Tables"]["property_images"]["Row"];
export type Favorite = Database["public"]["Tables"]["favorites"]["Row"];

export type PropertyWithImages = Property & {
  property_images: PropertyImage[];
  isFavorite?: boolean;
};
