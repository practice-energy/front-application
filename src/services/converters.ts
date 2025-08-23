import type {
  Service as GqlService,
  CreateServiceInput,
  UpdateServiceInput,
  User as GqlUser,
  UpdateUserInput,
  SpecialistProfile,
  UpdateSpecialistInput,
  CalendarRestrictions as GqlCalendarRestrictions,
  Booking as GqlBooking,
  Activity as GqlActivity,
  Chat as GqlChat,
  Message as GqlMessage,
  BookingServiceInfo,
  BookingSpecialistInfo,
  BookingUserInfo,
  ServiceInfo,
  SpecialistInfo,
  Feedback as GqlFeedback,
  Education as GqlEducation,
  Experience as GqlExperience,
  DayRestrictions,
  Restriction as GqlRestriction,
  Interval as GqlInterval,
  Format,
  BookingStatus,
  UserHat,
  Language,
  AiMessageType as GqlAiMessageType,
} from '../generated/graphql'

import type {
  Service,
  Practice,
  FormatSettings
} from '../types/service'

import type {
  User,
  Language as TypesLanguage,
  Hat,
  Tier
} from '../types/user'

import type {
  Specialist
} from '../types/specialist'

import type {
  CalendarRestrictions,
  Restriction,
  Interval
} from '../types/calendar-event'

import type {
  Booking,
  BookingSlot
} from '../types/booking'

import type {
  Chat,
  Message,
  Sender,
  AiMessageType,
  Tag
} from '../types/chats'

import type {
  Education,
  Experience
} from '../types/common'

import type {
  Feedback
} from '../types/feedback'

// ==================== SERVICE CONVERTERS ====================

