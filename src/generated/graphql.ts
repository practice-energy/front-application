/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: string; output: string; }
  Time: { input: any; output: any; }
  UUID: { input: any; output: any; }
  Upload: { input: File; output: File; }
};

export type AiMessageType =
  | 'BOOKING'
  | 'INFO'
  | 'SERVICE'
  | 'WARNING';

export type Activity = {
  __typename?: 'Activity';
  createdAt: Scalars['Time']['output'];
  date: Scalars['Date']['output'];
  duration: Scalars['Int']['output'];
  endTime: Scalars['Time']['output'];
  format: Format;
  id: Scalars['UUID']['output'];
  isRepeat: Scalars['Boolean']['output'];
  practiceCount: Scalars['Int']['output'];
  price: Scalars['Int']['output'];
  service?: Maybe<BookingServiceInfo>;
  specialist?: Maybe<BookingSpecialistInfo>;
  startTime: Scalars['Time']['output'];
  status: BookingStatus;
  updatedAt: Scalars['Time']['output'];
  user?: Maybe<BookingUserInfo>;
};

export type AddChatInput = {
  id: Scalars['UUID']['input'];
  isAiChat: Scalars['Boolean']['input'];
  message: MessageInput;
  specialistId?: InputMaybe<Scalars['UUID']['input']>;
};

export type AuthUser = {
  __typename?: 'AuthUser';
  email: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  token: Scalars['String']['output'];
};

export type BaseAnswerInput = {
  answer: Scalars['String']['input'];
  question: Scalars['String']['input'];
};

export type BookSlotInput = {
  chatId: Scalars['UUID']['input'];
  datetime: Scalars['DateTime']['input'];
  format: Format;
  hat: UserHat;
  serviceId: Scalars['UUID']['input'];
};

export type Booking = {
  __typename?: 'Booking';
  createdAt: Scalars['Time']['output'];
  date: Scalars['Date']['output'];
  duration: Scalars['Int']['output'];
  endTime: Scalars['Time']['output'];
  format: Format;
  id: Scalars['UUID']['output'];
  isRepeat: Scalars['Boolean']['output'];
  price: Scalars['Int']['output'];
  service?: Maybe<BookingServiceInfo>;
  specialist?: Maybe<BookingSpecialistInfo>;
  startTime: Scalars['Time']['output'];
  status: BookingStatus;
  updatedAt: Scalars['Time']['output'];
  user?: Maybe<BookingUserInfo>;
};

