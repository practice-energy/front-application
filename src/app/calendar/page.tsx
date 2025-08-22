"use client"

import { AdeptCalendar } from "@/src/components/adept-calendar"
import { mockBookings } from "@/src/services/mock-bookings"
import { useIsMobile } from "@/src/hooks/use-mobile"
import {useProfileStore} from "@/src/stores/profile-store";
import {useAuth} from "@/src/hooks/use-auth";
import {useRouter} from "next/navigation";

export default function CalendarPage() {
  const isMobile = useIsMobile()
  const { user } = useProfileStore()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  if (!isAuthenticated) {
      router.push("/")
  }

  return (
    <div className={isMobile ? "h-screen overflow-hidden" : "h-screen overflow-hidden top-0"}>
        {user?.hat === "adept" && (<AdeptCalendar bookings={mockBookings} timezone="GMT+3" />)}
        {user?.hat === "master" && (<AdeptCalendar bookings={mockBookings} timezone="GMT+3" />)}
    </div>
  )
}
