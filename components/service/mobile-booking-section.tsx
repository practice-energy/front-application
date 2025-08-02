"use client"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { BookingSlot } from "@/types/booking"
import { format, addDays, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "lucide-react"

interface MobileBookingSectionProps {
    selectedDate: Date
    bookingSlots: BookingSlot[]
}

export function MobileBookingSection({ selectedDate, bookingSlots }: MobileBookingSectionProps) {
    // Generate 3 days: selected + 2 next days
    const days = [selectedDate, addDays(selectedDate, 1), addDays(selectedDate, 2)]

    // Get all unique hours that have bookings (including hours covered by multi-hour bookings)
    const visibleHours = Array.from(
        new Set(
            bookingSlots.flatMap(booking => {
                if (!booking.date) return []
                const isIncludedDay = days.some(day => isSameDay(booking.date, day))
                if (!isIncludedDay) return []

                const startHour = booking.date.getHours()
                const startMinutes = booking.date.getMinutes()
                const durationHours = (booking.slots * 30) / 60 // Convert 30-min slots to hours

                // Calculate end time
                const endTime = new Date(booking.date.getTime() + durationHours * 60 * 60 * 1000)
                const endHour = endTime.getHours()

                // Generate all hours covered by this booking
                const hours = []
                let currentHour = startHour
                while (currentHour <= endHour) {
                    hours.push(currentHour)
                    currentHour++
                }

                return hours
            })
        )
    ).sort((a, b) => a - b)

    // Generate hourly slots only for hours that have bookings
    const generateVisibleHourlySlots = () => {
        return visibleHours.map(hour => `${hour.toString().padStart(2, "0")}:00`)
    }

    const hourlySlots = generateVisibleHourlySlots()

    const SLOT_HEIGHT = 48 // Height for 30-minute slot
    const totalHeight = visibleHours.length * 2 * SLOT_HEIGHT // 2 slots per hour

    // Get bookings for specific day
    const getBookingsForDay = (day: Date) => {
        return bookingSlots.filter(booking => booking.date && isSameDay(booking.date, day))
    }

    // Format date for display
    function formatDate(date: Date, isSelectedDay = false) {
        const formatted = date
            .toLocaleDateString("ru-RU", {
                weekday: "short",
                day: "numeric",
            })
            .replace(",", "")

        const [weekday, day] = formatted.split(" ")

        return (
            <div className="flex flex-row items-center justify-center">
                <span className={cn("px-1 py-0.5")}>
                    {weekday.replace(/^./, (letter) => letter.toUpperCase())}
                </span>
                <div className={cn("px-1 py-0.5", isSelectedDay && "bg-violet-600 w-[24px] text-white rounded-sm aspect-square items-center")}>
                    {day}
                </div>
            </div>
        )
    }

    // Calculate position for a time slot
    const calculatePosition = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number)
        const hourIndex = visibleHours.findIndex(h => h === hours)
        if (hourIndex === -1) return 0

        const slotInHour = minutes >= 30 ? 1 : 0
        return (hourIndex * 2 + slotInHour) * SLOT_HEIGHT
    }

    // Group overlapping bookings for a day
    const groupOverlappingBookings = (dayBookings: BookingSlot[]) => {
        if (dayBookings.length === 0) return [];

        // Sort bookings by start time
        const sortedBookings = [...dayBookings].sort((a, b) => {
            if (!a.date || !b.date) return 0
            return a.date.getTime() - b.date.getTime()
        });

        const groups: BookingSlot[][] = [];
        let currentGroup: BookingSlot[] = [];
        let currentEndTime: Date | null = null;

        sortedBookings.forEach(booking => {
            if (!booking.date) return;

            const bookingStart = booking.date;
            const bookingEnd = new Date(bookingStart.getTime() + (booking.slots * 30 * 60 * 1000));

            if (!currentEndTime || bookingStart >= currentEndTime) {
                // Start a new group
                if (currentGroup.length > 0) {
                    groups.push(currentGroup);
                }
                currentGroup = [booking];
                currentEndTime = bookingEnd;
            } else {
                // Add to current group
                currentGroup.push(booking);
                if (bookingEnd > currentEndTime) {
                    currentEndTime = bookingEnd;
                }
            }
        });

        // Add the last group
        if (currentGroup.length > 0) {
            groups.push(currentGroup);
        }

        return groups;
    };

    return (
        <div className="flex-1 h-full w-full relative">
            {hourlySlots.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-8 bold text-gray-500">
                    <Calendar />
                    <span>Нет доступных слотов для бронирования</span>
                </div>
            ) : (
                <div className="w-full pt-6 h-2/3">
                    {/* Days header */}
                    <div className="grid grid-cols-[50px_1fr_1fr_1fr] mb-2">
                        <div className="text-sm w-[50px] text-gray-500"></div>
                        {days.map((day, index) => (
                            <div key={index} className="text-center">
                                <div className="text-sm font-medium mx-auto text-neutral-900">{formatDate(day, index === 0)}</div>
                            </div>
                        ))}
                    </div>

                    {/* Time slots with bookings */}
                    <ScrollArea className="h-96 border-t border-gray-200 w-full">
                        <div className="relative" style={{ height: `${totalHeight}px` }}>
                            {/* Render time grid */}
                            <div className="grid grid-cols-[50px_1fr_1fr_1fr] absolute inset-0">
                                {/* Time labels column - fixed 50px */}
                                <div className="w-[50px]">
                                    {visibleHours.map(hour => (
                                        <div key={hour} className="border-l border-gray-200 text-xs text-gray-500" style={{ height: `${SLOT_HEIGHT * 2}px` }}>
                                            <div className="h-full flex items-center ml-2 text-center justify-center pr-2">
                                                {hour.toString().padStart(2, '0')}:00
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Day columns - equally share remaining space */}
                                {days.map((day, dayIndex) => (
                                    <div
                                        key={dayIndex}
                                        className={cn(
                                            "border-r border-gray-200",
                                            dayIndex === 0 && "border-l"
                                        )}
                                    >
                                        {visibleHours.map(hour => (
                                            <div key={hour} className="border-b border-gray-200" style={{ height: `${SLOT_HEIGHT * 2}px` }}>
                                                <div style={{ height: `${SLOT_HEIGHT}px` }} className="border-b border-gray-100"></div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            {/* Render bookings as overlay - FIXED POSITIONING */}
                            {days.map((day, dayIndex) => {
                                const dayBookings = getBookingsForDay(day)
                                const bookingGroups = groupOverlappingBookings(dayBookings)
                                const columnWidth = `calc((100% - 50px) / ${days.length})`
                                const columnLeft = `calc(50px + ${dayIndex} * ${columnWidth})`

                                return (
                                    <div
                                        key={dayIndex}
                                        className="absolute top-0"
                                        style={{
                                            left: columnLeft,
                                            width: columnWidth,
                                            height: '100%'
                                        }}
                                    >
                                        {bookingGroups.map((group, groupIndex) => {
                                            return group.map((booking, bookingIndex) => {
                                                if (!booking.date) return null

                                                const startTime = format(booking.date, "HH:mm")
                                                const top = calculatePosition(startTime)
                                                const height = SLOT_HEIGHT * booking.slots

                                                // Calculate width and left position based on group size
                                                const groupSize = group.length
                                                const width = `calc(${100 / groupSize}% - 8px)`
                                                const left = `calc(${(bookingIndex % groupSize) * (100 / groupSize)}% + 4px)`

                                                return (
                                                    <div
                                                        key={`${groupIndex}-${bookingIndex}`}
                                                        className="absolute text-xs font-normal"
                                                        style={{
                                                            top: `${top+4}px`,
                                                            height: `${height-8}px`,
                                                            width: width,
                                                            left: left,
                                                        }}
                                                    >
                                                        <div className="bg-violet-600 active:bg-violet-700 text-white p-1 w-full h-full rounded-sm flex items-center justify-center">
                                                            {group.length < 3 && format(booking.date, "HH:mm")}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        })}
                                    </div>
                                )
                            })}
                        </div>
                    </ScrollArea>
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-from-neutral-150 z-10 pointer-events-none" />
                </div>
            )}
        </div>
    )
}