export const convertServiceToGql = (service: Service): GqlService => ({
  id: service.id,
  title: service.title,
  location: service.location || null,
  description: service.description,
  contents: service.contents,
  images: service.images,
  includes: service.includes,
  specialist: {
    id: service.specialist.id,
    name: service.specialist.name,
    title: service.specialist.title,
    avatar: service.specialist.avatar || null
  },
  settings: {
    video: {
      practices: service.settings.video.practices.map(p => ({
        id: p.id,
        slots: p.slots,
        duration: p.duration,
        price: p.price
      })),
      score: service.settings.video.score,
      enabled: service.settings.video.enabled
    },
    inPerson: {
      practices: service.settings.inPerson.practices.map(p => ({
        id: p.id,
        slots: p.slots,
        duration: p.duration,
        price: p.price
      })),
      score: service.settings.inPerson.score,
      enabled: service.settings.inPerson.enabled
    }
  },
  tags: service.tags,
  reviews: service.reviews.map(r => ({
    id: r.id,
    author: r.author,
    avatar: r.avatar || null,
    comment: r.comment,
    createdAt: r.date
  })),
  bookings: service.bookings?.map(b => ({
    id: b.id,
    date: b.startTime,
    duration: b.duration,
    format: b.format as Format,
    status: b.status as BookingStatus || null,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
    isRepeat: b.isRepeat || false,
    price: b.price,
    startTime: b.startTime,
    endTime: b.endTime,
    specialist: {
      id: b.specialist.id,
      name: b.specialist.name,
      avatar: b.specialist.avatar || null
    },
    client: {
      id: b.client.id,
      name: b.client.name,
      avatar: b.client.avatar || null
    },
  })) || null,
  calendarRestrictions: service.calendarRestrictions ? convertCalendarRestrictionsToGql(service.calendarRestrictions) : null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

export const convertGqlServiceToService = (gqlService: GqlService): Service => ({
  id: gqlService.id,
  title: gqlService.title,
  location: gqlService.location || undefined,
  description: gqlService.description,
  contents: gqlService.contents,
  images: gqlService.images,
  includes: gqlService.includes,
  specialist: {
    id: gqlService.specialist.id,
    name: gqlService.specialist.name,
    title: gqlService.specialist.title,
    avatar: gqlService.specialist.avatar || ''
  },
  settings: {
    video: {
      practices: gqlService.settings.video.practices.map(p => ({
        id: p.id,
        slots: p.slots,
        duration: p.duration,
        price: p.price
      })),
      score: gqlService.settings.video.score,
      enabled: gqlService.settings.video.enabled
    },
    inPerson: {
      practices: gqlService.settings.inPerson.practices.map(p => ({
        id: p.id,
        slots: p.slots,
        duration: p.duration,
        price: p.price
      })),
      score: gqlService.settings.inPerson.score,
      enabled: gqlService.settings.inPerson.enabled
    }
  },
  tags: gqlService.tags,
  reviews: gqlService.reviews.map(r => ({
    id: r.id,
    author: r.author,
    avatar: r.avatar || undefined,
    comment: r.comment,
    date: new Date(r.createdAt)
  })),
  bookings: gqlService.bookings?.map(b => ({
    id: b.id,
    startTime: new Date(b.date),
    endTime: new Date(b.endTime),
    status: b.status as any,
    createdAt: new Date(b.createdAt),
    updatedAt: new Date(b.updatedAt),
    isRepeat: b.isRepeat,
    duration: b.duration,
    format: b.format as any,
    price: b.price,
    specialist: {
      id: b.specialist.id,
      name: b.specialist.name,
      avatar: b.specialist.avatar || undefined
    },
    client: {
      id: b.user.id,
      name: b.user.name,
      avatar: b.user.avatar || undefined
    },
  })),
  calendarRestrictions: gqlService.calendarRestrictions ? convertGqlCalendarRestrictionsToCalendarRestrictions(gqlService.calendarRestrictions) : undefined
})

export const convertServiceToCreateServiceInput = (service: Omit<Service, 'id' | 'reviews' | 'bookings' | 'calendarRestrictions'>): CreateServiceInput => ({
  title: service.title,
  location: service.location,
  description: service.description,
  contents: service.contents,
  includes: service.includes,
  settings: {
    video: {
      practices: service.settings.video.practices.map(p => ({
        slots: p.slots,
        duration: p.duration,
        price: p.price
      })),
      enabled: service.settings.video.enabled
    },
    inPerson: {
      practices: service.settings.inPerson.practices.map(p => ({
        slots: p.slots,
        duration: p.duration,
        price: p.price
      })),
      enabled: service.settings.inPerson.enabled
    }
  },
  tags: service.tags
})

export const convertServiceToUpdateServiceInput = (service: Partial<Service>): UpdateServiceInput => ({
  id: service.id,
  title: service.title,
  location: service.location,
  description: service.description,
  contents: service.contents,
  includes: service.includes,
  settings: service.settings ? {
    video: {
      practices: service.settings.video.practices.map(p => ({
        slots: p.slots,
        duration: p.duration,
        price: p.price
      })),
      enabled: service.settings.video.enabled
    },
    inPerson: {
      practices: service.settings.inPerson.practices.map(p => ({
        slots: p.slots,
        duration: p.duration,
        price: p.price
      })),
      enabled: service.settings.inPerson.enabled
    }
  } : undefined,
  tags: service.tags
})

// ==================== USER CONVERTERS ====================

export const convertUserToGql = (user: User): GqlUser => ({
  id: user.id,
  email: user.email.address,
  bio: user.bio,
  name: user.name,
  location: user.location,
  avatar: user.avatar || null,
  timezone: user.timezone,
  createdAt: user.createdAt.toISOString(),
  education: user.education.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description,
    certificate: e.certificate || null
  })),
  certificates: user.certifcates.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description,
    certificate: e.certificate || null
  })),
  experience: user.experience.map(e => ({
    id: e.id,
    description: e.description
  })),
  specialistProfile: user.specialistProfile ? convertSpecialistToGql(user.specialistProfile) : null,
  isSpecialist: user.isSpecialist,
  hat: user.hat.toUpperCase() as UserHat,
  tier: user.tier.toUpperCase() as any,
  practice: user.practice
})

export const convertGqlUserToUser = (gqlUser: GqlUser): User => ({
  id: gqlUser.id,
  email: {
    address: gqlUser.email
  },
  bio: gqlUser.bio,
  name: gqlUser.name,
  location: gqlUser.location,
  avatar: gqlUser.avatar || undefined,
  timezone: gqlUser.timezone,
  createdAt: new Date(gqlUser.createdAt),
  preferences: gqlUser.preferences ? {
    language: gqlUser.preferences.language.toLowerCase() as TypesLanguage
  } : undefined,
  education: gqlUser.education.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description,
    certificate: e.certificate || undefined
  })),
  certifcates: gqlUser.certificates.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description,
    certificate: e.certificate || undefined
  })),
  experience: gqlUser.experience.map(e => ({
    id: e.id,
    description: e.description
  })),
  specialistProfile: gqlUser.specialistProfile ? convertGqlSpecialistToSpecialist(gqlUser.specialistProfile) : undefined,
  isSpecialist: gqlUser.isSpecialist,
  hat: gqlUser.hat.toLowerCase() as Hat,
  tier: gqlUser.tier.toLowerCase() as Tier,
  practice: gqlUser.practice
})

