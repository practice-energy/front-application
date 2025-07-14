export interface Education {
    description: string;
    certificate: File | null;
}

export interface Experience {
    description: string;
}

export interface AvailabilitySlot {
    id: string
    date: string
    startTime: string
    endTime: string
    available: boolean
}

export interface Specialist {
    id: string
    name: string
    title: string
    avatar: string
    reviewCount: number
    price: number
    images: string[]
    location: string
    description: string
    specialties: string[]
    languages: string[]
    education: Education[]
    experience: Experience[]
    availability: AvailabilitySlot[]
    services: Service[]
    reviews?: Review[]
}

export interface Service {
    id: string
    title: string
    format: "video" | "in-person"
    location?: string
    description: string
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
    reviews: Review[]
}

export interface Review {
    id: string
    author: string
    avatar: string
    comment: string
    date: number
    verified: boolean
}
