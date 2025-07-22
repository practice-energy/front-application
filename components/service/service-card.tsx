"use client"

import { Clock, MapPin, SquareUserIcon, Video } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { RubleIcon } from "@/components/ui/ruble-sign"
import type { Service } from "@/types/common"

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  const mainImage = service.images[0]
  const thumbnails = service.images.slice(1, 4) // Show up to 3 thumbnails

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Black background photo section */}
      <div className="bg-black p-4 flex gap-4">
        {/* Main image */}
        <div className="flex-1">
          {mainImage ? (
            <img
              src={mainImage || "/placeholder.svg"}
              alt={service.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Нет фото</span>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {thumbnails.length > 0 && (
          <div className="flex flex-col gap-2 w-20">
            {thumbnails.map((image, index) => (
              <img
                key={index}
                src={image || "/placeholder.svg"}
                alt={`${service.title} ${index + 2}`}
                className="w-20 h-20 object-cover rounded-lg"
              />
            ))}
          </div>
        )}
      </div>

      {/* White background content section */}
      <div className="bg-white dark:bg-gray-800 p-6 space-y-4">
        {/* Title and price row */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex-1">{service.title}</h1>
          <div className="flex items-center text-lg font-bold text-gray-900 dark:text-gray-100">
            {service.price}
            <RubleIcon size={18} bold={true} className="mb-0.5 ml-1" />
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{service.description}</p>

        {/* Location */}
        {service.location && (
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPin className="h-5 w-5 mr-2" />
            <span>{service.location}</span>
          </div>
        )}

        {/* Tags row */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Duration tag */}
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{service.duration}</span>
          </Badge>

          {/* Format tag */}
          {service.format && (
            <Badge variant="outline" className="flex items-center gap-1 bg-violet-50 text-violet-600 border-violet-600">
              {service.format === "video" && (
                <>
                  <Video className="w-4 h-4" />
                  <span>Видео</span>
                </>
              )}
              {service.format === "in-person" && (
                <>
                  <SquareUserIcon className="w-4 h-4" />
                  <span>Лично</span>
                </>
              )}
            </Badge>
          )}

          {/* Practice tag */}
          <Badge variant="outline" className="flex items-center gap-1">
            <span>Практика</span>
          </Badge>
        </div>
      </div>
    </div>
  )
}