export const convertUserToUpdateUserInput = (user: Partial<User>): UpdateUserInput => ({
  email: user.email?.address,
  bio: user.bio,
  name: user.name,
  location: user.location,
  avatar: user.avatar,
  education: user.education?.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description,
    certificate: e.certificate
  })),
  certificates: user.certifcates?.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description,
    certificate: e.certificate
  })),
  experience: user.experience?.map(e => ({
    id: e.id,
    description: e.description
  }))
})

// ==================== SPECIALIST CONVERTERS ====================

export const convertSpecialistToGql = (specialist: Specialist): SpecialistProfile => ({
  id: specialist.id,
  name: specialist.name,
  title: specialist.title,
  avatar: specialist.avatar || null,
  practices: specialist.practices,
  location: specialist.location,
  description: specialist.description,
  specialties: specialist.specialties,
  education: specialist.education.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description,
    certificate: e.certificate || null
  })),
  certificates: specialist.certificates.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description,
    certificate: e.certificate || null
  })),
  experience: specialist.experience.map(e => ({
    id: e.id,
    description: e.description
  })),
  services: specialist.services.map(s => ({
    id: s.id,
    title: s.title,
    location: s.location || null,
    description: s.description,
    contents: s.contents,
    images: s.images,
    includes: s.includes,
    settings: {
      video: {
        practices: s.settings.video.practices.map(p => ({
          id: p.id,
          slots: p.slots,
          duration: p.duration,
          price: p.price
        })),
        score: s.settings.video.score,
        enabled: s.settings.video.enabled
      },
      inPerson: {
        practices: s.settings.inPerson.practices.map(p => ({
          id: p.id,
          slots: p.slots,
          duration: p.duration,
          price: p.price
        })),
        score: s.settings.inPerson.score,
        enabled: s.settings.inPerson.enabled
      }
    },
    tags: s.tags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })),
  skills: specialist.skills,
  likes: specialist.likes,
  isLiked: specialist.isLiked || null,
  rate5: specialist.rate5 || null
})

export const convertGqlSpecialistToSpecialist = (gqlSpecialist: SpecialistProfile): Specialist => ({
  id: gqlSpecialist.id,
  name: gqlSpecialist.name,
  title: gqlSpecialist.title,
  avatar: gqlSpecialist.avatar || '',
  practices: gqlSpecialist.practices,
  location: gqlSpecialist.location,
  description: gqlSpecialist.description,
  specialties: gqlSpecialist.specialties,
  education: gqlSpecialist.education.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description,
    certificate: e.certificate || undefined
  })),
  certificates: gqlSpecialist.certificates.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description,
    certificate: e.certificate || undefined
  })),
  experience: gqlSpecialist.experience.map(e => ({
    id: e.id,
    description: e.description
  })),
  services: gqlSpecialist.services.map(s => ({
    id: s.id,
    title: s.title,
    location: s.location || undefined,
    description: s.description,
    contents: s.contents,
    images: s.images,
    includes: s.includes,
    specialist: {
      id: gqlSpecialist.id,
      name: gqlSpecialist.name,
      title: gqlSpecialist.title,
      avatar: gqlSpecialist.avatar || ''
    },
    settings: {
      video: {
        practices: s.settings.video.practices.map(p => ({
          id: p.id,
          slots: p.slots,
          duration: p.duration,
          price: p.price
        })),
        score: s.settings.video.score,
        enabled: s.settings.video.enabled
      },
      inPerson: {
        practices: s.settings.inPerson.practices.map(p => ({
          id: p.id,
          slots: p.slots,
          duration: p.duration,
          price: p.price
        })),
        score: s.settings.inPerson.score,
        enabled: s.settings.inPerson.enabled
      }
    },
    tags: s.tags,
    reviews: [],
    bookings: undefined,
    calendarRestrictions: undefined
  })),
  skills: gqlSpecialist.skills,
  likes: gqlSpecialist.likes,
  isLiked: gqlSpecialist.isLiked || undefined,
  rate5: gqlSpecialist.rate5 || undefined
})

export const convertSpecialistToUpdateSpecialistInput = (specialist: Partial<Specialist>): UpdateSpecialistInput => ({
  id: specialist.id,
  name: specialist.name,
  title: specialist.title,
  avatar: specialist.avatar,
  location: specialist.location,
  description: specialist.description,
  specialties: specialist.specialties,
  skills: specialist.skills,
  education: specialist.education?.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description,
    certificate: e.certificate
  })),
  certificates: specialist.certificates?.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description,
    certificate: e.certificate
  })),
  experience: specialist.experience?.map(e => ({
    id: e.id,
    description: e.description
  }))
})

