// Mock данные для услуг (обновлены ID)
import {mockSpecialists} from "@/src/services/mock-specialists";
import {mockFeedbacks} from "@/src/services/mock-feedbacks";
import {v4 as uuidv4} from "uuid";
import {service1Id, service2Id, specialist1Id, specialist2Id} from "@/src/services/mock-data";
import {Service} from "@/src/types/service";

export const mockServices: Service[] = [
    {
        id: service1Id,
        title: "Натальная карта",
        description: "Подробный разбор натальной карты с рекомендациями",
        images: [
            "/placeholder.jpg",
            "/placeholder.jpg",
        ],
        contents: "Подробный разбор натальной карты с рекомендациямиПодробный разбор натальной карты с рекомендациямиПодробный разбор натальной карты с рекомендациямиПодробный разбор натальной карты с рекомендациями",
        specialist: mockSpecialists[0],
        tags: ["астрология", "натальная карта", "личность"],
        reviews: mockFeedbacks,
        includes: ["Wipes", "Pencils", "Markers", "Wipes", "Pencils", "Markers"],
        location: "Бибирево, Большая Ленина",
        settings: {
            video: {
                practices: [],
                score: 1,
                enabled: false,
            },
            inPerson: {
                practices: [],
                score: 2,
                enabled: false,
            },
        },
        bookings: [
            {
                id: uuidv4(),
                startTime: new Date(),
                endTime: new Date(),
                status: "confirmed",
                createdAt: new Date(),
                updatedAt: new Date(),
                isRepeat: false,
                duration: 30,
                format: "video",
                price: 3000
            },
            {
                id: uuidv4(),
                startTime: new Date(),
                endTime: new Date(),
                status: "confirmed",
                createdAt: new Date(),
                updatedAt: new Date(),
                isRepeat: false,
                duration: 240,
                format: "in-person",
                price: 3000
            },
        ],
        calendarRestrictions: {
            gmt: "GMT+3",
            commons: {
                Mon: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Tue: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Wed: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Thu: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Fri: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Sat: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Sun: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                }
            },
            restrictions: []
        }
    },
    {
        id: service1Id,
        title: "Натальная карта",
        description: "Подробный разбор натальной карты с рекомендациями",
        images: [
            "/placeholder.jpg",
            "/placeholder.jpg",
        ],
        contents: "Подробный разбор натальной карты с рекомендациямиПодробный разбор натальной карты с рекомендациямиПодробный разбор натальной карты с рекомендациямиПодробный разбор натальной карты с рекомендациями",
        specialist: mockSpecialists[0],
        tags: ["астрология", "натальная карта", "личность"],
        reviews: mockFeedbacks,
        includes: ["Wipes", "Pencils", "Markers", "Wipes", "Pencils", "Markers"],
        location: "Бибирево, Большая Ленина",
        settings: {
            video: {
                practices: [],
                score: 1,
                enabled: false,
            },
            inPerson: {
                practices: [],
                score: 2,
                enabled: false,
            },
        },
        bookings: [
            {
                id: uuidv4(),
                startTime: new Date(),
                endTime: new Date(),
                status: "confirmed",
                createdAt: new Date(),
                updatedAt: new Date(),
                isRepeat: false,
                duration: 30,
                format: "video",
                price: 3000
            },
            {
                id: uuidv4(),
                startTime: new Date(),
                endTime: new Date(),
                status: "confirmed",
                createdAt: new Date(),
                updatedAt: new Date(),
                isRepeat: false,
                duration: 240,
                format: "in-person",
                price: 3000
            },
        ],
        calendarRestrictions: {
            gmt: "GMT+3",
            commons: {
                Mon: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Tue: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Wed: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Thu: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Fri: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Sat: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Sun: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                }
            },
            restrictions: []
        }
    },
    {
        id: service1Id,
        title: "Натальная карта",
        description: "Подробный разбор натальной карты с рекомендациями",
        images: [
            "/placeholder.jpg",
            "/placeholder.jpg",
        ],
        contents: "Подробный разбор натальной карты с рекомендациямиПодробный разбор натальной карты с рекомендациямиПодробный разбор натальной карты с рекомендациямиПодробный разбор натальной карты с рекомендациями",
        specialist: mockSpecialists[0],
        tags: ["астрология", "натальная карта", "личность"],
        reviews: mockFeedbacks,
        includes: ["Wipes", "Pencils", "Markers", "Wipes", "Pencils", "Markers"],
        location: "Бибирево, Большая Ленина",
        settings: {
            video: {
                practices: [],
                score: 1,
                enabled: false,
            },
            inPerson: {
                practices: [],
                score: 2,
                enabled: false,
            },
        },
        bookings: [
            {
                id: uuidv4(),
                startTime: new Date(),
                endTime: new Date(),
                status: "confirmed",
                createdAt: new Date(),
                updatedAt: new Date(),
                isRepeat: false,
                duration: 30,
                format: "video",
                price: 3000
            },
            {
                id: uuidv4(),
                startTime: new Date(),
                endTime: new Date(),
                status: "confirmed",
                createdAt: new Date(),
                updatedAt: new Date(),
                isRepeat: false,
                duration: 240,
                format: "in-person",
                price: 3000
            },
        ],
        calendarRestrictions: {
            gmt: "GMT+3",
            commons: {
                Mon: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Tue: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Wed: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Thu: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Fri: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Sat: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Sun: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                }
            },
            restrictions: []
        }
    },
    {
        id: service1Id,
        title: "Натальная карта",
        description: "Подробный разбор натальной карты с рекомендациями",
        images: [
            "/placeholder.jpg",
            "/placeholder.jpg",
        ],
        contents: "Подробный разбор натальной карты с рекомендациямиПодробный разбор натальной карты с рекомендациямиПодробный разбор натальной карты с рекомендациямиПодробный разбор натальной карты с рекомендациями",
        specialist: mockSpecialists[0],
        tags: ["астрология", "натальная карта", "личность"],
        reviews: mockFeedbacks,
        includes: ["Wipes", "Pencils", "Markers", "Wipes", "Pencils", "Markers"],
        location: "Бибирево, Большая Ленина",
        settings: {
            video: {
                practices: [],
                score: 1,
                enabled: false,
            },
            inPerson: {
                practices: [],
                score: 2,
                enabled: false,
            },
        },
        bookings: [
            {
                id: uuidv4(),
                startTime: new Date(),
                endTime: new Date(),
                status: "confirmed",
                createdAt: new Date(),
                updatedAt: new Date(),
                isRepeat: false,
                duration: 30,
                format: "video",
                price: 3000
            },
            {
                id: uuidv4(),
                startTime: new Date(),
                endTime: new Date(),
                status: "confirmed",
                createdAt: new Date(),
                updatedAt: new Date(),
                isRepeat: false,
                duration: 240,
                format: "in-person",
                price: 3000
            },
        ],
        calendarRestrictions: {
            gmt: "GMT+3",
            commons: {
                Mon: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Tue: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Wed: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Thu: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Fri: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Sat: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Sun: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                }
            },
            restrictions: []
        }
    },
    {
        id: service1Id,
        title: "Натальная карта",
        description: "Подробный разбор натальной карты с рекомендациями",
        images: [
            "/placeholder.jpg",
            "/placeholder.jpg",
        ],
        contents: "Подробный разбор натальной карты с рекомендациямиПодробный разбор натальной карты с рекомендациямиПодробный разбор натальной карты с рекомендациямиПодробный разбор натальной карты с рекомендациями",
        specialist: mockSpecialists[0],
        tags: ["астрология", "натальная карта", "личность"],
        reviews: mockFeedbacks,
        includes: ["Wipes", "Pencils", "Markers", "Wipes", "Pencils", "Markers"],
        location: "Бибирево, Большая Ленина",
        settings: {
            video: {
                practices: [],
                score: 1,
                enabled: false,
            },
            inPerson: {
                practices: [],
                score: 2,
                enabled: false,
            },
        },
        bookings: [
            {
                id: uuidv4(),
                startTime: new Date(),
                endTime: new Date(),
                status: "confirmed",
                createdAt: new Date(),
                updatedAt: new Date(),
                isRepeat: false,
                duration: 30,
                format: "video",
                price: 3000
            },
            {
                id: uuidv4(),
                startTime: new Date(),
                endTime: new Date(),
                status: "confirmed",
                createdAt: new Date(),
                updatedAt: new Date(),
                isRepeat: false,
                duration: 240,
                format: "in-person",
                price: 3000
            },
        ],
        calendarRestrictions: {
            gmt: "GMT+3",
            commons: {
                Mon: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Tue: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Wed: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Thu: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Fri: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Sat: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Sun: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                }
            },
            restrictions: []
        }
    },
    {
        id: service1Id,
        title: "Натальная карта",
        description: "Подробный разбор натальной карты с рекомендациями",
        images: [
            "/placeholder.jpg",
            "/placeholder.jpg",
        ],
        contents: "Подробный разбор натальной карты с рекомендациямиПодробный разбор натальной карты с рекомендациямиПодробный разбор натальной карты с рекомендациямиПодробный разбор натальной карты с рекомендациями",
        specialist: mockSpecialists[0],
        tags: ["астрология", "натальная карта", "личность"],
        reviews: mockFeedbacks,
        includes: ["Wipes", "Pencils", "Markers", "Wipes", "Pencils", "Markers"],
        location: "Бибирево, Большая Ленина",
        settings: {
            video: {
                practices: [],
                score: 1,
                enabled: false,
            },
            inPerson: {
                practices: [],
                score: 2,
                enabled: false,
            },
        },
        bookings: [
            {
                id: uuidv4(),
                startTime: new Date(),
                endTime: new Date(),
                status: "confirmed",
                createdAt: new Date(),
                updatedAt: new Date(),
                isRepeat: false,
                duration: 30,
                format: "video",
                price: 3000
            },
            {
                id: uuidv4(),
                startTime: new Date(),
                endTime: new Date(),
                status: "confirmed",
                createdAt: new Date(),
                updatedAt: new Date(),
                isRepeat: false,
                duration: 240,
                format: "in-person",
                price: 3000
            },
        ],
        calendarRestrictions: {
            gmt: "GMT+3",
            commons: {
                Mon: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Tue: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Wed: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Thu: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Fri: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Sat: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                },
                Sun: {
                    id: "",
                    name: "",
                    isActive: false,
                    intervals: [],
                    isPractice: false
                }
            },
            restrictions: []
        }
    },
]
