export interface Education {
    id?: string;
    title: string;
    description: string;
    certificate?: string;
}

export interface Experience {
    id?: string;
    description: string;
}

export type Format = "video" | "in-person"

export type ActivityStatus = "request" | "confirmed" | "waiting" | "finalized" | "declined"