export const convertGqlSpecialistsToSpecialists = (gqlSpecialists: SpecialistProfile[]): Specialist[] => {
  return gqlSpecialists.map(convertGqlSpecialistToSpecialist)
}

// ==================== CALENDAR RESTRICTIONS CONVERTERS ====================

export const convertCalendarRestrictionsToGql = (restrictions: CalendarRestrictions): GqlCalendarRestrictions => ({
  id: 'temp-id', // This should be provided or generated
  gmt: restrictions.gmt,
  commons: {
    Mon: convertRestrictionToGql(restrictions.commons.Mon),
    Tue: convertRestrictionToGql(restrictions.commons.Tue),
    Wed: convertRestrictionToGql(restrictions.commons.Wed),
    Thu: convertRestrictionToGql(restrictions.commons.Thu),
    Fri: convertRestrictionToGql(restrictions.commons.Fri),
    Sat: convertRestrictionToGql(restrictions.commons.Sat),
    Sun: convertRestrictionToGql(restrictions.commons.Sun)
  },
  restrictions: restrictions.restrictions.map(convertRestrictionToGql),
  location: restrictions.location || null
})

export const convertGqlCalendarRestrictionsToCalendarRestrictions = (gqlRestrictions: GqlCalendarRestrictions): CalendarRestrictions => ({
  gmt: gqlRestrictions.gmt,
  commons: {
    Mon: convertGqlRestrictionToRestriction(gqlRestrictions.commons.Mon),
    Tue: convertGqlRestrictionToRestriction(gqlRestrictions.commons.Tue),
    Wed: convertGqlRestrictionToRestriction(gqlRestrictions.commons.Wed),
    Thu: convertGqlRestrictionToRestriction(gqlRestrictions.commons.Thu),
    Fri: convertGqlRestrictionToRestriction(gqlRestrictions.commons.Fri),
    Sat: convertGqlRestrictionToRestriction(gqlRestrictions.commons.Sat),
    Sun: convertGqlRestrictionToRestriction(gqlRestrictions.commons.Sun)
  },
  restrictions: gqlRestrictions.restrictions.map(convertGqlRestrictionToRestriction),
  location: gqlRestrictions.location || undefined
})

const convertRestrictionToGql = (restriction: Restriction): GqlRestriction => ({
  id: restriction.id,
  date: restriction.date.toISOString() || null,
  isActive: restriction.isActive,
  intervals: restriction.intervals.map(i => ({
    start: i.start.toISOString(),
    end: i.end.toISOString(),
    formats: i.formats
  })),
  isPractice: restriction.isPractice
})

const convertGqlRestrictionToRestriction = (gqlRestriction: GqlRestriction): Restriction => ({
  id: gqlRestriction.id,
  date: gqlRestriction.date ? new Date(gqlRestriction.date) : undefined,
  isActive: gqlRestriction.isActive,
  intervals: gqlRestriction.intervals.map(i => ({
    start: new Date(i.start),
    end: new Date(i.end),
    formats: i.formats
  })),
  isPractice: gqlRestriction.isPractice
})

// ==================== BOOKING CONVERTERS ====================

export const convertGqlBookingsToBookings = (gqlBookings: GqlBooking[]): Booking[] => {
  return gqlBookings.map(booking => ({
    id: booking.id,
    service: booking.service ? {
      id: booking.service.id,
      title: booking.service.title,
      description: booking.service.description,
      duration: 0 // Not available in BookingServiceInfo
    } : {
      id: '',
      title: '',
      description: '',
      duration: 0
    },
    specialist: booking.specialist ? {
      id: booking.specialist.id,
      name: booking.specialist.name,
      avatar: booking.specialist.avatar || undefined
    } : {
      id: '',
      name: '',
      avatar: undefined
    },
    client: booking.user ? {
      id: booking.user.id,
      name: booking.user.name,
      avatar: booking.user.avatar || undefined
    }: {
      id: '',
      name: '',
      avatar: undefined
    },
    date: new Date(booking.date),
    duration: booking.duration,
    slots: 1, // Default value, not available in GQL
    format: booking.format as any,
    status: booking.status as any,
    createdAt: new Date(booking.createdAt),
    updatedAt: new Date(booking.updatedAt),
    isRepeat: booking.isRepeat,
    price: booking.price
  }))
}

