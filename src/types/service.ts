import {Format} from "@/src/types/common";
import {CalendarRestrictions} from "@/src/types/calendar-event";
import {Feedback} from "@/src/types/feedback";

export interface Practice {
    id: string
    slots: number
    duration: number
    price: number
}

export interface FormatSettings {
    practices: Practice[]
    score: number
    enabled: boolean
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

    settings: {
        video: FormatSettings
        inPerson: FormatSettings
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
        price: number
    }[]
    calendarRestrictions?: CalendarRestrictions
}
