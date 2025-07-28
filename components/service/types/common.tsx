import {Format} from "@/types/common";

export interface ServiceData {
    title: string
    format: Format[]
    location?: string
    description: string
    price: number
    duration: string
    images: string[]
    includes: string[]
    tags: string[]
}
