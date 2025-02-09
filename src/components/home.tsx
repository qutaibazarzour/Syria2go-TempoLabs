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
    {
      id: "11",
      images: [
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop&q=60",
      ],
      title: "Homs City Center Suite",
      location: "Homs, Syria",
      price: 115,
      rating: 4.5,
      reviews: 98,
      isFavorite: false,
      lat: 34.7324,
      lng: 36.7137,
    },
    {
      id: "12",
      images: [
        "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800&auto=format&fit=crop&q=60",
      ],
      title: "Al-Hasakah Garden House",
      location: "Al-Hasakah, Syria",
      price: 85,
      rating: 4.4,
      reviews: 76,
      isFavorite: false,
      lat: 36.5024,
      lng: 40.7477,
    },
    {
      id: "13",
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60",
      ],
      title: "Deir ez-Zor Riverside",
      location: "Deir ez-Zor, Syria",
      price: 95,
      rating: 4.3,
      reviews: 82,
      isFavorite: false,
      lat: 35.3359,
      lng: 40.1408,
    },
    {
      id: "14",
      images: [
        "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&auto=format&fit=crop&q=60",
      ],
      title: "Raqqa Modern Apartment",
      location: "Raqqa, Syria",
      price: 105,
      rating: 4.5,
      reviews: 91,
      isFavorite: false,
      lat: 35.9528,
      lng: 39.0109,
    },
    {
      id: "15",
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60",
      ],
      title: "Tartus Beach House",
      location: "Tartus, Syria",
      price: 175,
      rating: 4.9,
      reviews: 203,
      isFavorite: true,
      lat: 34.8959,
      lng: 35.8867,
    },
    {
      id: "16",
      images: [
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=60",
      ],
      title: "Hama Historic Home",
      location: "Hama, Syria",
      price: 125,
      rating: 4.7,
      reviews: 156,
      isFavorite: false,
      lat: 35.1318,
      lng: 36.7518,
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
