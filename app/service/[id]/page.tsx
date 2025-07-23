"use client"

import { useState } from "react"

import type React from "react"
import { mockServices } from "@/services/mock-services"
import { ServicePageContent } from "@/components/service/service-page-content"
import {mockBookingSlots} from "@/services/booking-slot-data";

export default function ServicePage({ params }: { params: { id: string } }) {
  const { id } = params
  const [isAnimating] = useState(false)

  // Find the service by ID
  const service = mockServices.find((s) => s.id === id) || mockServices[0]
  const bookingSlots = mockBookingSlots

  return (
    <>
      <div className="mx-auto px-4 sm:px-6 py-8">
        {/* Service Page Content */}
        <ServicePageContent service={service} bookingSlots={bookingSlots}/>
      </div>
    </>
  )
}
