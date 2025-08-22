import {Service} from "@/src/types/service";
import {Education, Experience} from "@/src/types/common";

export interface Specialist {
    id: string
    name: string
    title: string
    avatar: string
    practices: number
    location: string
    description: string
    specialties: string[]
    education: Education[]
    certificates: Education[]
    experience: Experience[]
    services: Service[]
    skills: string[]
    likes: number
    isLiked?:boolean
    rate5?: number
}
