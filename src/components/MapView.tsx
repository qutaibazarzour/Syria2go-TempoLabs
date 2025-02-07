import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { MapPin } from "lucide-react";
import PropertyCard from "./PropertyCard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface Property {
  id: string;
  lat: number;
  lng: number;
  price: number;
  title: string;
  location: string;
  images: string[];
  rating: number;
  reviews: number;
}

interface MapViewProps {
  properties?: Property[];
  onMarkerClick?: (property: Property) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
}

const MapView = ({
  properties = [
    {
      id: "1",
      lat: 40.014984,
      lng: -105.270546,
      price: 250,
      title: "Mountain View Cabin",
      location: "Boulder, Colorado",
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60",
      ],
      rating: 4.8,
      reviews: 124,
    },
    {
      id: "2",
      lat: 40.024984,
      lng: -105.280546,
      price: 175,
      title: "Downtown Loft",
      location: "Boulder, Colorado",
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60",
      ],
      rating: 4.5,
      reviews: 89,
    },
  ],
  onMarkerClick = () => {},
  center = { lat: 40.014984, lng: -105.270546 },
  zoom = 13,
}: MapViewProps) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );

  // Placeholder for map container
  return (
    <div className="w-full h-full relative bg-gray-100">
      {/* Map placeholder */}
      <div className="w-full h-full bg-gray-200 relative">
        {/* Simulated map markers */}
        {properties.map((property) => (
          <TooltipProvider key={property.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-white hover:bg-primary hover:text-white"
                  style={{
                    left: `${(property.lng - center.lng) * 1000 + 50}%`,
                    top: `${(property.lat - center.lat) * 1000 + 50}%`,
                  }}
                  onClick={() => {
                    setSelectedProperty(property);
                    onMarkerClick(property);
                  }}
                >
                  ${property.price}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{property.location}</span>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}

        {/* Property preview card */}
        {selectedProperty && (
          <Card className="absolute bottom-4 left-4 w-[320px] z-10">
            <PropertyCard
              title={selectedProperty.title}
              location={selectedProperty.location}
              price={selectedProperty.price}
              images={selectedProperty.images}
              rating={selectedProperty.rating}
              reviews={selectedProperty.reviews}
            />
          </Card>
        )}

        {/* Map controls placeholder */}
        <div className="absolute right-4 bottom-4 flex flex-col gap-2">
          <Button variant="outline" className="bg-white">
            +
          </Button>
          <Button variant="outline" className="bg-white">
            -
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapView;
