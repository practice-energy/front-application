import {Service} from "@/types/service";
import {Education, Experience} from "@/types/common";

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
