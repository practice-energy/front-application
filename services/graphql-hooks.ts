import { useQuery, useMutation, useSubscription, useLazyQuery } from '@apollo/client';
import {
  // Queries
  GET_ME,
  GET_USER,
  GET_USER_STATS,
  GET_SPECIALISTS,
  GET_SPECIALIST,
  GET_SERVICES,
  GET_SERVICE,
  GET_BOOKINGS,
  GET_BOOKING,
  GET_AVAILABLE_SLOTS,
  GET_CHATS,
  GET_CHAT,
  GET_MESSAGES,
  GET_DASHBOARD_STATS,
  SEARCH,
  
  // Mutations
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
  CREATE_SPECIALIST,
  UPDATE_SPECIALIST,
  DELETE_SPECIALIST,
  LIKE_SPECIALIST,
  UNLIKE_SPECIALIST,
  CREATE_SERVICE,
  UPDATE_SERVICE,
  DELETE_SERVICE,
  CREATE_BOOKING,
  UPDATE_BOOKING,
  CANCEL_BOOKING,
  CONFIRM_BOOKING,
  CREATE_CHAT,
  SEND_MESSAGE,
  UPDATE_CHAT,
  DELETE_CHAT,
  CREATE_FEEDBACK,
  UPDATE_FEEDBACK,
  DELETE_FEEDBACK,
  
  // Subscriptions
  MESSAGE_ADDED,
  BOOKING_UPDATED,
  CHAT_UPDATED,
} from './graphql-queries';

import {
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
  
  // Mutation response types
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
  
  // Subscription response types
  MessageAddedResponse,
  BookingUpdatedResponse,
  ChatUpdatedResponse,
  
  // Input types
  CreateUserInput,
  UpdateUserInput,
  CreateSpecialistInput,
  UpdateSpecialistInput,
  CreateServiceInput,
  UpdateServiceInput,
  CreateBookingInput,
  UpdateBookingInput,
  CreateChatInput,
  SendMessageInput,
  UpdateChatInput,
  CreateFeedbackInput,
  UpdateFeedbackInput,
  SearchInput,
} from './graphql-types';

// ==================== USER HOOKS ====================

export const useGetMe = () => {
  return useQuery<GetMeResponse>(GET_ME);
};

export const useGetUser = (id: string) => {
  return useQuery<GetUserResponse>(GET_USER, {
    variables: { id },
    skip: !id,
  });
};

export const useGetUserStats = (id: string) => {
  return useQuery<GetUserStatsResponse>(GET_USER_STATS, {
    variables: { id },
    skip: !id,
  });
};

// ==================== SPECIALIST HOOKS ====================

export const useGetSpecialists = (variables?: {
  search?: string;
  location?: string;
  specialties?: string[];
  rating?: number;
  pagination?: { page: number; limit: number };
}) => {
  return useQuery<GetSpecialistsResponse>(GET_SPECIALISTS, {
    variables,
  });
};

export const useGetSpecialist = (id: string) => {
  return useQuery<GetSpecialistResponse>(GET_SPECIALIST, {
    variables: { id },
    skip: !id,
  });
};

// ==================== SERVICE HOOKS ====================

export const useGetServices = (variables?: {
  search?: string;
  specialistId?: string;
  format?: 'VIDEO' | 'IN_PERSON';
  priceRange?: { min?: number; max?: number };
  tags?: string[];
  pagination?: { page: number; limit: number };
}) => {
  return useQuery<GetServicesResponse>(GET_SERVICES, {
    variables,
  });
};

export const useGetService = (id: string) => {
  return useQuery<GetServiceResponse>(GET_SERVICE, {
    variables: { id },
    skip: !id,
  });
};

// ==================== BOOKING HOOKS ====================

export const useGetBookings = (variables?: {
  userId?: string;
  specialistId?: string;
  status?: 'WAITING' | 'CONFIRMED' | 'REQUEST';
  dateFrom?: string;
  dateTo?: string;
  pagination?: { page: number; limit: number };
}) => {
  return useQuery<GetBookingsResponse>(GET_BOOKINGS, {
    variables,
  });
};

export const useGetBooking = (id: string) => {
  return useQuery<GetBookingResponse>(GET_BOOKING, {
    variables: { id },
    skip: !id,
  });
};

export const useGetAvailableSlots = (variables: {
  serviceId: string;
  specialistId: string;
  dateFrom: string;
  dateTo: string;
}) => {
  return useQuery<GetAvailableSlotsResponse>(GET_AVAILABLE_SLOTS, {
    variables,
    skip: !variables.serviceId || !variables.specialistId,
  });
};

// ==================== CHAT HOOKS ====================

export const useGetChats = (variables?: {
  userId?: string;
  isAI?: boolean;
  status?: 'WAITING' | 'CONFIRMED' | 'REQUEST' | 'DECLINED';
  pagination?: { page: number; limit: number };
}) => {
  return useQuery<GetChatsResponse>(GET_CHATS, {
    variables,
  });
};

export const useGetChat = (id: string) => {
  return useQuery<GetChatResponse>(GET_CHAT, {
    variables: { id },
    skip: !id,
  });
};

export const useGetMessages = (chatId: string, pagination?: { page: number; limit: number }) => {
  return useQuery<GetMessagesResponse>(GET_MESSAGES, {
    variables: { chatId, pagination },
    skip: !chatId,
  });
};

// ==================== DASHBOARD HOOKS ====================

export const useGetDashboardStats = (userId: string) => {
  return useQuery<GetDashboardStatsResponse>(GET_DASHBOARD_STATS, {
    variables: { userId },
    skip: !userId,
  });
};

