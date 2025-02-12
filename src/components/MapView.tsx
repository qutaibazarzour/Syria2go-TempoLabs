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
import { PropertyWithImages } from "@/lib/types";

interface MapViewProps {
  properties?: PropertyWithImages[];
  onMarkerClick?: (property: PropertyWithImages) => void;
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
  properties = [],
  onMarkerClick = () => {},
  center = { lat: 33.5138, lng: 36.2765 }, // Damascus
  zoom = 13,
  onBoundsChanged = () => {},
}: MapViewProps) => {
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyWithImages | null>(null);

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
          let isDragging = false;
          let isZooming = false;

          // Track user interactions
          map.addListener("dragstart", () => {
            isDragging = true;
          });

          map.addListener("dragend", () => {
            isDragging = false;
            // Trigger bounds changed when drag ends
            const bounds = map.getBounds();
            if (bounds && onBoundsChanged) {
              onBoundsChanged(bounds);
            }
          });

          map.addListener("zoom_changed", () => {
            isZooming = true;
            // Trigger bounds changed when zoom ends
            setTimeout(() => {
              isZooming = false;
              const bounds = map.getBounds();
              if (bounds && onBoundsChanged) {
                onBoundsChanged(bounds);
              }
            }, 300);
          });

          map.addListener("idle", () => {
            // Update bounds when map becomes idle (after pan/zoom)
            const bounds = map.getBounds();
            if (bounds && onBoundsChanged) {
              onBoundsChanged(bounds);
            }
          });
        }

        // Update existing map's center and zoom
        if (mapInstanceRef.current) {
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
              text: `$${property.price}`,
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

            // Pan to the marker's position without changing zoom
            if (mapInstanceRef.current) {
              mapInstanceRef.current.panTo({
                lat: property.lat,
                lng: property.lng,
              });
            }
          });

          markersRef.current.push(marker);
        });

        // Only fit bounds on initial load when map instance is first created
        if (!mapInstanceRef.current && properties.length > 0) {
          const bounds = new google.maps.LatLngBounds();
          properties.forEach((property) => {
            bounds.extend({ lat: property.lat, lng: property.lng });
          });
          map.fitBounds(bounds);
        }
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
            images={
              selectedProperty.property_images?.map((img) => img.url) || []
            }
            title={selectedProperty.title}
            location={selectedProperty.location}
            price={selectedProperty.price}
            rating={selectedProperty.rating}
            reviews={selectedProperty.reviews}
            isFavorite={selectedProperty.isFavorite}
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
