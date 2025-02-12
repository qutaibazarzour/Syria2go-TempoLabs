import React, { useState, useEffect } from "react";
import Header from "./Header";
import MobileNav from "./MobileNav";
import PropertyGrid from "./PropertyGrid";
import MapView from "./MapView";
import { Button } from "./ui/button";
import { Grid, Map } from "lucide-react";
import {
  fetchProperties,
  subscribeToProperties,
  toggleFavorite,
} from "@/services/properties";
import { PropertyWithImages } from "@/lib/types";

const Home = () => {
  const [view, setView] = useState<"list" | "map">("list");
  const [properties, setProperties] = useState<PropertyWithImages[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProperties()
      .then(setProperties)
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
  }, []);

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

  const ViewToggle = () => (
    <div className="fixed bottom-20 md:top-24 md:bottom-auto left-1/2 -translate-x-1/2 z-20 bg-white rounded-full shadow-lg border">
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header isMapSearchMode={view === "map"} />
        <MobileNav />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="animate-pulse text-gray-500">
            Loading properties...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header isMapSearchMode={view === "map"} />
      <MobileNav />

      {view === "list" ? (
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Featured Properties</h1>
          <PropertyGrid
            properties={properties}
            onFavoriteToggle={handleFavoriteToggle}
          />
        </main>
      ) : (
        <div className="h-[calc(100dvh-144px)] md:h-[calc(100vh-80px)]">
          <MapView properties={properties} />
        </div>
      )}

      <ViewToggle />
    </div>
  );
};

export default Home;
