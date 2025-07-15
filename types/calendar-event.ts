export interface CalendarEvent {
    id: string;
    specialist: {
        name: string;
        photo: string;
    };
    date: Date;
    duration: number;
    type: "video" | "voice" | string; // Add other possible types if needed
    status: "upcoming" | "completed" | string; // Add other possible statuses if needed
    title: string;
    price: number;
}