// ==================== SEARCH HOOKS ====================

export const useSearch = () => {
  return useLazyQuery<SearchResponse>(SEARCH);
};

// ==================== USER MUTATION HOOKS ====================

export const useCreateUser = () => {
  return useMutation<CreateUserResponse, { input: CreateUserInput }>(CREATE_USER);
};

export const useUpdateUser = () => {
  return useMutation<UpdateUserResponse, { id: string; input: UpdateUserInput }>(UPDATE_USER);
};

export const useDeleteUser = () => {
  return useMutation<DeleteUserResponse, { id: string }>(DELETE_USER);
};

// ==================== SPECIALIST MUTATION HOOKS ====================

export const useCreateSpecialist = () => {
  return useMutation<CreateSpecialistResponse, { input: CreateSpecialistInput }>(CREATE_SPECIALIST);
};

export const useUpdateSpecialist = () => {
  return useMutation<UpdateSpecialistResponse, { id: string; input: UpdateSpecialistInput }>(UPDATE_SPECIALIST);
};

export const useDeleteSpecialist = () => {
  return useMutation<DeleteSpecialistResponse, { id: string }>(DELETE_SPECIALIST);
};

export const useLikeSpecialist = () => {
  return useMutation<LikeSpecialistResponse, { id: string }>(LIKE_SPECIALIST);
};

export const useUnlikeSpecialist = () => {
  return useMutation<UnlikeSpecialistResponse, { id: string }>(UNLIKE_SPECIALIST);
};

// ==================== SERVICE MUTATION HOOKS ====================

export const useCreateService = () => {
  return useMutation<CreateServiceResponse, { input: CreateServiceInput }>(CREATE_SERVICE);
};

export const useUpdateService = () => {
  return useMutation<UpdateServiceResponse, { id: string; input: UpdateServiceInput }>(UPDATE_SERVICE);
};

export const useDeleteService = () => {
  return useMutation<DeleteServiceResponse, { id: string }>(DELETE_SERVICE);
};

// ==================== BOOKING MUTATION HOOKS ====================

export const useCreateBooking = () => {
  return useMutation<CreateBookingResponse, { input: CreateBookingInput }>(CREATE_BOOKING);
};

export const useUpdateBooking = () => {
  return useMutation<UpdateBookingResponse, { id: string; input: UpdateBookingInput }>(UPDATE_BOOKING);
};

export const useCancelBooking = () => {
  return useMutation<CancelBookingResponse, { id: string }>(CANCEL_BOOKING);
};

export const useConfirmBooking = () => {
  return useMutation<ConfirmBookingResponse, { id: string }>(CONFIRM_BOOKING);
};

// ==================== CHAT MUTATION HOOKS ====================

export const useCreateChat = () => {
  return useMutation<CreateChatResponse, { input: CreateChatInput }>(CREATE_CHAT);
};

export const useSendMessage = () => {
  return useMutation<SendMessageResponse, { input: SendMessageInput }>(SEND_MESSAGE);
};

export const useUpdateChat = () => {
  return useMutation<UpdateChatResponse, { id: string; input: UpdateChatInput }>(UPDATE_CHAT);
};

export const useDeleteChat = () => {
  return useMutation<DeleteChatResponse, { id: string }>(DELETE_CHAT);
};

// ==================== FEEDBACK MUTATION HOOKS ====================

export const useCreateFeedback = () => {
  return useMutation<CreateFeedbackResponse, { input: CreateFeedbackInput }>(CREATE_FEEDBACK);
};

export const useUpdateFeedback = () => {
  return useMutation<UpdateFeedbackResponse, { id: string; input: UpdateFeedbackInput }>(UPDATE_FEEDBACK);
};

export const useDeleteFeedback = () => {
  return useMutation<DeleteFeedbackResponse, { id: string }>(DELETE_FEEDBACK);
};

// ==================== SUBSCRIPTION HOOKS ====================

export const useMessageAdded = (chatId: string) => {
  return useSubscription<MessageAddedResponse>(MESSAGE_ADDED, {
    variables: { chatId },
    skip: !chatId,
  });
};

export const useBookingUpdated = (bookingId: string) => {
  return useSubscription<BookingUpdatedResponse>(BOOKING_UPDATED, {
    variables: { bookingId },
    skip: !bookingId,
  });
};

export const useChatUpdated = (chatId: string) => {
  return useSubscription<ChatUpdatedResponse>(CHAT_UPDATED, {
    variables: { chatId },
    skip: !chatId,
  });
};

// ==================== UTILITY HOOKS ====================

// Hook для оптимистичных обновлений
export const useOptimisticUpdate = <T>(
  query: any,
  variables: any,
  updateFn: (data: T, optimisticData: any) => T
) => {
  const [mutate] = useMutation(query);
  
  return (optimisticData: any) => {
    return mutate({
      variables,
      optimisticResponse: optimisticData,
      update: (cache, { data }) => {
        const existingData = cache.readQuery({ query, variables });
        if (existingData) {
          cache.writeQuery({
            query,
            variables,
            data: updateFn(existingData, data),
          });
        }
      },
    });
  };
};

// Hook для кэширования запросов
export const useCachedQuery = <T>(
  query: any,
  variables: any,
  options?: {
    skip?: boolean;
    pollInterval?: number;
    notifyOnNetworkStatusChange?: boolean;
  }
) => {
  return useQuery<T>(query, {
    variables,
    ...options,
    fetchPolicy: 'cache-first',
  });
};

// Hook для ленивой загрузки с кэшированием
export const useLazyCachedQuery = <T>(query: any) => {
  return useLazyQuery<T>(query, {
    fetchPolicy: 'cache-first',
  });
};
