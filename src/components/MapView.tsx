import React, { useState, useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
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
  onBoundsChanged?: (bounds: google.maps.LatLngBounds) => void;
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
  console.error(
    "Google Maps API key is missing. Please check your environment variables.",
  );
}

const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: "weekly",
  libraries: ["places"],
});

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
  onBoundsChanged = () => {},
}: MapViewProps) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );

  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Load Google Maps API and initialize map
    loader
      .load()
      .then(() => {
        // Initialize map if it doesn't exist yet
        if (!mapInstanceRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center,
            zoom,
            disableDefaultUI: true,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          });
          mapInstanceRef.current = map;

          // Add click listener to map to close the card
          map.addListener("click", () => {
            setSelectedProperty(null);
          });

          // Add bounds changed listener
          let boundsChangeTimeout: NodeJS.Timeout;
          map.addListener("bounds_changed", () => {
            // Debounce the bounds changed event
            clearTimeout(boundsChangeTimeout);
            boundsChangeTimeout = setTimeout(() => {
              const bounds = map.getBounds();
              if (bounds && onBoundsChanged) {
                onBoundsChanged(bounds);
              }
            }, 500); // Wait for 500ms after the last bounds change
          });
        } else {
          // Update existing map's center and zoom
          mapInstanceRef.current.setCenter(center);
          mapInstanceRef.current.setZoom(zoom);
        }

        // Clear existing markers
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        // Create markers for each property
        properties.forEach((property) => {
          const marker = new google.maps.Marker({
            position: { lat: property.lat, lng: property.lng },
            map: mapInstanceRef.current,
            label: {
              text: `${property.price}`,
              className: "marker-label",
              color: "#000000",
              fontFamily: "system-ui",
              fontSize: "14px",
              fontWeight: "500",
            },
          });

          marker.addListener("click", (e: google.maps.MapMouseEvent) => {
            e.stop(); // Prevent the click from bubbling to the map
            setSelectedProperty(property);
            onMarkerClick(property);
          });

          markersRef.current.push(marker);
        });
      })
      .catch((error) => {
        console.error("Error loading Google Maps API:", error);
      });

    return () => {
      // Cleanup markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [properties, center, zoom]);

  return (
    <div className="w-full h-full relative bg-white">
      <div ref={mapRef} className="w-full h-full relative" />

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

      {/* Map controls */}
      <div className="absolute right-4 bottom-4 flex flex-col gap-2">
        <Button
          variant="outline"
          className="bg-white"
          onClick={() => {
            if (mapInstanceRef.current) {
              const zoom = mapInstanceRef.current.getZoom();
              mapInstanceRef.current.setZoom(zoom + 1);
            }
          }}
        >
          +
        </Button>
        <Button
          variant="outline"
          className="bg-white"
          onClick={() => {
            if (mapInstanceRef.current) {
              const zoom = mapInstanceRef.current.getZoom();
              mapInstanceRef.current.setZoom(zoom - 1);
            }
          }}
        >
          -
        </Button>
      </div>
    </div>
  );
};

export default MapView;
