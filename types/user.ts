export interface Email {
    address: string;
    verified: boolean;
}

export interface EducationItem {
    description: string;
    certificate: File | null;
}

export interface ExperienceItem {
    description: string;
    certificate: File | null;
}

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    avatar: string;
    email: Email;
    images: File[];
    created_at: string; // or Date if you'll convert it
    account_balance: number;
    tier: string; // or a union type like "Premium" | "Standard" | "Basic" if you have specific tiers
    isSpecialist: boolean;
    bio: string;
    fullBio: string;
    location: string;
    education: EducationItem[];
    experience: ExperienceItem[];
    hat: "adept" | "master" | "superviser";
}
