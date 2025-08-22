import {Education, Experience} from "@/src/types/common";
import {Service} from "@/src/types/service";

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
