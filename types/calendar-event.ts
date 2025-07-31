import {Format} from "@/types/common";

export interface CalendarRestrictions {
    gmt: number
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
}

export interface Restriction {
    id: string
    name: string
    date?: Date
    isActive: boolean
    intervals: Interval[]
}

export interface Interval {
    start: Date
    end: Date
    formats: Format[]
}
