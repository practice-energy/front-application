import {Format} from "@/types/common";

export interface CalendarRestirctions {
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
    date?: Date
    isActive: boolean
    intervals: Interval[]
}

export interface Interval {
    start: Date
    end: Date
    formats: Format[]
}