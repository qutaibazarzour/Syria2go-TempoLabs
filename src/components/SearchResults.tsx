import React, { useState, useEffect } from "react";
import {
  fetchProperties,
  toggleFavorite,
  subscribeToProperties,
} from "@/services/properties";
import { PropertyWithImages } from "@/lib/types";
import { useSearchParams } from "react-router-dom";
import PropertyGrid from "./PropertyGrid";
import MapView from "./MapView";
import Header from "./Header";
import MobileNav from "./MobileNav";
import PropertyCard from "./PropertyCard";
import { Button } from "./ui/button";
import { Map, Grid } from "lucide-react";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<"list" | "map">("list");
  const [mapCenter, setMapCenter] = useState({ lat: 33.5138, lng: 36.2765 }); // Damascus
  const [mapZoom, setMapZoom] = useState(12);
  const [hasUserInteractedWithMap, setHasUserInteractedWithMap] =
    useState(false);
  const [isMapSearchMode, setIsMapSearchMode] = useState(false);
  const [visibleProperties, setVisibleProperties] = useState<
    PropertyWithImages[]
  >([]);

  const [properties, setProperties] = useState<PropertyWithImages[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const location = searchParams.get("location");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    setLoading(true);
    fetchProperties({
      location: location || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    })
      .then((props) => {
        setProperties(props);
        setVisibleProperties(props); // Initially all properties are visible
        // Update map center based on the first property's location
        if (props.length > 0) {
          setMapCenter({ lat: props[0].lat, lng: props[0].lng });
          setMapZoom(13); // Zoom in when showing search results
        } else if (location) {
          // If no properties found but location is set, center on Damascus as fallback
          setMapCenter({ lat: 33.5138, lng: 36.2765 });
          setMapZoom(10);
        }
      })
      .finally(() => setLoading(false));

    // Subscribe to real-time updates
    const unsubscribe = subscribeToProperties((newProperty) => {
      setProperties((current) => {
        const index = current.findIndex((p) => p.id === newProperty.id);
        if (index === -1) {
          return [...current, newProperty];
        }
        const updated = [...current];
        updated[index] = newProperty;
        return updated;
      });
    });

    return () => {
      unsubscribe();
    };
  }, [searchParams]);

  const handleFavoriteToggle = async (propertyId: string) => {
    // TODO: Add proper user authentication
    const userId = "test-user";
    const property = properties.find((p) => p.id === propertyId);
    if (!property) return;

    const success = await toggleFavorite(
      propertyId,
      userId,
      property.isFavorite || false,
    );
    if (success) {
      setProperties((current) =>
        current.map((p) =>
          p.id === propertyId ? { ...p, isFavorite: !p.isFavorite } : p,
        ),
      );
    }
  };

  const handleBoundsChanged = (bounds: google.maps.LatLngBounds) => {
    if (!hasUserInteractedWithMap) {
      setHasUserInteractedWithMap(true);
    }
    setIsMapSearchMode(true);
    const visible = properties.filter((property) => {
      return bounds.contains({
        lat: property.lat,
        lng: property.lng,
      });
    });
    setVisibleProperties(visible);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading properties...</div>
      </div>
    );
  }

  // Mobile view toggle
  const MobileViewToggle = () => (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-20 bg-white rounded-full shadow-lg border md:hidden">
      <div className="flex gap-1 p-1">
        <Button
          variant={view === "list" ? "default" : "ghost"}
          size="sm"
          onClick={() => setView("list")}
          className="rounded-full"
        >
          <Grid className="h-4 w-4 mr-2" />
          List
        </Button>
        <Button
          variant={view === "map" ? "default" : "ghost"}
          size="sm"
          onClick={() => setView("map")}
          className="rounded-full"
        >
          <Map className="h-4 w-4 mr-2" />
          Map
        </Button>
      </div>
    </div>
  );

  const displayedProperties = isMapSearchMode ? visibleProperties : properties;

  return (
    <div className="min-h-screen bg-white">
      <Header isMapSearchMode={hasUserInteractedWithMap && isMapSearchMode} />
      <MobileNav />

      {/* Mobile view */}
      <div className="md:hidden">
        {view === "list" ? (
          <PropertyGrid
            properties={displayedProperties}
            onFavoriteToggle={handleFavoriteToggle}
          />
        ) : (
          <div className="h-[calc(100vh-180px)]">
            <MapView
              properties={properties}
              center={mapCenter}
              zoom={mapZoom}
              onBoundsChanged={handleBoundsChanged}
            />
          </div>
        )}
        <MobileViewToggle />
      </div>

      {/* Desktop split view */}
      <div className="hidden md:flex h-[calc(100vh-80px)]">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                {displayedProperties.length} properties found
                {isMapSearchMode && " in this area"}
              </p>
              {isMapSearchMode && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsMapSearchMode(false);
                    setHasUserInteractedWithMap(false);
                    setVisibleProperties([]);
                  }}
                >
                  Clear map search
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-6">
              {displayedProperties.map((property) => (
                <div key={property.id}>
                  <PropertyCard
                    images={property.images}
                    title={property.title}
                    location={property.location}
                    price={property.price}
                    rating={property.rating}
                    reviews={property.reviews}
                    isFavorite={property.isFavorite}
                    onFavoriteClick={() => handleFavoriteToggle(property.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-[45%] xl:w-[50%] relative border-l">
          <div className="sticky top-0 h-[calc(100vh-80px)]">
            <MapView
              properties={properties}
              center={mapCenter}
              zoom={mapZoom}
              onBoundsChanged={handleBoundsChanged}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
