import React, { useState } from "react";
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

  // Example properties - in a real app, these would be filtered based on search params
  const properties = [
    {
      id: "1",
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60",
      ],
      title: "Historic Damascus Villa",
      location: "Damascus, Syria",
      price: 150,
      rating: 4.9,
      reviews: 156,
      isFavorite: false,
      lat: 33.5138,
      lng: 36.2765,
    },
    {
      id: "2",
      images: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&auto=format&fit=crop&q=60",
      ],
      title: "Aleppo Heritage House",
      location: "Aleppo, Syria",
      price: 120,
      rating: 4.8,
      reviews: 203,
      isFavorite: true,
      lat: 36.2021,
      lng: 37.1343,
    },
    {
      id: "3",
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60",
      ],
      title: "Latakia Beach Resort",
      location: "Latakia, Syria",
      price: 180,
      rating: 4.7,
      reviews: 178,
      isFavorite: false,
      lat: 35.5317,
      lng: 35.7915,
    },
    {
      id: "4",
      images: [
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop&q=60",
      ],
      title: "Palmyra Desert Lodge",
      location: "Palmyra, Syria",
      price: 90,
      rating: 4.6,
      reviews: 145,
      isFavorite: false,
      lat: 34.5682,
      lng: 38.2841,
    },
    {
      id: "5",
      images: [
        "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&auto=format&fit=crop&q=60",
      ],
      title: "Tartus Seafront Apartment",
      location: "Tartus, Syria",
      price: 140,
      rating: 4.8,
      reviews: 167,
      isFavorite: true,
      lat: 34.8959,
      lng: 35.8867,
    },
    {
      id: "6",
      images: [
        "https://images.unsplash.com/photo-1574739782594-db4ead022697?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1574739782594-db4ead022697?w=800&auto=format&fit=crop&q=60",
      ],
      title: "Hama River View Suite",
      location: "Hama, Syria",
      price: 110,
      rating: 4.7,
      reviews: 134,
      isFavorite: false,
      lat: 35.1318,
      lng: 36.7518,
    },
    {
      id: "7",
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60",
      ],
      title: "Idlib Traditional Home",
      location: "Idlib, Syria",
      price: 95,
      rating: 4.6,
      reviews: 112,
      isFavorite: false,
      lat: 35.9306,
      lng: 36.6339,
    },
    {
      id: "8",
      images: [
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop&q=60",
      ],
      title: "Damascus Old City Apartment",
      location: "Damascus, Syria",
      price: 135,
      rating: 4.9,
      reviews: 189,
      isFavorite: true,
      lat: 33.5138,
      lng: 36.2765,
    },
    {
      id: "9",
      images: [
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=60",
      ],
      title: "Aleppo Citadel View",
      location: "Aleppo, Syria",
      price: 160,
      rating: 4.7,
      reviews: 145,
      isFavorite: false,
      lat: 36.2021,
      lng: 37.1343,
    },
    {
      id: "10",
      images: [
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&auto=format&fit=crop&q=60",
      ],
      title: "Latakia Coastal Villa",
      location: "Latakia, Syria",
      price: 200,
      rating: 4.8,
      reviews: 167,
      isFavorite: true,
      lat: 35.5317,
      lng: 35.7915,
    },
  ];

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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <MobileNav />

      {/* Mobile view */}
      <div className="md:hidden">
        {view === "list" ? (
          <PropertyGrid
            properties={properties}
            onFavoriteToggle={(id) => {
              console.log(`Toggle favorite for property ${id}`);
            }}
          />
        ) : (
          <div className="h-[calc(100vh-180px)]">
            <MapView
              properties={properties}
              center={{ lat: 33.5138, lng: 36.2765 }}
              zoom={12}
            />
          </div>
        )}
        <MobileViewToggle />
      </div>

      {/* Desktop split view */}
      <div className="hidden md:flex h-[calc(100vh-80px)]">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto px-4 py-6">
            <p className="text-muted-foreground mb-6">
              {properties.length} properties found
            </p>
            <div className="grid grid-cols-2 gap-6">
              {properties.map((property) => (
                <div key={property.id}>
                  <PropertyCard
                    images={property.images}
                    title={property.title}
                    location={property.location}
                    price={property.price}
                    rating={property.rating}
                    reviews={property.reviews}
                    isFavorite={property.isFavorite}
                    onFavoriteClick={() =>
                      console.log(`Toggle favorite for property ${property.id}`)
                    }
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
              center={{ lat: 33.5138, lng: 36.2765 }}
              zoom={12}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
