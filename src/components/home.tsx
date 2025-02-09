import React, { useState } from "react";
import Header from "./Header";
import MobileNav from "./MobileNav";

import PropertyGrid from "./PropertyGrid";
import MapView from "./MapView";
import { Button } from "./ui/button";
import { Map, Grid } from "lucide-react";

interface HomeProps {
  initialView?: "grid" | "map";
}

const Home = ({ initialView = "grid" }: HomeProps) => {
  const [view, setView] = useState<"grid" | "map">(initialView);

  const properties = [
    {
      id: "1",
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60",
      ],
      title: "Luxury Mountain Cabin",
      location: "Aspen, Colorado",
      price: 399,
      rating: 4.9,
      reviews: 156,
      isFavorite: false,
      lat: 39.1911,
      lng: -106.8175,
    },
    {
      id: "2",
      images: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&auto=format&fit=crop&q=60",
      ],
      title: "Beachfront Paradise",
      location: "Malibu, California",
      price: 899,
      rating: 4.8,
      reviews: 203,
      isFavorite: true,
      lat: 34.0259,
      lng: -118.7798,
    },
    {
      id: "3",
      images: [
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1600566753104-685f4f24cb4d?w=800&auto=format&fit=crop&q=60",
      ],
      title: "Modern City Loft",
      location: "New York City, NY",
      price: 599,
      rating: 4.7,
      reviews: 178,
      isFavorite: false,
      lat: 40.7128,
      lng: -74.006,
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <Header />
      <MobileNav />

      {/* View Toggle */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Featured Properties</h2>
        <div className="flex gap-2">
          <Button
            variant={view === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "map" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("map")}
          >
            <Map className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8">
        {view === "grid" ? (
          <PropertyGrid
            properties={properties}
            onFavoriteToggle={(id) => {
              console.log(`Toggle favorite for property ${id}`);
            }}
          />
        ) : (
          <div className="h-[600px] rounded-lg overflow-hidden border">
            <MapView
              properties={properties}
              center={{ lat: 39.8283, lng: -98.5795 }} // Center of USA
              zoom={4}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
