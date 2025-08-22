import { 
  Specialist, 
  Service, 
  Booking, 
  User, 
  Review,
  SpecialistQueryParams,
  ServiceQueryParams,
  BookingQueryParams,
  ApiResponse,
  PaginatedResponse
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.practice.energy';

// Общая функция для API запросов
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

// Функции для работы со специалистами
export const specialistsApi = {
  getAll: (params?: SpecialistQueryParams) => {
    const searchParams = new URLSearchParams();
    if (params?.specialization) searchParams.append('specialization', params.specialization);
    if (params?.minPrice) searchParams.append('minPrice', params.minPrice);
    if (params?.maxPrice) searchParams.append('maxPrice', params.maxPrice);
    if (params?.rating) searchParams.append('rating', params.rating);
    
    const queryString = searchParams.toString();
    return apiRequest<Specialist[]>(`/api/specialists${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: string) => 
    apiRequest<Specialist>(`/api/specialists/${id}`),

  create: (specialist: Omit<Specialist, 'id'>) =>
    apiRequest<Specialist>('/api/specialists', {
      method: 'POST',
      body: JSON.stringify(specialist),
    }),

  update: (id: string, specialist: Partial<Specialist>) =>
    apiRequest<Specialist>(`/api/specialists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(specialist),
    }),

  delete: (id: string) =>
    apiRequest<{ message: string }>(`/api/specialists/${id}`, {
      method: 'DELETE',
    }),
};

// Функции для работы с услугами
export const servicesApi = {
  getAll: (params?: ServiceQueryParams) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.specialistId) searchParams.append('specialistId', params.specialistId);
    if (params?.minPrice) searchParams.append('minPrice', params.minPrice);
    if (params?.maxPrice) searchParams.append('maxPrice', params.maxPrice);
    
    const queryString = searchParams.toString();
    return apiRequest<Service[]>(`/api/services${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: string) => 
    apiRequest<Service>(`/api/services/${id}`),

  create: (service: Omit<Service, 'id'>) =>
    apiRequest<Service>('/api/services', {
      method: 'POST',
      body: JSON.stringify(service),
    }),

  update: (id: string, service: Partial<Service>) =>
    apiRequest<Service>(`/api/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(service),
    }),

  delete: (id: string) =>
    apiRequest<{ message: string }>(`/api/services/${id}`, {
      method: 'DELETE',
    }),
};

// Функции для работы с бронированиями
export const bookingsApi = {
  getAll: (params?: BookingQueryParams) => {
    const searchParams = new URLSearchParams();
    if (params?.userId) searchParams.append('userId', params.userId);
    if (params?.specialistId) searchParams.append('specialistId', params.specialistId);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.date) searchParams.append('date', params.date);
    
    const queryString = searchParams.toString();
    return apiRequest<Booking[]>(`/api/bookings${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: string) => 
    apiRequest<Booking>(`/api/bookings/${id}`),

  create: (booking: Omit<Booking, 'id' | 'createdAt'>) =>
    apiRequest<Booking>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    }),

  update: (id: string, booking: Partial<Booking>) =>
    apiRequest<Booking>(`/api/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(booking),
    }),

  delete: (id: string) =>
    apiRequest<{ message: string }>(`/api/bookings/${id}`, {
      method: 'DELETE',
    }),
};

// Функция для проверки здоровья API
export const healthApi = {
  check: () => apiRequest<{ status: string; timestamp: string; environment: string }>('/api/health'),
};

// Хуки для использования в компонентах
export const useApi = () => ({
  specialists: specialistsApi,
  services: servicesApi,
  bookings: bookingsApi,
  health: healthApi,
});
