// Mock data for slots
import type {Slot} from "@/types/slot";

export const mockSlots: Slot[] = [
    {
        id: "1",
        client: {id: "c1", name: "Снежана"},
        service: {id: "s1", name: "Таро расклад на отношения он-лайн", price: 2500},
        date: new Date("2024-07-15T13:00:00"),
        duration: 60,
        format: "video",
        status: "upcoming",
        requiresConfirmation: false,
    },
    {
        id: "2",
        client: {id: "c2", name: "Снежана"},
        service: {id: "s2", name: "Таро расклад на судьбу в кабинете", price: 3000},
        date: new Date("2024-07-15T15:00:00"),
        duration: 90,
        format: "in-person",
        status: "upcoming",
        requiresConfirmation: true,
        location: "Кабинет на Невском",
    },
    {
        id: "3",
        client: {id: "c3", name: "Снежана"},
        service: {id: "s3", name: "Разбор натальной карты для пары у клиента", price: 4500},
        date: new Date("2024-07-15T16:00:00"),
        duration: 120,
        format: "in-person",
        status: "upcoming",
        requiresConfirmation: false,
        location: "У клиента",
    },
]