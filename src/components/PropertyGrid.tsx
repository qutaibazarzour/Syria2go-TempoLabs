import React from "react";
import PropertyCard from "./PropertyCard";

interface Property {
  id: string;
  images: string[];
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  isFavorite: boolean;
}

interface PropertyGridProps {
  properties?: Property[];
  onFavoriteToggle?: (propertyId: string) => void;
}

const PropertyGrid = ({
  properties = [
    {
      id: "1",
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60",
      ],
      title: "Mountain View Cabin",
      location: "Aspen, Colorado",
      price: 299,
      rating: 4.9,
      reviews: 156,
      isFavorite: false,
    },
    {
      id: "2",
      images: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&auto=format&fit=crop&q=60",
      ],
      title: "Beachfront Villa",
      location: "Malibu, California",
      price: 599,
      rating: 4.8,
      reviews: 203,
      isFavorite: true,
    },
    {
      id: "3",
      images: [
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1600566753104-685f4f24cb4d?w=800&auto=format&fit=crop&q=60",
      ],
      title: "Downtown Loft",
      location: "New York City, NY",
      price: 399,
      rating: 4.7,
      reviews: 178,
      isFavorite: false,
    },
  ],
  onFavoriteToggle = () => {},
}: PropertyGridProps) => {
  return (
    <div className="w-full min-h-screen bg-gray-50 p-6 pb-24 md:pb-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="flex justify-center">
              <PropertyCard
                images={property.images}
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
