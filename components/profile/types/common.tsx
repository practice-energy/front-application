import {Education, Experience} from "@/types/common";

export interface ProfileData {
    name: string
    bio: string
    location: string
    avatar?: File
    experience: Experience[]
    education: Education[]
}
