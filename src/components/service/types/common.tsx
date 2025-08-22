import {Format} from "@/src/types/common";
import {CalendarRestrictions} from "@/src/types/calendar-event";

export interface ServiceData {
    title: string
    format: Format[]
    location?: string
    description: string
    contents: string

    priceInPerosn: number
    priceVideo: number
    calendarRestrictions: CalendarRestrictions
    duration: string
    images: string[]
    includes: string[]
    tags: string[]
}
