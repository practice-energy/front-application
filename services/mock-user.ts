// Mock User Data
import type {User} from "@/types/user";
import {v4 as uuidv4} from "uuid";

export const mockUser: User = {
    id: uuidv4(),
    first_name: "Ivan",
    last_name: "Ivanov",
    email: {
        address: "ivan.ivanov@example.com",
        verified: true,
    },
    images: [],
    location: "",
    timezone: "GMT+3",
    createdAt: new Date(2023, 6, 10, 11, 0),
    tier: "basic",
    isSpecialist: true,
    bio: "With over 15 years of experience in spiritual guidance and life coaching, I help clients find clarity, purpose, and balance. My approach combines traditional astrological wisdom with modern coaching techniques to create personalized paths for growth and transformation.",
    education: [],
    experience: [
        {
            description: "Senior Life Coach at Mindful Living Center (2015-Present)",
        },
        {
            description: "Spiritual Guide at Wellness Collective (2010-2015)",
        },
    ],
    certifcates: [],
    hat: "adept",
}