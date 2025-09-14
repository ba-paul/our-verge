import { Heart, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  price: number;
  rating: number;
  reviewCount: number;
  isSuperhost?: boolean;
}

export function PropertyCard({
  title,
  location,
  imageUrl,
  price,
  rating,
  reviewCount,
  isSuperhost = false,
}: PropertyCardProps) {
  return (
    <div className="group cursor-pointer">
      {/* Image */}
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-3 right-3 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors">
          <Heart className="h-4 w-4 text-white" />
        </button>
        {isSuperhost && (
          <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full text-xs">
            Superhost
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1">
        {/* Location and Rating */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm truncate pr-2">{location}</h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="h-3 w-3 fill-current" />
            <span className="text-xs">{rating}</span>
            <span className="text-xs text-gray-500">({reviewCount})</span>
          </div>
        </div>

        {/* Title */}
        <p className="text-gray-500 text-sm truncate">{title}</p>

        {/* Price */}
        <div className="text-sm">
          <span className="font-semibold">${price}</span>
          <span className="text-gray-500"> night</span>
        </div>
      </div>
    </div>
  );
}