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

export interface Service {
    id: string
    title: string
    format: "video" | "in-person"
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
