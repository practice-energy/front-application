import {Education, Experience} from "@/types/common";

export interface ProfileData {
    name: string
    bio: string
    location: string
    avatar?: string
    experience: Experience[]
    education: Education[]
    certificates: Education[]
}
