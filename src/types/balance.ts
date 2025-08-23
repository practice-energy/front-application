import {Hat, Tier} from "@/types/user";

export interface Balance {
    amount: number
    subscriptions: Subscription[]
}

export interface Subscription {
    id: string
    tier: Tier
    hat: Hat
    price: number
    endDate: Date
    isActive: boolean
}