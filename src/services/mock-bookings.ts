import type { Booking } from "@/src/types/booking"
import { v4 as uuidv4 } from "uuid"

export const mockBookings: Booking[] = [
  {
    id: uuidv4(),
    service: {
      id: uuidv4(),
      title: "Таро расклад на судьбу святой грааль",
      description: "Подробный расклад на жизненный путь",
      duration: 60,
    },
    specialist: {
      id: uuidv4(),
      name: "Афалина Дионисовна",
      avatar: "/placeholder.jpg",
    },
    date: new Date(2025, 6, 13, 5, 0), // 13 июля 2025, 05:00
    duration: 60,
    slots: 1,
    format: "in-person",
    status: "confirmed",
    createdAt: new Date(),
    updatedAt: new Date(),
    price: 3000,
  },
  {
    id: uuidv4(),
    service: {
      id: uuidv4(),
      title: "Таро расклад на судьбу",
      description: "Подробный расклад на жизненный путь",
      duration: 60,
    },
    specialist: {
      id: uuidv4(),
      name: "Афалина Дионисовна",
      avatar: "/placeholder.jpg",
    },
    date: new Date(2025, 6, 13, 6, 0), // 13 июля 2025, 06:00
    duration: 60,
    slots: 3,
    format: "in-person",
    status: "waiting",
    createdAt: new Date(),
    updatedAt: new Date(),
    price: 3000,
  },
  {
    id: uuidv4(),
    service: {
      id: uuidv4(),
      title: "Таро расклад на судьбуТаро расклад на судьбуТаро расклад на судьбу",
      description: "Подробный расклад на жизненный путь",
      duration: 60,
    },
    specialist: {
      id: uuidv4(),
      name: "Афалина Дионисовна",
      avatar: "/placeholder.jpg",
    },
    date: new Date(2025, 6, 13, 17, 0), // 13 июля 2025, 17:00
    duration: 120,
    slots: 2,
    format: "video",
    status: "waiting",
    createdAt: new Date(),
    updatedAt: new Date(),
    price: 3000,
  },
  {
    id: uuidv4(),
    service: {
      id: uuidv4(),
      title: "Таро расклад на судьбу",
      description: "Ебаный рот этого казино, блять. Ты кто такой, сука? Чтоб это сделать? Вы че, дибилы? Вы че, ебанутые? Вы внатуре ебанутые. Эта сидит там, чешет колоду, блять. Этот стоит, говорит \"Я тебе щас тоже раздам\"... Еб твою мать, у вас дилер есть, чтоб это делать на моих глазах, мудак ебаный! Дегенерат ебучий! Вот пока ты это делал, дибил ебаный, сука, блять, так все и происходило! ХУИПИ! Блять, вы че, действительно идиоты, а? Блять, дифиченты какие-то, ебаный ваш рот, а. Ты че делаешь?! ЕБАНЫЙ ТВОЙ РОТ, КАКОГО ХУЯ ОНИ В ДРУГОМ ПОРЯДКЕ РАЗЛОЖЕНЫ, ТЫ РАСПЕЧАТАЛА КОЛОДУ НА МОИХ ГЛАЗАХ, БЛЯТЬ! КАК ОНИ МОГУТ БЫТЬ ТАМ РАЗЛОЖЕНЫ В ДРУГОМ ПОРЯДКЕ? ЕБАНЫЙ ТВОЙ РОТ, БЛЯТЬ, ВЫ ЧЕ, В КИОСКАХ ИХ ЗАРЯЖАЕТЕ? СУКА ЕБАНАЯ, ПАДЛА БЛЯДСКАЯ! ТЫ МУДИЛО ГОРОХОВОЕ, как заряжен?! Как запечатанная колода может быть в другом порядке разложена?! ТЫ ДОЛБОЕБ ЕБАНЫЙ! ТЫ МУДИЛО ЕБУЧЕЕ, ВЫ ВО ЧТО ИГРАЕТЕ? СУКА ЕБАНАЯ, ПАДЛА! Я РОТ ТВОЙ ЕБАЛ, ВЫ БЛЯДИ, ПОКУПАЙТЕ КАРТЫ НЕ В КИОСКАХ! ВЫ ЧЕ, ЕБАНУТЫЕ, СУКА? ТЫ МУДИЛО, КАК МОЖЕТ В КАЗИНО БЫТЬ КОЛОДА РАЗЛОЖЕНА В ДРУГОМ ПОРЯДКЕ? ТЫ ЧЕ, БРЕДИШЬ ЧТОЛИ? ЕБАНЫЙ ТВОЙ РОТ, А! ТЫ ЧЕ, БРЕДИШЬ, СУКА? БЛЯТЬ, ДЕГЕНЕРАТИВНОЕ ХУЙЛО, ТЫ БРЕДИШЬ ЧТОЛИ? ТЫ ЧЕ, БРЕДИШЬ, БЛЯТЬ? КАК В КАЗИНО КАРТЫ МОГУТ БЫТЬ ПО-ДРУГОМУ РАЗЛОЖЕНЫ? ТЫ ЧО, ДУРАК, БЛЯТЬ? ЕБАНЫЙ КОЗЕЛ, I FUCK YOUR BULLSHIT... SHIT! Я специально, я щас им расскажу, что вы тут исполняете! ВЫ ЧО, ДИБИЛЫ, БЛЯДЬ? ВЫ ЧО, ДИБИЛЫ, СУКА? Как в казино в запечатанной пачке может быть разложены по-другому карты, вы че?! ТЫ МУДИЛО ГОРОХОВОЕ, ВЫ ГДЕ ИХ БЕРЕТЕ, БЛЯДИ? ВЫ МУДИЛЫ! Вы че... блять. Еб твою мать, в казино, сука, карты разложены по-другому! ТЫ ЧЕ, ДУРАК, ЕБАНЫЙ ТВОЙ РОТ? ТЫ ЧЕ, КРЕТИН ЧТОЛИ? ТЫ ДЕГЕНЕРАТИВНЫЙ КРЕТИН, ты понимаешь, что ты говоришь вообще?! Ты говоришь, что в казино, в запечатанных колодах карты разложены по-другому?!",
      duration: 60,
    },
    specialist: {
      id: uuidv4(),
      name: "Афалина Дионисовна",
      avatar: "/placeholder.jpg",
    },
    date: new Date(2025, 6, 14, 10, 0), // 14 июля 2025, 10:00
    duration: 90,
    slots: 4,
    format: "video",
    status: "confirmed",
    createdAt: new Date(),
    updatedAt: new Date(),
    price: 3000,
  },
  {
    id: uuidv4(),
    service: {
      id: uuidv4(),
      title: "Таро расклад на судьбу",
      description: "Подробный расклад на жизненный путь",
      duration: 60,
    },
    specialist: {
      id: uuidv4(),
      name: "Афалина Дионисовна",
      avatar: "/placeholder.jpg",
    },
    date: new Date(2025, 6, 15, 14, 0), // 15 июля 2025, 14:00
    duration: 180,
    slots: 3,
    format: "in-person",
    status: "confirmed",
    createdAt: new Date(),
    updatedAt: new Date(),
    price: 3000,
  },
  {
    id: uuidv4(),
    service: {
      id: uuidv4(),
      title: "Таро расклад на судьбу",
      description: "Подробный расклад на жизненный путь",
      duration: 60,
    },
    specialist: {
      id: uuidv4(),
      name: "Афалина Дионисовна",
      avatar: "/placeholder.jpg",
    },
    price: 3000,
    date: new Date(new Date().setHours(9, 0, 0, 0)), // Today at 9:00
    duration: 30,
    slots: 1,
    format: "video",
    status: "confirmed",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    service: {
      id: uuidv4(),
      title: "Таро расклад на судьбу",
      description: "Подробный расклад на жизненный путь",
      duration: 60,
    },
    specialist: {
      id: uuidv4(),
      name: "Афалина Дионисовна",
      avatar: "/placeholder.jpg",
    },
    price: 3000,
    date: new Date(new Date().setHours(15, 0, 0, 0)), // Today at 15:00
    duration: 90,
    slots: 2,
    format: "in-person",
    status: "confirmed",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
