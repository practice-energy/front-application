// Типы для специалистов
export interface Specialist {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  experience: string;
  price: number;
  avatar: string;
  description: string;
  skills?: string[];
  certificates?: string[];
  education?: string;
  languages?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Типы для услуг
export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  specialistId: string;
  category: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Типы для бронирований
export interface Booking {
  id: string;
  userId: string;
  specialistId: string;
  serviceId: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  price: number;
  createdAt: string;
  updatedAt?: string;
}

// Типы для пользователей
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt?: string;
}

// Типы для отзывов
export interface Review {
  id: string;
  userId: string;
  specialistId: string;
  serviceId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

// API Response типы
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Query параметры
export interface SpecialistQueryParams {
  specialization?: string;
  minPrice?: string;
  maxPrice?: string;
  rating?: string;
}

export interface ServiceQueryParams {
  category?: string;
  specialistId?: string;
  minPrice?: string;
  maxPrice?: string;
}

export interface BookingQueryParams {
  userId?: string;
  specialistId?: string;
  status?: string;
  date?: string;
}
