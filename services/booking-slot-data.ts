import { addMinutes, addDays, setMinutes, setHours } from 'date-fns';
import {BookingSlot} from "@/types/booking";

export const mockBookingSlots: BookingSlot[] = [
    // Сегодня +1 час (округлено до получасов)
    {
        date: new Date(new Date().setHours(new Date().getHours() + 1, 0, 0, 0)),
        slots: 2
    },
    {
        date: new Date(new Date().setHours(new Date().getHours() + 1, 30, 0, 0)),
        slots: 1
    },

    // Сегодня +2 часа
    {
        date: new Date(new Date().setHours(new Date().getHours() + 2, 0, 0, 0)),
        slots: 2
    },
    {
        date: new Date(new Date().setHours(new Date().getHours() + 2, 30, 0, 0)),
        slots: 1
    },

    // Завтра в 10:00
    {
        date: new Date(new Date().setDate(new Date().getDate() + 1, 10, 0, 0, 0)),
        slots: 2
    },
    {
        date: new Date(new Date().setDate(new Date().getDate() + 1, 10, 30, 0, 0)),
        slots: 1
    },

    // Послезавтра в 15:30
    {
        date: new Date(new Date().setDate(new Date().getDate() + 2, 15, 30, 0, 0)),
        slots: 2
    },
    {
        date: new Date(new Date().setDate(new Date().getDate() + 2, 16, 0, 0, 0)),
        slots: 1
    }
];
