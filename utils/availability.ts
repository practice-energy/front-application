export interface TimeSlot {
  start: string
  end: string
}

export interface DaySchedule {
  enabled: boolean
  slots: TimeSlot[]
}

export interface WeekSchedule {
  monday: DaySchedule
  tuesday: DaySchedule
  wednesday: DaySchedule
  thursday: DaySchedule
  friday: DaySchedule
  saturday: DaySchedule
  sunday: DaySchedule
}

export interface ExistingBooking {
  id: string
  date: string
  startTime: string
  endTime: string
  clientName: string
  service: string
  status: "confirmed" | "pending" | "cancelled"
}

// Mock specialist schedule - in real app this would come from database
export const mockSpecialistSchedule: WeekSchedule = {
  monday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
  tuesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
  wednesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
  thursday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
  friday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
  saturday: { enabled: false, slots: [] },
  sunday: { enabled: false, slots: [] },
}

// Mock existing bookings - in real app this would come from database
export const mockExistingBookings: ExistingBooking[] = [
  {
    id: "1",
    date: "2024-01-25",
    startTime: "10:00",
    endTime: "11:00",
    clientName: "John D.",
    service: "Life Coaching",
    status: "confirmed",
  },
  {
    id: "2",
    date: "2024-01-25",
    startTime: "14:00",
    endTime: "15:30",
    clientName: "Maria S.",
    service: "Astrology Reading",
    status: "confirmed",
  },
  {
    id: "3",
    date: "2024-01-26",
    startTime: "09:00",
    endTime: "10:00",
    clientName: "Alex K.",
    service: "Meditation",
    status: "pending",
  },
]

// Helper function to convert time string to minutes
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

// Helper function to convert minutes to time string
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
}

// Helper function to check if two time slots overlap
export const slotsOverlap = (slot1: { start: string; end: string }, slot2: { start: string; end: string }): boolean => {
  const start1 = timeToMinutes(slot1.start)
  const end1 = timeToMinutes(slot1.end)
  const start2 = timeToMinutes(slot2.start)
  const end2 = timeToMinutes(slot2.end)

  return start1 < end2 && start2 < end1
}

// Get day name from date
export const getDayName = (date: Date): keyof WeekSchedule => {
  const days: (keyof WeekSchedule)[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  return days[date.getDay()]
}

// Get available time slots for a specific date
export const getAvailableTimeSlots = (
  date: string,
  sessionDuration: number, // in minutes
  schedule: WeekSchedule = mockSpecialistSchedule,
  existingBookings: ExistingBooking[] = mockExistingBookings,
): string[] => {
  const selectedDate = new Date(date)
  const dayName = getDayName(selectedDate)
  const daySchedule = schedule[dayName]

  if (!daySchedule.enabled || daySchedule.slots.length === 0) {
    return []
  }

  // Get existing bookings for this date
  const dayBookings = existingBookings.filter((booking) => booking.date === date && booking.status !== "cancelled")

  const availableSlots: string[] = []

  // For each work slot, generate possible time slots
  daySchedule.slots.forEach((workSlot) => {
    const startMinutes = timeToMinutes(workSlot.start)
    const endMinutes = timeToMinutes(workSlot.end)

    // Generate 30-minute intervals within the work slot
    for (let currentMinutes = startMinutes; currentMinutes + sessionDuration <= endMinutes; currentMinutes += 30) {
      const slotStart = minutesToTime(currentMinutes)
      const slotEnd = minutesToTime(currentMinutes + sessionDuration)

      // Check if this slot conflicts with any existing booking
      const hasConflict = dayBookings.some((booking) =>
        slotsOverlap({ start: slotStart, end: slotEnd }, { start: booking.startTime, end: booking.endTime }),
      )

      if (!hasConflict) {
        availableSlots.push(slotStart)
      }
    }
  })

  return availableSlots
}

// Validate if a specific time slot is available
export const isTimeSlotAvailable = (
  date: string,
  startTime: string,
  sessionDuration: number,
  schedule: WeekSchedule = mockSpecialistSchedule,
  existingBookings: ExistingBooking[] = mockExistingBookings,
): { available: boolean; reason?: string } => {
  const selectedDate = new Date(date)
  const dayName = getDayName(selectedDate)
  const daySchedule = schedule[dayName]

  // Check if specialist works on this day
  if (!daySchedule.enabled) {
    return { available: false, reason: "Specialist is not available on this day" }
  }

  const startMinutes = timeToMinutes(startTime)
  const endMinutes = startMinutes + sessionDuration
  const endTime = minutesToTime(endMinutes)

  // Check if the time falls within work hours
  const withinWorkHours = daySchedule.slots.some((slot) => {
    const slotStart = timeToMinutes(slot.start)
    const slotEnd = timeToMinutes(slot.end)
    return startMinutes >= slotStart && endMinutes <= slotEnd
  })

  if (!withinWorkHours) {
    return { available: false, reason: "Time is outside of work hours" }
  }

  // Check for conflicts with existing bookings
  const dayBookings = existingBookings.filter((booking) => booking.date === date && booking.status !== "cancelled")

  const hasConflict = dayBookings.some((booking) =>
    slotsOverlap({ start: startTime, end: endTime }, { start: booking.startTime, end: booking.endTime }),
  )

  if (hasConflict) {
    const conflictingBooking = dayBookings.find((booking) =>
      slotsOverlap({ start: startTime, end: endTime }, { start: booking.startTime, end: booking.endTime }),
    )
    return {
      available: false,
      reason: `Time conflicts with existing booking: ${conflictingBooking?.clientName} (${conflictingBooking?.startTime}-${conflictingBooking?.endTime})`,
    }
  }

  return { available: true }
}

// Get session duration in minutes from duration string
export const getSessionDurationMinutes = (duration: string): number => {
  const match = duration.match(/(\d+)/)
  return match ? Number.parseInt(match[1]) : 60
}
