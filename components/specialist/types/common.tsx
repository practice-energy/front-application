import {Education, Experience} from "@/types/common";
import {Service} from "@/types/service";

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
