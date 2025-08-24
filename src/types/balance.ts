import {Hat, Tier} from "@/types/user";

export interface Balance {
    amount: number
    subscriptions: Subscription[]
    transactionHistory: Transaction[]
}

export type PaymentStatus = "payed" | "unpayed"

export interface Transaction {
    id: string
    amount: number
    name: string
    type: "credit" | "debit"
    time: Date
    status: PaymentStatus
}

export interface Subscription {
    id: string
    tier: Tier
    hat: Hat
    price: number
    endDate: Date
    isActive: boolean
}