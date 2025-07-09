// Mock notifications data with proper timestamps

import {Notification} from "@/types/notification";

export const mockNotifications: Notification[] = [
    {
        id: "1",
        type: "message",
        title: "New message from Dr. Sarah Williams",
        message: "You have a new message from Dr. Sarah Williams",
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        read: false,
        actionUrl: "/search/123",
        userId: "sarah-williams",
    },
    {
        id: "2",
        type: "email",
        title: "Please verify your email address",
        message: "Please verify your email address to secure your account",
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        read: false,
        actionUrl: "/profile?section=security",
    },
    {
        id: "3",
        type: "meeting",
        title: "Meeting with Elena Rodriguez in 30 minutes",
        message: "Meeting with Elena Rodriguez in 30 minutes",
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: false,
        actionUrl: "/search/456",
        userId: "elena-rodriguez",
    },
    {
        id: "4",
        type: "message",
        title: "New message from Marcus Chen",
        message: "You have a new message from Marcus Chen",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        read: true,
        actionUrl: "/search/789",
        userId: "marcus-chen",
    },
    {
        id: "5",
        type: "system",
        title: "Profile completion bonus available",
        message: "Complete your profile to earn 50 bonus points",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
        actionUrl: "/profile?section=overview",
    },
]