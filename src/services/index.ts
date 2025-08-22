// ==================== GRAPHQL SCHEMA ====================
export * from './schema.graphqls';

// ==================== GRAPHQL QUERIES ====================
export {
  // User queries
  GET_ME,
  GET_USER,
  GET_USER_STATS,
  
  // Specialist queries
  GET_SPECIALISTS,
  GET_SPECIALIST,
  
  // Service queries
  GET_SERVICES,
  GET_SERVICE,
  
  // Booking queries
  GET_BOOKINGS,
  GET_BOOKING,
  GET_AVAILABLE_SLOTS,
  
  // Chat queries
  GET_CHATS,
  GET_CHAT,
  GET_MESSAGES,
  
  // Dashboard queries
  GET_DASHBOARD_STATS,
  
  // Search queries
  SEARCH,
  
  // User mutations
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
  
  // Specialist mutations
  CREATE_SPECIALIST,
  UPDATE_SPECIALIST,
  DELETE_SPECIALIST,
  LIKE_SPECIALIST,
  UNLIKE_SPECIALIST,
  
  // Service mutations
  CREATE_SERVICE,
  UPDATE_SERVICE,
  DELETE_SERVICE,
  
  // Booking mutations
  CREATE_BOOKING,
  UPDATE_BOOKING,
  CANCEL_BOOKING,
  CONFIRM_BOOKING,
  
  // Chat mutations
  CREATE_CHAT,
  SEND_MESSAGE,
  UPDATE_CHAT,
  DELETE_CHAT,
  
  // Feedback mutations
  CREATE_FEEDBACK,
  UPDATE_FEEDBACK,
  DELETE_FEEDBACK,
  
  // Subscriptions
  MESSAGE_ADDED,
  BOOKING_UPDATED,
  CHAT_UPDATED,
} from './graphql-queries';

// ==================== GRAPHQL TYPES ====================
export {
  // Core types
  User,
  UserStats,
  Specialist,
  Service,
  ServiceSpecialist,
  ServiceSettings,
  FormatSettings,
  Practice,
  Booking,
  BookingService,
  BookingSpecialist,
  BookingSlot,
  Chat,
  Message,
  File,
  Tag,
  Feedback,
  CalendarRestrictions,
  WorkingHours,
  DaySchedule,
  Exception,
  DashboardStats,
  Activity,
  SearchResult,
  Education,
  Experience,
  
  // Input types
  CreateUserInput,
  UpdateUserInput,
  UserPreferencesInput,
  CreateSpecialistInput,
  UpdateSpecialistInput,
  EducationInput,
  ExperienceInput,
  CreateServiceInput,
  UpdateServiceInput,
  ServiceSettingsInput,
  FormatSettingsInput,
  PracticeInput,
  CreateBookingInput,
  UpdateBookingInput,
  CreateChatInput,
  SendMessageInput,
  UpdateChatInput,
  CreateFeedbackInput,
  UpdateFeedbackInput,
  SearchInput,
  SearchFiltersInput,
  PriceRangeInput,
  PaginationInput,
  
  // Response types
  GetMeResponse,
  GetUserResponse,
  GetUserStatsResponse,
  GetSpecialistsResponse,
  GetSpecialistResponse,
  GetServicesResponse,
  GetServiceResponse,
  GetBookingsResponse,
  GetBookingResponse,
  GetAvailableSlotsResponse,
  GetChatsResponse,
  GetChatResponse,
  GetMessagesResponse,
  GetDashboardStatsResponse,
  SearchResponse,
  CreateUserResponse,
  UpdateUserResponse,
  DeleteUserResponse,
  CreateSpecialistResponse,
  UpdateSpecialistResponse,
  DeleteSpecialistResponse,
  LikeSpecialistResponse,
  UnlikeSpecialistResponse,
  CreateServiceResponse,
  UpdateServiceResponse,
  DeleteServiceResponse,
  CreateBookingResponse,
  UpdateBookingResponse,
  CancelBookingResponse,
  ConfirmBookingResponse,
  CreateChatResponse,
  SendMessageResponse,
  UpdateChatResponse,
  DeleteChatResponse,
  CreateFeedbackResponse,
  UpdateFeedbackResponse,
  DeleteFeedbackResponse,
  MessageAddedResponse,
  BookingUpdatedResponse,
  ChatUpdatedResponse,
} from './graphql-types';

// ==================== GRAPHQL HOOKS ====================
export {
  // User hooks
  useGetMe,
  useGetUser,
  useGetUserStats,
  
  // Specialist hooks
  useGetSpecialists,
  useGetSpecialist,
  
  // Service hooks
  useGetServices,
  useGetService,
  
  // Booking hooks
  useGetBookings,
  useGetBooking,
  useGetAvailableSlots,
  
  // Chat hooks
  useGetChats,
  useGetChat,
  useGetMessages,
  
  // Dashboard hooks
  useGetDashboardStats,
  
  // Search hooks
  useSearch,
  
  // User mutation hooks
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  
  // Specialist mutation hooks
  useCreateSpecialist,
  useUpdateSpecialist,
  useDeleteSpecialist,
  useLikeSpecialist,
  useUnlikeSpecialist,
  
  // Service mutation hooks
  useCreateService,
  useUpdateService,
  useDeleteService,
  
  // Booking mutation hooks
  useCreateBooking,
  useUpdateBooking,
  useCancelBooking,
  useConfirmBooking,
  
  // Chat mutation hooks
  useCreateChat,
  useSendMessage,
  useUpdateChat,
  useDeleteChat,
  
  // Feedback mutation hooks
  useCreateFeedback,
  useUpdateFeedback,
  useDeleteFeedback,
  
  // Subscription hooks
  useMessageAdded,
  useBookingUpdated,
  useChatUpdated,
  
  // Utility hooks
  useOptimisticUpdate,
  useCachedQuery,
  useLazyCachedQuery,
} from './graphql-hooks';

