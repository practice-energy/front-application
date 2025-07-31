import {Format} from "@/types/common";
import {CalendarRestrictions} from "@/types/calendar-event";
import {Feedback} from "@/types/feedback";

export interface Service {
    id: string
    title: string
    format: Format[]
    location?: string
    description: string
    contents: string
    practice: string
    price: number
    duration: string
    images: string[]
    includes: string[]
    specialist: {
        id: string
        name: string
        title: string
        avatar: string
    }
    tags: string[]
    reviews: Feedback[]
    bookings?: {
        id: string
        startTime: Date
        endTime: Date
        status?: "waiting" | "confirmed" | "request"
        createdAt: Date
        updatedAt: Date
        isRepeat?: boolean
        duration: number
        format: Format
    }[]
    calendarRestrictions?: CalendarRestrictions
}
