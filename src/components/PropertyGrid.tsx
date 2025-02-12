import React from "react";
import PropertyCard from "./PropertyCard";
import { PropertyWithImages } from "@/lib/types";

interface PropertyGridProps {
  properties?: PropertyWithImages[];
  onFavoriteToggle?: (propertyId: string) => void;
}

const PropertyGrid = ({
  properties = [],
  onFavoriteToggle = () => {},
}: PropertyGridProps) => {
  return (
    <div className="w-full min-h-screen bg-gray-50 p-6 pb-24 md:pb-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="flex justify-center">
              <PropertyCard
                images={property.property_images?.map((img) => img.url) || []}
                title={property.title}
                location={property.location}
                price={property.price}
                rating={property.rating}
                reviews={property.reviews}
                isFavorite={property.isFavorite}
                onFavoriteClick={() => onFavoriteToggle(property.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyGrid;
