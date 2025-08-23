import {Hat} from "@/types/user";

export interface Balance {
    amount: number
    subscriptions: Subscription[]
}

export interface Subscription {
    id: string
    tier: string
    hat: Hat
    price: number
    endDate: number
}