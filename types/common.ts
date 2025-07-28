export interface Education {
    title: string;
    description: string;
    certificate?: string;
}

export interface Experience {
    description: string;
}
export interface Specialist {
    id: string
    name: string
    title: string
    avatar: string
    practices: number
    price: number
    images: string[]
    location: string
    description: string
    specialties: string[]
    education: Education[]
    certificates: Education[]
    experience: Experience[]
    services: Service[]
    skills: string[]
    likes: number
}

export type Format = "video" | "in-person"

export interface Service {
    id: string
    title: string
    format: Format[]
    location?: string
    description: string
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
}

export interface Feedback {
    id: string
    author: string
    avatar: string
    comment: string
    date: number
}
