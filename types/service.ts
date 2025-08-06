import {Format} from "@/types/common";
import {CalendarRestrictions} from "@/types/calendar-event";
import {Feedback} from "@/types/feedback";


export interface Practice {
    id: string
    slots: number
    duration: number
    price: number
    format: Format
}


export interface Service {
    id: string
    title: string

    location?: string
    description: string
    contents: string

    images: string[]
    includes: string[]
    specialist: {
        id: string
        name: string
        title: string
        avatar: string
    }
    practice: Practice[]

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