export type BookingServiceInfo = {
  __typename?: 'BookingServiceInfo';
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type BookingSlot = {
  __typename?: 'BookingSlot';
  slots: Scalars['Int']['output'];
  time: Scalars['DateTime']['output'];
};

export type BookingSlotsInput = {
  currentBookingId?: InputMaybe<Scalars['UUID']['input']>;
  serviceId: Scalars['UUID']['input'];
};

export type BookingSpecialistInfo = {
  __typename?: 'BookingSpecialistInfo';
  avatar?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type BookingStatus =
  | 'CONFIRMED'
  | 'DECLINED'
  | 'FINALIZE'
  | 'REQUEST'
  | 'WAITING';

export type BookingUserInfo = {
  __typename?: 'BookingUserInfo';
  avatar?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type CalendarRestrictions = {
  __typename?: 'CalendarRestrictions';
  commons: DayRestrictions;
  gmt: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  location?: Maybe<Scalars['String']['output']>;
  restrictions?: Maybe<Array<Restriction>>;
};

export type CalendarRestrictionsInput = {
  commons: DayRestrictionsInput;
  gmt: Scalars['String']['input'];
  id: Scalars['UUID']['input'];
  location?: InputMaybe<Scalars['String']['input']>;
  restrictions: Array<RestrictionInput>;
};

export type CalendarView = {
  __typename?: 'CalendarView';
  bookings?: Maybe<Array<Booking>>;
  calendarRestrictions: CalendarRestrictions;
};

export type Chat = {
  __typename?: 'Chat';
  avatar?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  hasNew: Scalars['Boolean']['output'];
  id: Scalars['UUID']['output'];
  isAiChat: Scalars['Boolean']['output'];
  messages: Array<Message>;
  specialistId?: Maybe<Scalars['UUID']['output']>;
  status?: Maybe<BookingStatus>;
  timestamp: Scalars['DateTime']['output'];
};

export type Chats = {
  __typename?: 'Chats';
  chats: Array<Chat>;
  hat: UserHat;
};

export type ClientInfo = {
  __typename?: 'ClientInfo';
  avatar?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
};

export type CreateCalendarInput = {
  calendarRestrictions: CalendarRestrictionsInput;
  hat: UserHat;
};

export type CreateEducationInput = {
  certificate?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateExperienceInput = {
  description: Scalars['String']['input'];
};

export type CreateServiceInput = {
  calendarRestrictions?: InputMaybe<CalendarRestrictionsInput>;
  contents: Scalars['String']['input'];
  description: Scalars['String']['input'];
  includes?: InputMaybe<Array<Scalars['String']['input']>>;
  location?: InputMaybe<Scalars['String']['input']>;
  settings: ServiceSettingsInput;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title: Scalars['String']['input'];
};

export type CreateSpecialistInput = {
  specialties: Array<Scalars['String']['input']>;
};

export type DashboardStats = {
  __typename?: 'DashboardStats';
  hat: UserHat;
  upcomingActivities?: Maybe<Array<Activity>>;
};

export type DayRestrictions = {
  __typename?: 'DayRestrictions';
  Fri: Restriction;
  Mon: Restriction;
  Sat: Restriction;
  Sun: Restriction;
  Thu: Restriction;
  Tue: Restriction;
  Wed: Restriction;
};

export type DayRestrictionsInput = {
  Fri: RestrictionInput;
  Mon: RestrictionInput;
  Sat: RestrictionInput;
  Sun: RestrictionInput;
  Thu: RestrictionInput;
  Tue: RestrictionInput;
  Wed: RestrictionInput;
};

export type Education = {
  __typename?: 'Education';
  certificate?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  title: Scalars['String']['output'];
};

export type EducationInput = {
  certificate?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  id: Scalars['UUID']['input'];
  title: Scalars['String']['input'];
};

export type Experience = {
  __typename?: 'Experience';
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
};

export type ExperienceInput = {
  description: Scalars['String']['input'];
  id: Scalars['UUID']['input'];
};

export type Feedback = {
  __typename?: 'Feedback';
  author: Scalars['String']['output'];
  avatar?: Maybe<Scalars['String']['output']>;
  comment: Scalars['String']['output'];
  createdAt: Scalars['Time']['output'];
  id: Scalars['UUID']['output'];
};

export type Format =
  | 'IN_PERSON'
  | 'VIDEO';

export type FormatSettings = {
  __typename?: 'FormatSettings';
  enabled: Scalars['Boolean']['output'];
  practices: Array<Practice>;
  score: Scalars['Int']['output'];
};

export type FormatSettingsInput = {
  enabled: Scalars['Boolean']['input'];
  practices: Array<PracticeInput>;
};

export type Interval = {
  __typename?: 'Interval';
  end: Scalars['Time']['output'];
  formats: Array<Format>;
  start: Scalars['Time']['output'];
};

export type IntervalInput = {
  end: Scalars['Time']['input'];
  formats: Array<Format>;
  start: Scalars['Time']['input'];
};

export type Language =
  | 'EN'
  | 'RU';

export type Message = {
  __typename?: 'Message';
  aiMessageType?: Maybe<AiMessageType>;
  chatId: Scalars['UUID']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['Time']['output'];
  footerContent?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  isFromUser: Scalars['Boolean']['output'];
  specialistIDs?: Maybe<Array<Scalars['UUID']['output']>>;
  timestamp: Scalars['DateTime']['output'];
  updatedAt: Scalars['Time']['output'];
};

export type MessageInput = {
  chatId: Scalars['UUID']['input'];
  content: Scalars['String']['input'];
  hat: UserHat;
  timestamp: Scalars['DateTime']['input'];
};

export type MultipleUploadResult = {
  __typename?: 'MultipleUploadResult';
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  urls?: Maybe<Array<Scalars['String']['output']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  ackMessages: Scalars['Boolean']['output'];
  addChat: Scalars['Boolean']['output'];
  approveBooking: Scalars['Boolean']['output'];
  bookSlot: Scalars['Boolean']['output'];
  burnBooking: Scalars['Boolean']['output'];
  completeBooking: Scalars['Boolean']['output'];
  createCalendar: Scalars['Boolean']['output'];
  createService: Scalars['Boolean']['output'];
  dislike: Scalars['Boolean']['output'];
  like: Scalars['Boolean']['output'];
  logout: Scalars['Boolean']['output'];
  pushMessage: Scalars['Boolean']['output'];
  pushPersonalityTest: Scalars['Boolean']['output'];
  rebookSlot: Scalars['Boolean']['output'];
  refreshToken: TokenPair;
  requestLogin: Scalars['Boolean']['output'];
  testLogin: TokenPair;
  updateCalendar: Scalars['Boolean']['output'];
  updateService: Scalars['Boolean']['output'];
  updateSpecialist: SpecialistProfile;
  updateUser: Scalars['Boolean']['output'];
  upscaleToSpecialist: TokenPair;
  verifyLogin: TokenPair;
};


export type MutationAckMessagesArgs = {
  hat?: InputMaybe<UserHat>;
};


export type MutationAddChatArgs = {
  input: AddChatInput;
};


export type MutationApproveBookingArgs = {
  hat: UserHat;
  id: Scalars['UUID']['input'];
};


export type MutationBookSlotArgs = {
  input: BookSlotInput;
};


export type MutationBurnBookingArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationCompleteBookingArgs = {
  hat: UserHat;
  id: Scalars['UUID']['input'];
};


export type MutationCreateCalendarArgs = {
  input: CreateCalendarInput;
};


export type MutationCreateServiceArgs = {
  input: CreateServiceInput;
};


export type MutationDislikeArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationLikeArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationPushMessageArgs = {
  input?: InputMaybe<MessageInput>;
};


export type MutationPushPersonalityTestArgs = {
  input?: InputMaybe<PersonalityTestInput>;
};


export type MutationRebookSlotArgs = {
  input: RebookSlotInput;
};


export type MutationRefreshTokenArgs = {
  input: RefreshTokenInput;
};


export type MutationRequestLoginArgs = {
  input: RequestLoginInput;
};


export type MutationTestLoginArgs = {
  input: RequestLoginInput;
};


export type MutationUpdateCalendarArgs = {
  input: UpdateCalendarInput;
};


export type MutationUpdateServiceArgs = {
  input: UpdateServiceInput;
};


export type MutationUpdateSpecialistArgs = {
  input: UpdateSpecialistInput;
};


export type MutationUpdateUserArgs = {
  input?: InputMaybe<UpdateUserInput>;
};


export type MutationUpscaleToSpecialistArgs = {
  input: CreateSpecialistInput;
};


export type MutationVerifyLoginArgs = {
  input: VerifyLoginInput;
};

export type PersonalityTestInput = {
  baseQuestions: Array<BaseAnswerInput>;
  v: Scalars['Int']['input'];
  versionQuestions: Array<VersionAnswerInput>;
};

export type Practice = {
  __typename?: 'Practice';
  duration: Scalars['Int']['output'];
  id: Scalars['UUID']['output'];
  price: Scalars['Int']['output'];
  slots: Scalars['Int']['output'];
};

export type PracticeInput = {
  price: Scalars['Int']['input'];
  slots: Scalars['Int']['input'];
};

export type PracticeOverview = {
  __typename?: 'PracticeOverview';
  confirmedSlots: Scalars['Int']['output'];
  newInitiants: Scalars['Int']['output'];
  personalMeetings: Scalars['Int']['output'];
  repeatingMeetings: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  calendar?: Maybe<CalendarView>;
  dashboard?: Maybe<Array<DashboardStats>>;
  likedSpecialists: Array<SpecialistProfile>;
  me: User;
  service: Service;
  specialist?: Maybe<SpecialistProfile>;
  user: User;
};


export type QueryCalendarArgs = {
  hat: UserHat;
};


export type QueryServiceArgs = {
  id: Scalars['UUID']['input'];
};


export type QuerySpecialistArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['UUID']['input'];
};

export type RebookSlotInput = {
  hat: UserHat;
  id: Scalars['UUID']['input'];
  newDateTime: Scalars['DateTime']['input'];
  oldDateTime: Scalars['DateTime']['input'];
};

export type RefreshTokenInput = {
  refreshToken: Scalars['String']['input'];
};

export type RequestLoginInput = {
  email: Scalars['String']['input'];
};

export type Restriction = {
  __typename?: 'Restriction';
  date?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  intervals: Array<Interval>;
  isActive: Scalars['Boolean']['output'];
  isPractice: Scalars['Boolean']['output'];
};

export type RestrictionInput = {
  date?: InputMaybe<Scalars['Date']['input']>;
  id: Scalars['ID']['input'];
  intervals: Array<IntervalInput>;
  isActive: Scalars['Boolean']['input'];
  isPractice: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
};

export type Service = {
  __typename?: 'Service';
  bookings?: Maybe<Array<Booking>>;
  calendarRestrictions?: Maybe<CalendarRestrictions>;
  contents: Scalars['String']['output'];
  createdAt: Scalars['Time']['output'];
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  images: Array<Scalars['String']['output']>;
  includes: Array<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  reviews: Array<Feedback>;
  settings: ServiceSettings;
  specialist: SpecialistInfo;
  tags: Array<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['Time']['output'];
};

export type ServiceInfo = {
  __typename?: 'ServiceInfo';
  contents: Scalars['String']['output'];
  createdAt: Scalars['Time']['output'];
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  images: Array<Scalars['String']['output']>;
  includes: Array<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  settings: ServiceSettings;
  tags: Array<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['Time']['output'];
};

export type ServiceSettings = {
  __typename?: 'ServiceSettings';
  inPerson: FormatSettings;
  video: FormatSettings;
};

export type ServiceSettingsInput = {
  inPerson: FormatSettingsInput;
  video: FormatSettingsInput;
};

export type SpecialistInfo = {
  __typename?: 'SpecialistInfo';
  avatar?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type SpecialistProfile = {
  __typename?: 'SpecialistProfile';
  avatar?: Maybe<Scalars['String']['output']>;
  certificates: Array<Education>;
  description: Scalars['String']['output'];
  education: Array<Education>;
  experience: Array<Experience>;
  id: Scalars['UUID']['output'];
  isLiked?: Maybe<Scalars['Boolean']['output']>;
  likes: Scalars['Int']['output'];
  location: Scalars['String']['output'];
  name: Scalars['String']['output'];
  practices: Scalars['Int']['output'];
  rate5?: Maybe<Scalars['Float']['output']>;
  services: Array<ServiceInfo>;
  skills: Array<Scalars['String']['output']>;
  specialties: Array<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  bookingSlots: Array<BookingSlot>;
  newChatMessages: Array<Chats>;
};


export type SubscriptionBookingSlotsArgs = {
  input?: InputMaybe<BookingSlotsInput>;
};

export type TokenPair = {
  __typename?: 'TokenPair';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type TopStats = {
  __typename?: 'TopStats';
  activePracticesCount: Scalars['Int']['output'];
};

export type UpdateCalendarInput = {
  calendarRestrictions: CalendarRestrictionsInput;
  hat: UserHat;
};

export type UpdateEducationInput = {
  certificate?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateExperienceInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

export type UpdateServiceInput = {
  calendarRestrictions?: InputMaybe<CalendarRestrictionsInput>;
  contents?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  includes?: InputMaybe<Array<Scalars['String']['input']>>;
  location?: InputMaybe<Scalars['String']['input']>;
  settings?: InputMaybe<ServiceSettingsInput>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSpecialistInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  certificates: Array<EducationInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  education: Array<EducationInput>;
  experience: Array<ExperienceInput>;
  id: Scalars['UUID']['input'];
  location?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  skills?: InputMaybe<Array<Scalars['String']['input']>>;
  specialties?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  bio: Scalars['String']['input'];
  certificates: Array<EducationInput>;
  education: Array<EducationInput>;
  email: Scalars['String']['input'];
  experience: Array<ExperienceInput>;
  location: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type UploadResult = {
  __typename?: 'UploadResult';
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']['output']>;
  bio: Scalars['String']['output'];
  certificates: Array<Education>;
  createdAt: Scalars['Time']['output'];
  education: Array<Education>;
  email: Scalars['String']['output'];
  experience: Array<Experience>;
  hat: UserHat;
  id: Scalars['UUID']['output'];
  isSpecialist: Scalars['Boolean']['output'];
  location: Scalars['String']['output'];
  name: Scalars['String']['output'];
  practice: Scalars['Int']['output'];
  preferences?: Maybe<UserPreferences>;
  specialistProfile?: Maybe<SpecialistProfile>;
  tier: UserTier;
  timezone: Scalars['String']['output'];
};

export type UserHat =
  | 'ADEPT'
  | 'MASTER'
  | 'SUPERVISER';

export type UserPreferences = {
  __typename?: 'UserPreferences';
  language: Language;
  theme: Scalars['String']['output'];
};

export type UserTier =
  | 'BASIC'
  | 'PREMIUM'
  | 'UNLIMITED';

export type VerifyLoginInput = {
  token: Scalars['String']['input'];
};

export type VersionAnswerInput = {
  answer: Scalars['Int']['input'];
  question: Scalars['String']['input'];
};

export type RequestLoginMutationVariables = Exact<{
  input: RequestLoginInput;
}>;


export type RequestLoginMutation = { __typename?: 'Mutation', requestLogin: boolean };

export type VerifyLoginMutationVariables = Exact<{
  input: VerifyLoginInput;
}>;


export type VerifyLoginMutation = { __typename?: 'Mutation', verifyLogin: { __typename?: 'TokenPair', accessToken: string, refreshToken: string } };

export type RefreshTokenMutationVariables = Exact<{
  input: RefreshTokenInput;
}>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'TokenPair', accessToken: string, refreshToken: string } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type TestLoginMutationVariables = Exact<{
  input: RequestLoginInput;
}>;


export type TestLoginMutation = { __typename?: 'Mutation', testLogin: { __typename?: 'TokenPair', accessToken: string, refreshToken: string } };

export type BookSlotMutationVariables = Exact<{
  input: BookSlotInput;
}>;


export type BookSlotMutation = { __typename?: 'Mutation', bookSlot: boolean };

export type RebookSlotMutationVariables = Exact<{
  input: RebookSlotInput;
}>;


export type RebookSlotMutation = { __typename?: 'Mutation', rebookSlot: boolean };

export type BurnBookingMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type BurnBookingMutation = { __typename?: 'Mutation', burnBooking: boolean };

export type ApproveBookingMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
  hat: UserHat;
}>;


export type ApproveBookingMutation = { __typename?: 'Mutation', approveBooking: boolean };

export type CompleteBookingMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
  hat: UserHat;
}>;


export type CompleteBookingMutation = { __typename?: 'Mutation', completeBooking: boolean };

export type CreateCalendarMutationVariables = Exact<{
  input: CreateCalendarInput;
}>;


export type CreateCalendarMutation = { __typename?: 'Mutation', createCalendar: boolean };

export type UpdateCalendarMutationVariables = Exact<{
  input: UpdateCalendarInput;
}>;


export type UpdateCalendarMutation = { __typename?: 'Mutation', updateCalendar: boolean };

export type AddChatMutationVariables = Exact<{
  input: AddChatInput;
}>;


export type AddChatMutation = { __typename?: 'Mutation', addChat: boolean };

export type PushMessageMutationVariables = Exact<{
  input?: InputMaybe<MessageInput>;
}>;


export type PushMessageMutation = { __typename?: 'Mutation', pushMessage: boolean };

export type AckMessagesMutationVariables = Exact<{
  hat?: InputMaybe<UserHat>;
}>;


export type AckMessagesMutation = { __typename?: 'Mutation', ackMessages: boolean };

export type CreateServiceMutationVariables = Exact<{
  input: CreateServiceInput;
}>;


export type CreateServiceMutation = { __typename?: 'Mutation', createService: boolean };

export type UpdateServiceMutationVariables = Exact<{
  input: UpdateServiceInput;
}>;


export type UpdateServiceMutation = { __typename?: 'Mutation', updateService: boolean };

export type UpscaleToSpecialistMutationVariables = Exact<{
  input: CreateSpecialistInput;
}>;


export type UpscaleToSpecialistMutation = { __typename?: 'Mutation', upscaleToSpecialist: { __typename?: 'TokenPair', accessToken: string, refreshToken: string } };

export type UpdateSpecialistMutationVariables = Exact<{
  input: UpdateSpecialistInput;
}>;


export type UpdateSpecialistMutation = { __typename?: 'Mutation', updateSpecialist: { __typename?: 'SpecialistProfile', id: any, name: string, title: string, avatar?: string | null, practices: number, location: string, description: string, specialties: Array<string>, skills: Array<string>, likes: number, isLiked?: boolean | null, rate5?: number | null, education: Array<{ __typename?: 'Education', id: any, title: string, description: string, certificate?: string | null }>, certificates: Array<{ __typename?: 'Education', id: any, title: string, description: string, certificate?: string | null }>, experience: Array<{ __typename?: 'Experience', id: any, description: string }>, services: Array<{ __typename?: 'ServiceInfo', id: any, title: string, location?: string | null, description: string, contents: string, images: Array<string>, includes: Array<string>, tags: Array<string>, createdAt: any, updatedAt: any, settings: { __typename?: 'ServiceSettings', video: { __typename?: 'FormatSettings', score: number, enabled: boolean, practices: Array<{ __typename?: 'Practice', slots: number, duration: number, price: number }> }, inPerson: { __typename?: 'FormatSettings', score: number, enabled: boolean, practices: Array<{ __typename?: 'Practice', slots: number, duration: number, price: number }> } } }> } };

export type LikeSpecialistMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type LikeSpecialistMutation = { __typename?: 'Mutation', like: boolean };

export type DislikeSpecialistMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type DislikeSpecialistMutation = { __typename?: 'Mutation', dislike: boolean };

export type UpdateUserMutationVariables = Exact<{
  input?: InputMaybe<UpdateUserInput>;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: boolean };

export type PushPersonalityTestMutationVariables = Exact<{
  input?: InputMaybe<PersonalityTestInput>;
}>;


export type PushPersonalityTestMutation = { __typename?: 'Mutation', pushPersonalityTest: boolean };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: any, email: string, bio: string, name: string, location: string, avatar?: string | null, timezone: string, createdAt: any, isSpecialist: boolean, hat: UserHat, tier: UserTier, practice: number, preferences?: { __typename?: 'UserPreferences', language: Language } | null, education: Array<{ __typename?: 'Education', id: any, title: string, description: string, certificate?: string | null }>, certificates: Array<{ __typename?: 'Education', id: any, title: string, description: string, certificate?: string | null }>, experience: Array<{ __typename?: 'Experience', id: any, description: string }>, specialistProfile?: { __typename?: 'SpecialistProfile', id: any, name: string, title: string, avatar?: string | null, practices: number, location: string, description: string, specialties: Array<string>, skills: Array<string>, likes: number, isLiked?: boolean | null, rate5?: number | null, education: Array<{ __typename?: 'Education', id: any, title: string, description: string, certificate?: string | null }>, certificates: Array<{ __typename?: 'Education', id: any, title: string, description: string, certificate?: string | null }>, experience: Array<{ __typename?: 'Experience', id: any, description: string }>, services: Array<{ __typename?: 'ServiceInfo', id: any, title: string, location?: string | null, description: string, contents: string, images: Array<string>, includes: Array<string>, tags: Array<string>, createdAt: any, updatedAt: any, settings: { __typename?: 'ServiceSettings', video: { __typename?: 'FormatSettings', score: number, enabled: boolean, practices: Array<{ __typename?: 'Practice', slots: number, duration: number, price: number }> }, inPerson: { __typename?: 'FormatSettings', score: number, enabled: boolean, practices: Array<{ __typename?: 'Practice', slots: number, duration: number, price: number }> } } }> } | null } };

export type GetUserQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', user: { __typename?: 'User', id: any, email: string, bio: string, name: string, location: string, avatar?: string | null, timezone: string, createdAt: any, isSpecialist: boolean, hat: UserHat, tier: UserTier, practice: number, preferences?: { __typename?: 'UserPreferences', language: Language } | null, education: Array<{ __typename?: 'Education', id: any, title: string, description: string, certificate?: string | null }>, certificates: Array<{ __typename?: 'Education', id: any, title: string, description: string, certificate?: string | null }>, experience: Array<{ __typename?: 'Experience', id: any, description: string }>, specialistProfile?: { __typename?: 'SpecialistProfile', id: any, name: string, title: string, avatar?: string | null, practices: number, location: string, description: string, specialties: Array<string>, skills: Array<string>, likes: number, isLiked?: boolean | null, rate5?: number | null, education: Array<{ __typename?: 'Education', id: any, title: string, description: string, certificate?: string | null }>, certificates: Array<{ __typename?: 'Education', id: any, title: string, description: string, certificate?: string | null }>, experience: Array<{ __typename?: 'Experience', id: any, description: string }>, services: Array<{ __typename?: 'ServiceInfo', id: any, title: string, location?: string | null, description: string, contents: string, images: Array<string>, includes: Array<string>, tags: Array<string>, createdAt: any, updatedAt: any, settings: { __typename?: 'ServiceSettings', video: { __typename?: 'FormatSettings', score: number, enabled: boolean, practices: Array<{ __typename?: 'Practice', slots: number, duration: number, price: number }> }, inPerson: { __typename?: 'FormatSettings', score: number, enabled: boolean, practices: Array<{ __typename?: 'Practice', slots: number, duration: number, price: number }> } } }> } | null } };

export type GetCalendarQueryVariables = Exact<{
  hat: UserHat;
}>;


export type GetCalendarQuery = { __typename?: 'Query', calendar?: { __typename?: 'CalendarView', calendarRestrictions: { __typename?: 'CalendarRestrictions', id: any, gmt: string, location?: string | null, commons: { __typename?: 'DayRestrictions', Mon: { __typename?: 'Restriction', id: string, date?: string | null, isActive: boolean, isPractice: boolean, intervals: Array<{ __typename?: 'Interval', start: any, end: any, formats: Array<Format> }> }, Tue: { __typename?: 'Restriction', id: string, date?: string | null, isActive: boolean, isPractice: boolean, intervals: Array<{ __typename?: 'Interval', start: any, end: any, formats: Array<Format> }> }, Wed: { __typename?: 'Restriction', id: string, date?: string | null, isActive: boolean, isPractice: boolean, intervals: Array<{ __typename?: 'Interval', start: any, end: any, formats: Array<Format> }> }, Thu: { __typename?: 'Restriction', id: string, date?: string | null, isActive: boolean, isPractice: boolean, intervals: Array<{ __typename?: 'Interval', start: any, end: any, formats: Array<Format> }> }, Fri: { __typename?: 'Restriction', id: string, date?: string | null, isActive: boolean, isPractice: boolean, intervals: Array<{ __typename?: 'Interval', start: any, end: any, formats: Array<Format> }> }, Sat: { __typename?: 'Restriction', id: string, date?: string | null, isActive: boolean, isPractice: boolean, intervals: Array<{ __typename?: 'Interval', start: any, end: any, formats: Array<Format> }> }, Sun: { __typename?: 'Restriction', id: string, date?: string | null, isActive: boolean, isPractice: boolean, intervals: Array<{ __typename?: 'Interval', start: any, end: any, formats: Array<Format> }> } }, restrictions?: Array<{ __typename?: 'Restriction', id: string, date?: string | null, isActive: boolean, isPractice: boolean, intervals: Array<{ __typename?: 'Interval', start: any, end: any, formats: Array<Format> }> }> | null }, bookings?: Array<{ __typename?: 'Booking', id: any, date: any, duration: number, format: Format, status: BookingStatus, createdAt: any, updatedAt: any, isRepeat: boolean, price: number }> | null } | null };

export type GetDashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDashboardQuery = { __typename?: 'Query', dashboard?: Array<{ __typename?: 'DashboardStats', hat: UserHat, upcomingActivities?: Array<{ __typename?: 'Activity', id: any, startTime: any, endTime: any, date: any, status: BookingStatus, createdAt: any, updatedAt: any, isRepeat: boolean, duration: number, format: Format, price: number, practiceCount: number, service?: { __typename?: 'BookingServiceInfo', id: string, title: string, description: string } | null, specialist?: { __typename?: 'BookingSpecialistInfo', id: string, name: string, avatar?: string | null } | null, user?: { __typename?: 'BookingUserInfo', id: string, name: string, avatar?: string | null } | null }> | null }> | null };

export type GetServiceQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetServiceQuery = { __typename?: 'Query', service: { __typename?: 'Service', id: any, title: string, location?: string | null, description: string, contents: string, images: Array<string>, includes: Array<string>, tags: Array<string>, createdAt: any, updatedAt: any, specialist: { __typename?: 'SpecialistInfo', id: any, name: string, title: string, avatar?: string | null }, settings: { __typename?: 'ServiceSettings', video: { __typename?: 'FormatSettings', score: number, enabled: boolean, practices: Array<{ __typename?: 'Practice', slots: number, duration: number, price: number }> }, inPerson: { __typename?: 'FormatSettings', score: number, enabled: boolean, practices: Array<{ __typename?: 'Practice', slots: number, duration: number, price: number }> } }, reviews: Array<{ __typename?: 'Feedback', id: any, author: string, avatar?: string | null, comment: string, createdAt: any }>, bookings?: Array<{ __typename?: 'Booking', id: any, date: any, duration: number, format: Format, status: BookingStatus, createdAt: any, updatedAt: any, isRepeat: boolean, price: number }> | null, calendarRestrictions?: { __typename?: 'CalendarRestrictions', id: any, gmt: string, location?: string | null, commons: { __typename?: 'DayRestrictions', Mon: { __typename?: 'Restriction', id: string, date?: string | null, isActive: boolean, isPractice: boolean, intervals: Array<{ __typename?: 'Interval', start: any, end: any, formats: Array<Format> }> }, Tue: { __typename?: 'Restriction', id: string, date?: string | null, isActive: boolean, isPractice: boolean, intervals: Array<{ __typename?: 'Interval', start: any, end: any, formats: Array<Format> }> }, Wed: { __typename?: 'Restriction', id: string, date?: string | null, isActive: boolean, isPractice: boolean, intervals: Array<{ __typename?: 'Interval', start: any, end: any, formats: Array<Format> }> }, Thu: { __typename?: 'Restriction', id: string, date?: string | null, isActive: boolean, isPractice: boolean, intervals: Array<{ __typename?: 'Interval', start: any, end: any, formats: Array<Format> }> }, Fri: { __typename?: 'Restriction', id: string, date?: string | null, isActive: boolean, isPractice: boolean, intervals: Array<{ __typename?: 'Interval', start: any, end: any, formats: Array<Format> }> }, Sat: { __typename?: 'Restriction', id: string, date?: string | null, isActive: boolean, isPractice: boolean, intervals: Array<{ __typename?: 'Interval', start: any, end: any, formats: Array<Format> }> }, Sun: { __typename?: 'Restriction', id: string, date?: string | null, isActive: boolean, isPractice: boolean, intervals: Array<{ __typename?: 'Interval', start: any, end: any, formats: Array<Format> }> } }, restrictions?: Array<{ __typename?: 'Restriction', id: string, date?: string | null, isActive: boolean, isPractice: boolean, intervals: Array<{ __typename?: 'Interval', start: any, end: any, formats: Array<Format> }> }> | null } | null } };

export type GetSpecialistQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetSpecialistQuery = { __typename?: 'Query', specialist?: { __typename?: 'SpecialistProfile', id: any, name: string, title: string, avatar?: string | null, practices: number, location: string, description: string, specialties: Array<string>, skills: Array<string>, likes: number, isLiked?: boolean | null, rate5?: number | null, education: Array<{ __typename?: 'Education', id: any, title: string, description: string, certificate?: string | null }>, certificates: Array<{ __typename?: 'Education', id: any, title: string, description: string, certificate?: string | null }>, experience: Array<{ __typename?: 'Experience', id: any, description: string }>, services: Array<{ __typename?: 'ServiceInfo', id: any, title: string, location?: string | null, description: string, contents: string, images: Array<string>, includes: Array<string>, tags: Array<string>, createdAt: any, updatedAt: any, settings: { __typename?: 'ServiceSettings', video: { __typename?: 'FormatSettings', score: number, enabled: boolean, practices: Array<{ __typename?: 'Practice', slots: number, duration: number, price: number }> }, inPerson: { __typename?: 'FormatSettings', score: number, enabled: boolean, practices: Array<{ __typename?: 'Practice', slots: number, duration: number, price: number }> } } }> } | null };

export type GetLikedSpecialistsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLikedSpecialistsQuery = { __typename?: 'Query', likedSpecialists: Array<{ __typename?: 'SpecialistProfile', id: any, name: string, title: string, avatar?: string | null, practices: number, location: string, description: string, specialties: Array<string>, skills: Array<string>, likes: number, isLiked?: boolean | null, rate5?: number | null, education: Array<{ __typename?: 'Education', id: any, title: string, description: string, certificate?: string | null }>, certificates: Array<{ __typename?: 'Education', id: any, title: string, description: string, certificate?: string | null }>, experience: Array<{ __typename?: 'Experience', id: any, description: string }>, services: Array<{ __typename?: 'ServiceInfo', id: any, title: string, location?: string | null, description: string, contents: string, images: Array<string>, includes: Array<string>, tags: Array<string>, createdAt: any, updatedAt: any, settings: { __typename?: 'ServiceSettings', video: { __typename?: 'FormatSettings', score: number, enabled: boolean, practices: Array<{ __typename?: 'Practice', slots: number, duration: number, price: number }> }, inPerson: { __typename?: 'FormatSettings', score: number, enabled: boolean, practices: Array<{ __typename?: 'Practice', slots: number, duration: number, price: number }> } } }> }> };


export const RequestLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestLogin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestLoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestLogin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<RequestLoginMutation, RequestLoginMutationVariables>;
export const VerifyLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyLogin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerifyLoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyLogin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<VerifyLoginMutation, VerifyLoginMutationVariables>;
export const RefreshTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RefreshTokenInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const TestLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TestLogin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestLoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"testLogin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<TestLoginMutation, TestLoginMutationVariables>;
export const BookSlotDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BookSlot"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BookSlotInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookSlot"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<BookSlotMutation, BookSlotMutationVariables>;
export const RebookSlotDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RebookSlot"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RebookSlotInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rebookSlot"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<RebookSlotMutation, RebookSlotMutationVariables>;
export const BurnBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BurnBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"burnBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<BurnBookingMutation, BurnBookingMutationVariables>;
export const ApproveBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApproveBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hat"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserHat"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"approveBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"hat"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hat"}}}]}]}}]} as unknown as DocumentNode<ApproveBookingMutation, ApproveBookingMutationVariables>;
export const CompleteBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CompleteBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hat"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserHat"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completeBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"hat"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hat"}}}]}]}}]} as unknown as DocumentNode<CompleteBookingMutation, CompleteBookingMutationVariables>;
export const CreateCalendarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCalendar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCalendarInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCalendar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<CreateCalendarMutation, CreateCalendarMutationVariables>;
export const UpdateCalendarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCalendar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCalendarInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCalendar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UpdateCalendarMutation, UpdateCalendarMutationVariables>;
export const AddChatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddChat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddChatInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addChat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<AddChatMutation, AddChatMutationVariables>;
export const PushMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PushMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MessageInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pushMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<PushMessageMutation, PushMessageMutationVariables>;
export const AckMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AckMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hat"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UserHat"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ackMessages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"hat"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hat"}}}]}]}}]} as unknown as DocumentNode<AckMessagesMutation, AckMessagesMutationVariables>;
export const CreateServiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateService"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateServiceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createService"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<CreateServiceMutation, CreateServiceMutationVariables>;
export const UpdateServiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateService"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateServiceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateService"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UpdateServiceMutation, UpdateServiceMutationVariables>;
export const UpscaleToSpecialistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpscaleToSpecialist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateSpecialistInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upscaleToSpecialist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<UpscaleToSpecialistMutation, UpscaleToSpecialistMutationVariables>;
export const UpdateSpecialistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSpecialist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSpecialistInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSpecialist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"practices"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"specialties"}},{"kind":"Field","name":{"kind":"Name","value":"education"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"certificate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"certificates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"certificate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"experience"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"services"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"contents"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"includes"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"video"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"practices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slots"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inPerson"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"practices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slots"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"skills"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"isLiked"}},{"kind":"Field","name":{"kind":"Name","value":"rate5"}}]}}]}}]} as unknown as DocumentNode<UpdateSpecialistMutation, UpdateSpecialistMutationVariables>;
export const LikeSpecialistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LikeSpecialist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"like"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<LikeSpecialistMutation, LikeSpecialistMutationVariables>;
export const DislikeSpecialistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DislikeSpecialist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dislike"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DislikeSpecialistMutation, DislikeSpecialistMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const PushPersonalityTestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PushPersonalityTest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PersonalityTestInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pushPersonalityTest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<PushPersonalityTestMutation, PushPersonalityTestMutationVariables>;
export const GetMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"preferences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}}]}},{"kind":"Field","name":{"kind":"Name","value":"education"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"certificate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"certificates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"certificate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"experience"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"specialistProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"practices"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"specialties"}},{"kind":"Field","name":{"kind":"Name","value":"education"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"certificate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"certificates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"certificate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"experience"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"services"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"contents"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"includes"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"video"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"practices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slots"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inPerson"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"practices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slots"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"skills"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"isLiked"}},{"kind":"Field","name":{"kind":"Name","value":"rate5"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isSpecialist"}},{"kind":"Field","name":{"kind":"Name","value":"hat"}},{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"practice"}}]}}]}}]} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"preferences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}}]}},{"kind":"Field","name":{"kind":"Name","value":"education"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"certificate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"certificates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"certificate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"experience"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"specialistProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"practices"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"specialties"}},{"kind":"Field","name":{"kind":"Name","value":"education"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"certificate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"certificates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"certificate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"experience"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"services"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"contents"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"includes"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"video"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"practices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slots"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inPerson"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"practices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slots"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"skills"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"isLiked"}},{"kind":"Field","name":{"kind":"Name","value":"rate5"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isSpecialist"}},{"kind":"Field","name":{"kind":"Name","value":"hat"}},{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"practice"}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
export const GetCalendarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCalendar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hat"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserHat"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"hat"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hat"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarRestrictions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"gmt"}},{"kind":"Field","name":{"kind":"Name","value":"commons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Mon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"intervals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"formats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPractice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Tue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"intervals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"formats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPractice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Wed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"intervals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"formats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPractice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Thu"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"intervals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"formats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPractice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Fri"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"intervals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"formats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPractice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Sat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"intervals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"formats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPractice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Sun"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"intervals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"formats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPractice"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"restrictions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"intervals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"formats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPractice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isRepeat"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}}]}}]} as unknown as DocumentNode<GetCalendarQuery, GetCalendarQueryVariables>;
export const GetDashboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hat"}},{"kind":"Field","name":{"kind":"Name","value":"upcomingActivities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isRepeat"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"service"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"specialist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"practiceCount"}}]}}]}}]}}]} as unknown as DocumentNode<GetDashboardQuery, GetDashboardQueryVariables>;
export const GetServiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetService"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"service"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"contents"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"includes"}},{"kind":"Field","name":{"kind":"Name","value":"specialist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"video"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"practices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slots"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inPerson"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"practices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slots"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"reviews"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isRepeat"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"calendarRestrictions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"gmt"}},{"kind":"Field","name":{"kind":"Name","value":"commons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Mon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"intervals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"formats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPractice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Tue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"intervals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"formats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPractice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Wed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"intervals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"formats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPractice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Thu"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"intervals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"formats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPractice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Fri"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"intervals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"formats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPractice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Sat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"intervals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"formats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPractice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Sun"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"intervals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"formats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPractice"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"restrictions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"intervals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"formats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPractice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetServiceQuery, GetServiceQueryVariables>;
export const GetSpecialistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSpecialist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"specialist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"practices"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"specialties"}},{"kind":"Field","name":{"kind":"Name","value":"education"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"certificate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"certificates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"certificate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"experience"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"services"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"contents"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"includes"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"video"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"practices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slots"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inPerson"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"practices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slots"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"skills"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"isLiked"}},{"kind":"Field","name":{"kind":"Name","value":"rate5"}}]}}]}}]} as unknown as DocumentNode<GetSpecialistQuery, GetSpecialistQueryVariables>;
export const GetLikedSpecialistsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLikedSpecialists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"likedSpecialists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"practices"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"specialties"}},{"kind":"Field","name":{"kind":"Name","value":"education"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"certificate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"certificates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"certificate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"experience"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"services"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"contents"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"includes"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"video"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"practices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slots"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inPerson"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"practices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slots"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"skills"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"isLiked"}},{"kind":"Field","name":{"kind":"Name","value":"rate5"}}]}}]}}]} as unknown as DocumentNode<GetLikedSpecialistsQuery, GetLikedSpecialistsQueryVariables>;