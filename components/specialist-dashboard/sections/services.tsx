"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { ClipboardPlus, Sparkles, GripVertical } from "lucide-react"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/components/main-sidebar/utils/sidebar.utils"
import { cn } from "@/lib/utils"
import { RubleIcon } from "@/components/ui/ruble-sign"
import { ClockIcon } from "@heroicons/react/24/outline"
import type { Service } from "@/types/common"
import {mockServices} from "@/services/mock-services";

interface ServiceCardProps {
  service: Service & { isActive?: boolean }
  onToggleActive: () => void
  onClick: () => void
}

function ServiceCard({ service, onToggleActive, onClick }: ServiceCardProps) {
  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleActive()
  }

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  return (
    <div className="w-full max-w-sm mx-auto group">
      <div
        className="bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-md dark:hover:shadow-lg transition-all duration-200 hover:border-gray-200 dark:hover:border-gray-600 relative"
        onClick={onClick}
      >
        {/* Drag Handle */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <GripVertical className="h-4 w-4 text-gray-400 cursor-grab active:cursor-grabbing" />
        </div>

        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={service.images[0] || "/placeholder.svg?height=320&width=320"}
            alt={service.title}
            className="w-full h-full object-cover"
          />

          {/* Active/Inactive overlay */}
          {!service.isActive && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Неактивно</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start">
            {/* Service Name */}
            <h3 className="font-bold text-lg text-gray-900 dark:text-white transition-colors duration-300 flex-1 pr-2">
              {truncateText(service.title, 50)}
            </h3>

            {/* Active/Inactive Toggle - Improved Style */}
            <Button
              type="button"
              size="sm"
              onClick={handleToggleClick}
              className={cn(
                "rounded-sm h-9 w-9 flex items-center justify-center transition-all duration-200 relative overflow-hidden",
                service.isActive
                  ? "bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600",
                "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2",
              )}
            >
              <Sparkles
                width={18}
                height={18}
                className={cn(
                  "transition-all duration-200",
                  service.isActive ? "text-white drop-shadow-sm" : "text-gray-500 dark:text-gray-400",
                )}
              />
              {service.isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 to-violet-600/20 animate-pulse" />
              )}
            </Button>
          </div>

          {/* Duration and Price */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>{service.duration}</span>
            </div>
            <div className="text-lg font-bold text-violet-600 dark:text-violet-400 transition-colors duration-300 flex items-center">
              <span>{service.price}</span>
              <RubleIcon size={18} bold={true} className="text-violet-700 dark:text-violet-400 ml-1" />
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed transition-colors duration-300">
            {truncateText(service.description, 80)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Services() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const [isAnimating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // State for services with active/inactive status and order
  const [services, setServices] = useState(mockServices.map((service) => ({ ...service, isActive: true })))

  // Toggle service active state
  const handleToggleService = (id: string) => {
    setServices((prevServices) =>
      prevServices.map((service) => (service.id === id ? { ...service, isActive: !service.isActive } : service)),
    )
  }

  // Handle service card click - navigate to service edit page
  const handleServiceCardClick = (service: Service) => {
    router.push(`/service-edit/${service.id}`)
  }

  // Handle adding a new service
  const handleAddService = () => {
    // Navigate to create new service page
    router.push("/service-edit/new")
  }

  // Handle reordering services
  const handleReorder = (newOrder: any[]) => {
    setServices(newOrder)
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Skeleton className="h-[300px] w-full rounded-sm" />
        <Skeleton className="h-[200px] w-full rounded-sm" />
        <Skeleton className="h-[250px] w-full rounded-sm" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div
        style={{
          transition: `all ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`,
        }}
        data-animating={isAnimating ? "true" : "false"}
      >
        {/* Services Grid with Drag and Drop */}
        <Reorder.Group
          axis="y"
          values={services}
          onReorder={handleReorder}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
        >
          <AnimatePresence>
            {services.map((service) => (
              <Reorder.Item
                key={service.id}
                value={service}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                whileDrag={{ scale: 1.05, zIndex: 10 }}
                className="cursor-grab active:cursor-grabbing"
              >
                <ServiceCard
                  service={service}
                  onToggleActive={() => handleToggleService(service.id)}
                  onClick={() => handleServiceCardClick(service)}
                />
              </Reorder.Item>
            ))}

            {/* Add New Service Card */}
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="border-2 border-dashed rounded-sm flex flex-col items-center justify-center border-gray-300 dark:border-gray-600 hover:border-violet-400 cursor-pointer min-h-[300px] transition-all duration-200 bg-white dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-900/10 group"
              onClick={handleAddService}
            >
              <div className="p-8 text-center">
                <ClipboardPlus className="h-12 w-12 text-gray-400 group-hover:text-violet-500 mb-4 mx-auto transition-colors duration-200" />
                <span className="text-gray-600 dark:text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 font-medium text-lg transition-colors duration-200">
                  Добавить новую услугу
                </span>
                <span className="text-gray-500 dark:text-gray-500 text-sm mt-2 block">
                  Создайте новую услугу для клиентов
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </Reorder.Group>
      </div>
    </main>
  )
}
