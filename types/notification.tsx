// Notification types
export interface Notification {
    id: string
    type: "message" | "email" | "meeting" | "system"
    title: string
    message: string
    timestamp: Date
    read: boolean
    actionUrl: string
    userId?: string
    metadata?: Record<string, any>
}