// ==================== GRAPHQL EXAMPLES ====================
export {
  UserProfile,
  SpecialistsList,
  ServicesList,
  BookingComponent,
  ChatComponent,
  SearchComponent,
  OptimisticLikeButton,
  DashboardComponent,
} from './graphql-examples';

// ==================== UTILITY FUNCTIONS ====================

/**
 * Helper function to format GraphQL errors
 */
export const formatGraphQLError = (error: any): string => {
  if (error?.graphQLErrors?.length > 0) {
    return error.graphQLErrors.map((e: any) => e.message).join(', ');
  }
  if (error?.networkError) {
    return `Network error: ${error.networkError.message}`;
  }
  return error?.message || 'Unknown error occurred';
};

/**
 * Helper function to check if a GraphQL error is a network error
 */
export const isNetworkError = (error: any): boolean => {
  return !!error?.networkError;
};

/**
 * Helper function to check if a GraphQL error is a validation error
 */
export const isValidationError = (error: any): boolean => {
  return error?.graphQLErrors?.some((e: any) => e.extensions?.code === 'BAD_USER_INPUT');
};

/**
 * Helper function to check if a GraphQL error is an authentication error
 */
export const isAuthError = (error: any): boolean => {
  return error?.graphQLErrors?.some((e: any) => e.extensions?.code === 'UNAUTHENTICATED');
};

/**
 * Helper function to check if a GraphQL error is an authorization error
 */
export const isForbiddenError = (error: any): boolean => {
  return error?.graphQLErrors?.some((e: any) => e.extensions?.code === 'FORBIDDEN');
};

/**
 * Helper function to create pagination variables
 */
export const createPaginationVariables = (page: number = 1, limit: number = 10) => ({
  pagination: { page, limit },
});

/**
 * Helper function to create search filters
 */
export const createSearchFilters = (filters: {
  format?: 'VIDEO' | 'IN_PERSON';
  priceRange?: { min?: number; max?: number };
  location?: string;
  tags?: string[];
  rating?: number;
}) => filters;

/**
 * Helper function to create date range variables
 */
export const createDateRangeVariables = (dateFrom: string, dateTo: string) => ({
  dateFrom,
  dateTo,
});

/**
 * Helper function to format date for GraphQL
 */
export const formatDateForGraphQL = (date: Date): string => {
  return date.toISOString();
};

/**
 * Helper function to parse GraphQL date
 */
export const parseGraphQLDate = (dateString: string): Date => {
  return new Date(dateString);
};

/**
 * Helper function to create optimistic response for like/unlike
 */
export const createOptimisticLikeResponse = (specialistId: string, isLiked: boolean) => ({
  likeSpecialist: isLiked,
  unlikeSpecialist: !isLiked,
});

/**
 * Helper function to create optimistic response for booking status
 */
export const createOptimisticBookingStatusResponse = (bookingId: string, status: string) => ({
  updateBooking: {
    id: bookingId,
    status,
    updatedAt: new Date().toISOString(),
  },
});

/**
 * Helper function to create optimistic response for message
 */
export const createOptimisticMessageResponse = (message: any) => ({
  sendMessage: {
    id: `temp-${Date.now()}`,
    ...message,
    timestamp: Date.now(),
  },
});

// ==================== CONSTANTS ====================

export const GRAPHQL_ENDPOINTS = {
  HTTP: process.env.NEXT_PUBLIC_GRAPHQL_HTTP_URL || 'http://localhost:4000/graphql',
  WS: process.env.NEXT_PUBLIC_GRAPHQL_WS_URL || 'ws://localhost:4000/graphql',
} as const;

export const PAGINATION_DEFAULTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const CACHE_POLICIES = {
  CACHE_FIRST: 'cache-first',
  CACHE_AND_NETWORK: 'cache-and-network',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only',
  NO_CACHE: 'no-cache',
} as const;

export const ERROR_CODES = {
  BAD_USER_INPUT: 'BAD_USER_INPUT',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  FORBIDDEN: 'FORBIDDEN',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  GRAPHQL_PARSE_FAILED: 'GRAPHQL_PARSE_FAILED',
  GRAPHQL_VALIDATION_FAILED: 'GRAPHQL_VALIDATION_FAILED',
} as const;

// ==================== TYPE GUARDS ====================

export const isUser = (obj: any): obj is User => {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string';
};

export const isSpecialist = (obj: any): obj is Specialist => {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string' && Array.isArray(obj.specialties);
};

export const isService = (obj: any): obj is Service => {
  return obj && typeof obj.id === 'string' && typeof obj.title === 'string' && Array.isArray(obj.tags);
};

export const isBooking = (obj: any): obj is Booking => {
  return obj && typeof obj.id === 'string' && typeof obj.date === 'string' && obj.service;
};

export const isChat = (obj: any): obj is Chat => {
  return obj && typeof obj.id === 'string' && typeof obj.title === 'string' && Array.isArray(obj.messages);
};

export const isMessage = (obj: any): obj is Message => {
  return obj && typeof obj.id === 'string' && typeof obj.content === 'string' && typeof obj.timestamp === 'number';
};
