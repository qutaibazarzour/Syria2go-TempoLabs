import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Heart, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

interface PropertyCardProps {
  images?: string[];
  title?: string;
  location?: string;
  price?: number;
  rating?: number;
  reviews?: number;
  isFavorite?: boolean;
  onFavoriteClick?: () => void;
}

const PropertyCard = ({
  images = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=60",
  ],
  title = "Cozy Mountain Retreat",
  location = "Boulder, Colorado",
  price = 250,
  rating = 4.8,
  reviews = 124,
  isFavorite = false,
  onFavoriteClick = () => {},
}: PropertyCardProps) => {
  return (
    <Card className="w-80 overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0 relative">
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="aspect-[4/3] relative">
                  <img
                    src={image}
                    alt={`Property view ${index + 1}`}
                    className="object-cover w-full h-full rounded-t-lg"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
          onClick={onFavoriteClick}
        >
          <Heart
            className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
          />
        </Button>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">{title}</h3>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{rating}</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-2">{location}</p>

          <div className="flex justify-between items-center">
            <div className="flex items-baseline gap-1">
              <span className="font-semibold">${price}</span>
              <span className="text-gray-600 text-sm">/ night</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {reviews} reviews
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
