// ==================== USER TYPES ====================

export interface User {
  id: string;
  email: {
    address: string;
  };
  bio: string;
  name: string;
  location: string;
  avatar?: string;
  timezone: string;
  createdAt: string;
  preferences?: {
    language: 'RU' | 'EN';
  };
  education: Education[];
  certificates: Education[];
  experience: Experience[];
  specialistProfile?: Specialist;
  isSpecialist: boolean;
  hat: 'MASTER' | 'ADEPT' | 'SUPERVISER';
  tier: 'UNLIMITED' | 'PREMIUM' | 'BASIC';
  practice: number;
}

export interface UserStats {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalEarnings: number;
  averageRating: number;
  reviewsCount: number;
}

// ==================== SPECIALIST TYPES ====================

export interface Specialist {
  id: string;
  name: string;
  title: string;
  avatar: string;
  practices: number;
  location: string;
  description: string;
  specialties: string[];
  education: Education[];
  certificates: Education[];
  experience: Experience[];
  services?: Service[];
  skills: string[];
  likes: number;
  isLiked?: boolean;
  rate5?: number;
}

// ==================== SERVICE TYPES ====================

export interface Service {
  id: string;
  title: string;
  location?: string;
  description: string;
  contents: string;
  images: string[];
  includes: string[];
  specialist: ServiceSpecialist;
  settings: ServiceSettings;
  tags: string[];
  reviews: Feedback[];
  bookings?: Booking[];
  calendarRestrictions?: CalendarRestrictions;
}

export interface ServiceSpecialist {
  id: string;
  name: string;
  title: string;
  avatar: string;
}

export interface ServiceSettings {
  video: FormatSettings;
  inPerson: FormatSettings;
}

export interface FormatSettings {
  practices: Practice[];
  score: number;
  enabled: boolean;
}

export interface Practice {
  id: string;
  slots: number;
  duration: number;
  price: number;
}

// ==================== BOOKING TYPES ====================

export interface Booking {
  id: string;
  service: BookingService;
  specialist: BookingSpecialist;
  date: string;
  duration: number;
  slots: number;
  format: 'VIDEO' | 'IN_PERSON';
  status?: 'WAITING' | 'CONFIRMED' | 'REQUEST';
  createdAt: string;
  updatedAt: string;
  isRepeat?: boolean;
  price: number;
}

export interface BookingService {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
}

export interface BookingSpecialist {
  id: string;
  name: string;
  avatar?: string;
  practiceCount: number;
}

export interface BookingSlot {
  date: string;
  slots: number;
}

// ==================== CHAT TYPES ====================

export interface Chat {
  id: string;
  title: string;
  specialistId?: string;
  serviceId?: string;
  avatar?: string;
  isAI?: boolean;
  isAIEnabled?: boolean;
  status?: 'WAITING' | 'CONFIRMED' | 'REQUEST' | 'DECLINED';
  timestamp: number;
  isMuted?: boolean;
  messages: Message[];
  createdAt: number;
  hasNew?: boolean;
  description?: string;
  isSpecialChat?: 'BECOME_SPECIALIST';
}

export interface Message {
  id: string;
  type: 'USER' | 'ASSISTANT' | 'SPECIALIST';
  content: string;
  timestamp: number;
  specialists?: Specialist[];
  services?: Service[];
  files?: File[];
  replyTo?: string;
  aiMessageType?: 'INFO' | 'WARNING' | 'SERVICE' | 'BECOME_SPECIALIST_DROPS' | 'ACCEPT_POLICY' | 'DROPS_OR_INPUT' | 'PROFILE_TEST' | 'VERSION_TEST';
  tags?: Tag[];
  footerContent?: string;
  bookingFrame?: boolean;
  bookingTextTitle?: string;
  testQuestion?: string;
  questionIndex?: number;
}

