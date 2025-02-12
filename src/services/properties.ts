import { supabase } from "@/lib/supabase";
import { PropertyWithImages } from "@/lib/types";

export const fetchProperties = async (filters?: {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  userId?: string;
}): Promise<PropertyWithImages[]> => {
  let query = supabase
    .from("properties")
    .select(
      `
      *,
      property_images (*)
    `,
    )
    .order("created_at", { ascending: false });

  if (filters?.location) {
    query = query.ilike("location", `%${filters.location}%`);
  }

  if (filters?.minPrice) {
    query = query.gte("price", filters.minPrice);
  }

  if (filters?.maxPrice) {
    query = query.lte("price", filters.maxPrice);
  }

  const { data: properties, error } = await query;

  if (error) {
    console.error("Error fetching properties:", error);
    return [];
  }

  // If we have a userId, fetch their favorites
  let favorites: string[] = [];
  if (filters?.userId) {
    const { data: favoritesData } = await supabase
      .from("favorites")
      .select("property_id")
      .eq("user_id", filters.userId);

    favorites = favoritesData?.map((f) => f.property_id) || [];
  }

  // Transform the data to match our PropertyWithImages type
  return (properties || []).map((property) => ({
    ...property,
    isFavorite: favorites.includes(property.id),
  }));
};

export const toggleFavorite = async (
  propertyId: string,
  userId: string,
  isFavorite: boolean,
) => {
  if (isFavorite) {
    // Remove favorite
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("property_id", propertyId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error removing favorite:", error);
      return false;
    }
  } else {
    // Add favorite
    const { error } = await supabase.from("favorites").insert({
      property_id: propertyId,
      user_id: userId,
    });

    if (error) {
      console.error("Error adding favorite:", error);
      return false;
    }
  }

  return true;
};

export const subscribeToProperties = (
  callback: (property: PropertyWithImages) => void,
) => {
  const subscription = supabase
    .channel("properties")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "properties",
      },
      (payload) => {
        // Fetch the complete property data including images
        fetchProperties({
          location: (payload.new as PropertyWithImages).location,
        }).then((properties) => {
          if (properties.length > 0) {
            callback(properties[0]);
          }
        });
      },
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
};
