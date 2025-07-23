"use client"

import { useRef } from "react"

import { useState } from "react"

import type React from "react"
import { useRouter } from "next/navigation"
import { MessagesSquare, Share } from "lucide-react"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/components/main-sidebar/utils/sidebar.utils"
import { BackButton } from "@/components/ui/button-back"
import { mockServices } from "@/services/mock-services"
import { ServicePageContent } from "@/components/service/service-page-content"
import {mockBookings} from "@/services/booking-data";

export default function ServicePage({ params }: { params: { id: string } }) {
  const { id } = params
  const [isAnimating] = useState(false)

  // Find the service by ID
  const service = mockServices.find((s) => s.id === id) || mockServices[0]
  const bookings = mockBookings

  return (
    <>
      <div className="mx-auto px-4 sm:px-6 py-8">
        {/* Service Page Content */}
        <ServicePageContent service={service} bookings={bookings}/>
      </div>
    </>
  )
}