export interface File {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface Tag {
  name: string;
  subtags?: Tag[];
}

// ==================== FEEDBACK TYPES ====================

export interface Feedback {
  id: string;
  rating: number;
  comment: string;
  author: string;
  createdAt: string;
}

// ==================== CALENDAR TYPES ====================

export interface CalendarRestrictions {
  id: string;
  timezone: string;
  workingHours: WorkingHours;
  exceptions: Exception[];
  formats: ('VIDEO' | 'IN_PERSON')[];
}

export interface WorkingHours {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
}

export interface DaySchedule {
  isWorking: boolean;
  startTime?: string;
  endTime?: string;
}

export interface Exception {
  id: string;
  date: string;
  isWorking: boolean;
  startTime?: string;
  endTime?: string;
}

// ==================== DASHBOARD TYPES ====================

export interface DashboardStats {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalEarnings: number;
  averageRating: number;
  reviewsCount: number;
  upcomingBookings: Booking[];
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  type: 'BOOKING_CREATED' | 'BOOKING_CONFIRMED' | 'BOOKING_CANCELLED' | 'PAYMENT_RECEIVED' | 'REVIEW_RECEIVED';
  title: string;
  description: string;
  timestamp: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

// ==================== SEARCH TYPES ====================

export interface SearchResult {
  specialists: Specialist[];
  services: Service[];
  total: number;
  hasMore: boolean;
}

// ==================== COMMON TYPES ====================

export interface Education {
  title: string;
  description: string;
  certificate?: string;
}

export interface Experience {
  description: string;
}

// ==================== INPUT TYPES ====================

export interface CreateUserInput {
  email: string;
  name: string;
  bio: string;
  location: string;
  timezone: string;
  avatar?: File;
  preferences?: UserPreferencesInput;
}

export interface UserPreferencesInput {
  language: 'RU' | 'EN';
}

export interface UpdateUserInput {
  name?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  avatar?: File;
  preferences?: UserPreferencesInput;
}

export interface CreateSpecialistInput {
  name: string;
  title: string;
  avatar: File;
  location: string;
  description: string;
  specialties: string[];
  education: EducationInput[];
  certificates: EducationInput[];
  experience: ExperienceInput[];
  skills: string[];
}

export interface UpdateSpecialistInput {
  name?: string;
  title?: string;
  avatar?: File;
  location?: string;
  description?: string;
  specialties?: string[];
  education?: EducationInput[];
  certificates?: EducationInput[];
  experience?: ExperienceInput[];
  skills?: string[];
}

export interface EducationInput {
  title: string;
  description: string;
  certificate?: string;
}

export interface ExperienceInput {
  description: string;
}

export interface CreateServiceInput {
  title: string;
  description: string;
  contents: string;
  location?: string;
  images?: File[];
  includes: string[];
  settings: ServiceSettingsInput;
  tags: string[];
}

export interface ServiceSettingsInput {
  video: FormatSettingsInput;
  inPerson: FormatSettingsInput;
}

export interface FormatSettingsInput {
  practices: PracticeInput[];
  score: number;
  enabled: boolean;
}

export interface PracticeInput {
  slots: number;
  duration: number;
  price: number;
}

export interface UpdateServiceInput {
  title?: string;
  description?: string;
  contents?: string;
  location?: string;
  images?: File[];
  includes?: string[];
  settings?: ServiceSettingsInput;
  tags?: string[];
}

export interface CreateBookingInput {
  serviceId: string;
  specialistId: string;
  date: string;
  duration: number;
  slots: number;
  format: 'VIDEO' | 'IN_PERSON';
  isRepeat?: boolean;
}

export interface UpdateBookingInput {
  date?: string;
  duration?: number;
  slots?: number;
  format?: 'VIDEO' | 'IN_PERSON';
  status?: 'WAITING' | 'CONFIRMED' | 'REQUEST';
}

export interface CreateChatInput {
  title: string;
  specialistId?: string;
  serviceId?: string;
  isAI?: boolean;
}

export interface SendMessageInput {
  chatId: string;
  content: string;
  type: 'USER' | 'ASSISTANT' | 'SPECIALIST';
  files?: File[];
  replyTo?: string;
  aiMessageType?: 'INFO' | 'WARNING' | 'SERVICE' | 'BECOME_SPECIALIST_DROPS' | 'ACCEPT_POLICY' | 'DROPS_OR_INPUT' | 'PROFILE_TEST' | 'VERSION_TEST';
}

export interface UpdateChatInput {
  title?: string;
  isMuted?: boolean;
  isAIEnabled?: boolean;
}

export interface CreateFeedbackInput {
  serviceId: string;
  specialistId: string;
  rating: number;
  comment: string;
}

export interface UpdateFeedbackInput {
  rating?: number;
  comment?: string;
}

export interface SearchInput {
  query: string;
  filters?: SearchFiltersInput;
  pagination: PaginationInput;
}

export interface SearchFiltersInput {
  format?: 'VIDEO' | 'IN_PERSON';
  priceRange?: PriceRangeInput;
  location?: string;
  tags?: string[];
  rating?: number;
}

export interface PriceRangeInput {
  min?: number;
  max?: number;
}

export interface PaginationInput {
  page: number;
  limit: number;
}

// ==================== QUERY RESPONSE TYPES ====================

export interface GetMeResponse {
  me: User;
}

export interface GetUserResponse {
  user: User;
}

export interface GetUserStatsResponse {
  userStats: UserStats;
}

export interface GetSpecialistsResponse {
  specialists: Specialist[];
}

export interface GetSpecialistResponse {
  specialist: Specialist;
}

export interface GetServicesResponse {
  services: Service[];
}

export interface GetServiceResponse {
  service: Service;
}

export interface GetBookingsResponse {
  bookings: Booking[];
}

export interface GetBookingResponse {
  booking: Booking;
}

export interface GetAvailableSlotsResponse {
  availableSlots: BookingSlot[];
}

export interface GetChatsResponse {
  chats: Chat[];
}

export interface GetChatResponse {
  chat: Chat;
}

export interface GetMessagesResponse {
  messages: Message[];
}

export interface GetDashboardStatsResponse {
  dashboardStats: DashboardStats;
}

export interface SearchResponse {
  search: SearchResult;
}

// ==================== MUTATION RESPONSE TYPES ====================

export interface CreateUserResponse {
  createUser: User;
}

export interface UpdateUserResponse {
  updateUser: User;
}

export interface DeleteUserResponse {
  deleteUser: boolean;
}

export interface CreateSpecialistResponse {
  createSpecialist: Specialist;
}

export interface UpdateSpecialistResponse {
  updateSpecialist: Specialist;
}

export interface DeleteSpecialistResponse {
  deleteSpecialist: boolean;
}

export interface LikeSpecialistResponse {
  likeSpecialist: boolean;
}

export interface UnlikeSpecialistResponse {
  unlikeSpecialist: boolean;
}

export interface CreateServiceResponse {
  createService: Service;
}

export interface UpdateServiceResponse {
  updateService: Service;
}

export interface DeleteServiceResponse {
  deleteService: boolean;
}

export interface CreateBookingResponse {
  createBooking: Booking;
}

export interface UpdateBookingResponse {
  updateBooking: Booking;
}

export interface CancelBookingResponse {
  cancelBooking: Booking;
}

export interface ConfirmBookingResponse {
  confirmBooking: Booking;
}

export interface CreateChatResponse {
  createChat: Chat;
}

export interface SendMessageResponse {
  sendMessage: Message;
}

export interface UpdateChatResponse {
  updateChat: Chat;
}

export interface DeleteChatResponse {
  deleteChat: boolean;
}

export interface CreateFeedbackResponse {
  createFeedback: Feedback;
}

export interface UpdateFeedbackResponse {
  updateFeedback: Feedback;
}

export interface DeleteFeedbackResponse {
  deleteFeedback: boolean;
}

// ==================== SUBSCRIPTION TYPES ====================

export interface MessageAddedResponse {
  messageAdded: Message;
}

export interface BookingUpdatedResponse {
  bookingUpdated: Booking;
}

export interface ChatUpdatedResponse {
  chatUpdated: Chat;
}
