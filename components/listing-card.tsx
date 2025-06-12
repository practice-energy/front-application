"use client"

import { Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Listing {
  id: number
  image: string
  title: string
  location: string
  rating: number
  reviews: number
  price: number
  isNew: boolean
}

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Card className="group cursor-pointer border-0 shadow-none hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        {/* Image */}
        <div className="relative aspect-square rounded-xl overflow-hidden">
          <img
            src={listing.image || "/placeholder.svg"}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />

          {/* Heart button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 hover:bg-white hover:scale-110 transition-all duration-200"
          >
            <Heart className="h-4 w-4 text-gray-600" />
          </Button>

          {/* New badge */}
          {listing.isNew && <Badge className="absolute top-3 left-3 bg-white text-gray-900 hover:bg-white">New</Badge>}
        </div>

        {/* Content */}
        <div className="pt-3">
          {/* Location and Rating */}
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 truncate flex-1 mr-2">{listing.location}</h3>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-current text-gray-900" />
              <span className="text-sm font-medium text-gray-900">{listing.rating}</span>
            </div>
          </div>

          {/* Title */}
          <p className="text-gray-600 text-sm mb-1 line-clamp-1">{listing.title}</p>

          {/* Reviews */}
          <p className="text-gray-600 text-sm mb-2">{listing.reviews} reviews</p>

          {/* Price */}
          <div className="flex items-baseline space-x-1">
            <span className="font-semibold text-gray-900">${listing.price}</span>
            <span className="text-gray-600 text-sm">night</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