export const convertGqlActivitiesToBookings = (gqlActivities: GqlActivity[]): Booking[] => {
  return gqlActivities.map(activity => ({
    id: activity.id,
    service: activity.service ? {
      id: activity.service.id,
      title: activity.service.title,
      description: activity.service.description,
      duration: 0 // Not available in BookingServiceInfo
    } : {
      id: '',
      title: '',
      description: '',
      duration: 0
    },
    specialist: activity.specialist ? {
      id: activity.specialist.id,
      name: activity.specialist.name,
      avatar: activity.specialist.avatar || undefined
    } : {
      id: '',
      name: '',
      avatar: undefined
    },
    client: activity.user ? {
      id: activity.user.id,
      name: activity.user.name,
      avatar: activity.user.avatar || undefined
    }: {
      id: '',
      name: '',
      avatar: undefined
    },
    date: new Date(activity.date),
    duration: activity.duration,
    slots: 1, // Default value, not available in GQL
    format: activity.format as any,
    status: activity.status as any,
    createdAt: new Date(activity.createdAt),
    updatedAt: new Date(activity.updatedAt),
    isRepeat: activity.isRepeat,
    price: activity.price
  }))
}

// ==================== CHAT CONVERTERS ====================

export const convertChatToGql = (chat: Chat): GqlChat => ({
  id: chat.id,
  isAiChat: chat.isAI || false,
  messages: chat.messages.map(convertMessageToGql),
  specialistId: chat.specialistId || null,
  timestamp: new Date(chat.timestamp).toISOString(),
  status: chat.status as BookingStatus || null,
  description: chat.description || null,
  hasNew: chat.hasNew || false,
  avatar: chat.avatar || null
})

export const convertGqlChatToChat = (gqlChat: GqlChat): Chat => ({
  id: gqlChat.id,
  title: '', // Not available in GQL Chat
  specialistId: gqlChat.specialistId || undefined,
  serviceId: undefined, // Not available in GQL Chat
  avatar: gqlChat.avatar || undefined,
  isAI: gqlChat.isAiChat,
  isAIEnabled: undefined, // Not available in GQL Chat
  status: gqlChat.status as any,
  timestamp: new Date(gqlChat.timestamp).getTime(),
  messages: gqlChat.messages.map(convertGqlMessageToMessage),
  createdAt: new Date(gqlChat.timestamp).getTime(),
  hasNew: gqlChat.hasNew,
  description: gqlChat.description || undefined,
  isSpecialChat: undefined // Not available in GQL Chat
})

const convertMessageToGql = (message: Message): GqlMessage => ({
  id: message.id,
  content: message.content || '',
  timestamp: new Date(message.timestamp).toISOString(),
  isFromUser: message.type === 'user',
  chatId: message.id, // Using message id as chatId
  createdAt: new Date(message.timestamp).toISOString(),
  updatedAt: new Date(message.timestamp).toISOString(),
  footerContent: message.footerContent || null,
  aiMessageType: message.aiMessageType ? convertAiMessageTypeToGql(message.aiMessageType) : null,
  specialistIDs: message.specialists?.map(s => s.id) || null
})

const convertGqlMessageToMessage = (gqlMessage: GqlMessage): Message => ({
  id: gqlMessage.id,
  type: gqlMessage.isFromUser ? 'user' : 'assistant' as Sender,
  content: gqlMessage.content || undefined,
  timestamp: new Date(gqlMessage.timestamp).getTime(),
  specialists: undefined, // Not available in GQL Message
  services: undefined, // Not available in GQL Message
  files: undefined, // Not available in GQL Message
  replyTo: undefined, // Not available in GQL Message
  aiMessageType: gqlMessage.aiMessageType ? convertGqlAiMessageTypeToAiMessageType(gqlMessage.aiMessageType) : undefined,
  tags: undefined, // Not available in GQL Message
  footerContent: gqlMessage.footerContent || undefined,
  bookingFrame: undefined, // Not available in GQL Message
  bookingTextTitle: undefined, // Not available in GQL Message
  testQuestion: undefined, // Not available in GQL Message
  questionIndex: undefined // Not available in GQL Message
})

const convertAiMessageTypeToGql = (type: AiMessageType): GqlAiMessageType => {
  switch (type) {
    case 'info': return 'INFO'
    case 'warning': return 'WARNING'
    case 'service': return 'SERVICE'
    case 'booking': return 'BOOKING'
    default: return 'INFO'
  }
}

const convertGqlAiMessageTypeToAiMessageType = (type: GqlAiMessageType): AiMessageType => {
  switch (type) {
    case 'INFO': return 'info'
    case 'WARNING': return 'warning'
    case 'SERVICE': return 'service'
    case 'BOOKING': return 'become-specialist-drops'
    default: return 'info'
  }
}
