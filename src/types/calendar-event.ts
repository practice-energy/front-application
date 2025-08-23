import {Format} from "@/src/types/common";

export interface CalendarRestrictions {
    gmt: string
    commons: {
        Mon: Restriction
        Tue: Restriction
        Wed: Restriction
        Thu: Restriction
        Fri: Restriction
        Sat: Restriction
        Sun: Restriction
    }
    restrictions: Restriction[]
    location?: string
}

export interface Restriction {
    id: string
    date?: Date
    isActive: boolean
    intervals: Interval[]
    isPractice: boolean
}

export interface Interval {
    start: Date
    end: Date
    formats: Format[]
}
