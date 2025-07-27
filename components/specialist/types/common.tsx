import {Education, Experience, Service} from "@/types/common";

export interface SpecialistData {
    name: string
    title: string
    avatar: string
    location: string
    description: string
    education: Education[]
    certificates: Education[]
    experience: Experience[]
    services: Service[]
    skills: string[]
}