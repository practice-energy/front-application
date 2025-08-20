import { gql } from '@apollo/client';

// ==================== USER QUERIES ====================

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email {
        address
      }
      bio
      name
      location
      avatar
      timezone
      createdAt
      preferences {
        language
      }
      education {
        title
        description
        certificate
      }
      certificates {
        title
        description
        certificate
      }
      experience {
        description
      }
      specialistProfile {
        id
        name
        title
        avatar
        practices
        location
        description
        specialties
        skills
        likes
        rate5
      }
      isSpecialist
      hat
      tier
      practice
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      email {
        address
      }
      bio
      name
      location
      avatar
      timezone
      createdAt
      preferences {
        language
      }
      education {
        title
        description
        certificate
      }
      certificates {
        title
        description
        certificate
      }
      experience {
        description
      }
      specialistProfile {
        id
        name
        title
        avatar
        practices
        location
        description
        specialties
        skills
        likes
        rate5
      }
      isSpecialist
      hat
      tier
      practice
    }
  }
`;

export const GET_USER_STATS = gql`
  query GetUserStats($id: ID!) {
    userStats(id: $id) {
      totalBookings
      completedBookings
      cancelledBookings
      totalEarnings
      averageRating
      reviewsCount
    }
  }
`;

// ==================== SPECIALIST QUERIES ====================

export const GET_SPECIALISTS = gql`
  query GetSpecialists(
    $search: String
    $location: String
    $specialties: [String!]
    $rating: Float
    $pagination: PaginationInput
  ) {
    specialists(
      search: $search
      location: $location
      specialties: $specialties
      rating: $rating
      pagination: $pagination
    ) {
      id
      name
      title
      avatar
      practices
      location
      description
      specialties
      education {
        title
        description
        certificate
      }
      certificates {
        title
        description
        certificate
      }
      experience {
        description
      }
      skills
      likes
      isLiked
      rate5
    }
  }
`;

export const GET_SPECIALIST = gql`
  query GetSpecialist($id: ID!) {
    specialist(id: $id) {
      id
      name
      title
      avatar
      practices
      location
      description
      specialties
      education {
        title
        description
        certificate
      }
      certificates {
        title
        description
        certificate
      }
      experience {
        description
      }
      services {
        id
        title
        description
        location
        images
        tags
        settings {
          video {
            score
            enabled
          }
          inPerson {
            score
            enabled
          }
        }
      }
      skills
      likes
      isLiked
      rate5
    }
  }
`;

// ==================== SERVICE QUERIES ====================

export const GET_SERVICES = gql`
  query GetServices(
    $search: String
    $specialistId: ID
    $format: Format
    $priceRange: PriceRangeInput
    $tags: [String!]
    $pagination: PaginationInput
  ) {
    services(
      search: $search
      specialistId: $specialistId
      format: $format
      priceRange: $priceRange
      tags: $tags
      pagination: $pagination
    ) {
      id
      title
      location
      description
      contents
      images
      includes
      specialist {
        id
        name
        title
        avatar
      }
      settings {
        video {
          practices {
            id
            slots
            duration
            price
          }
          score
          enabled
        }
        inPerson {
          practices {
            id
            slots
            duration
            price
          }
          score
          enabled
        }
      }
      tags
      reviews {
        id
        rating
        comment
        author
        createdAt
      }
    }
  }
`;

export const GET_SERVICE = gql`
  query GetService($id: ID!) {
    service(id: $id) {
      id
      title
      location
      description
      contents
      images
      includes
      specialist {
        id
        name
        title
        avatar
      }
      settings {
        video {
          practices {
            id
            slots
            duration
            price
          }
          score
          enabled
        }
        inPerson {
          practices {
            id
            slots
            duration
            price
          }
          score
          enabled
        }
      }
      tags
      reviews {
        id
        rating
        comment
        author
        createdAt
      }
      bookings {
        id
        date
        duration
        slots
        format
        status
        price
      }
      calendarRestrictions {
        id
        timezone
        workingHours {
          monday {
            isWorking
            startTime
            endTime
          }
          tuesday {
            isWorking
            startTime
            endTime
          }
          wednesday {
            isWorking
            startTime
            endTime
          }
          thursday {
            isWorking
            startTime
            endTime
          }
          friday {
            isWorking
            startTime
            endTime
          }
          saturday {
            isWorking
            startTime
            endTime
          }
          sunday {
            isWorking
            startTime
            endTime
          }
        }
        exceptions {
          id
          date
          isWorking
          startTime
          endTime
        }
        formats
      }
    }
  }
`;

// ==================== BOOKING QUERIES ====================

export const GET_BOOKINGS = gql`
  query GetBookings(
    $userId: ID
    $specialistId: ID
    $status: BookingStatus
    $dateFrom: DateTime
    $dateTo: DateTime
    $pagination: PaginationInput
  ) {
    bookings(
      userId: $userId
      specialistId: $specialistId
      status: $status
      dateFrom: $dateFrom
      dateTo: $dateTo
      pagination: $pagination
    ) {
      id
      service {
        id
        title
        description
        price
        duration
      }
      specialist {
        id
        name
        avatar
        practiceCount
      }
      date
      duration
      slots
      format
      status
      createdAt
      updatedAt
      isRepeat
      price
    }
  }
`;

export const GET_BOOKING = gql`
  query GetBooking($id: ID!) {
    booking(id: $id) {
      id
      service {
        id
        title
        description
        price
        duration
      }
      specialist {
        id
        name
        avatar
        practiceCount
      }
      date
      duration
      slots
      format
      status
      createdAt
      updatedAt
      isRepeat
      price
    }
  }
`;

export const GET_AVAILABLE_SLOTS = gql`
  query GetAvailableSlots(
    $serviceId: ID!
    $specialistId: ID!
    $dateFrom: DateTime!
    $dateTo: DateTime!
  ) {
    availableSlots(
      serviceId: $serviceId
      specialistId: $specialistId
      dateFrom: $dateFrom
      dateTo: $dateTo
    ) {
      date
      slots
    }
  }
`;

// ==================== CHAT QUERIES ====================

export const GET_CHATS = gql`
  query GetChats(
    $userId: ID
    $isAI: Boolean
    $status: ChatStatus
    $pagination: PaginationInput
  ) {
    chats(
      userId: $userId
      isAI: $isAI
      status: $status
      pagination: $pagination
    ) {
      id
      title
      specialistId
      serviceId
      avatar
      isAI
      isAIEnabled
      status
      timestamp
      isMuted
      createdAt
      hasNew
      description
      isSpecialChat
    }
  }
`;

export const GET_CHAT = gql`
  query GetChat($id: ID!) {
    chat(id: $id) {
      id
      title
      specialistId
      serviceId
      avatar
      isAI
      isAIEnabled
      status
      timestamp
      isMuted
      createdAt
      hasNew
      description
      isSpecialChat
      messages {
        id
        type
        content
        timestamp
        specialists {
          id
          name
          title
          avatar
        }
        services {
          id
          title
          description
        }
        files {
          id
          name
          url
          size
          type
        }
        replyTo
        aiMessageType
        tags {
          name
          subtags {
            name
          }
        }
        footerContent
        bookingFrame
        bookingTextTitle
        testQuestion
        questionIndex
      }
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages($chatId: ID!, $pagination: PaginationInput) {
    messages(chatId: $chatId, pagination: $pagination) {
      id
      type
      content
      timestamp
      specialists {
        id
        name
        title
        avatar
      }
      services {
        id
        title
        description
      }
      files {
        id
        name
        url
        size
        type
      }
      replyTo
      aiMessageType
      tags {
        name
        subtags {
          name
        }
      }
      footerContent
      bookingFrame
      bookingTextTitle
      testQuestion
      questionIndex
    }
  }
`;

// ==================== DASHBOARD QUERIES ====================

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats($userId: ID!) {
    dashboardStats(userId: $userId) {
      totalBookings
      completedBookings
      cancelledBookings
      totalEarnings
      averageRating
      reviewsCount
      upcomingBookings {
        id
        service {
          id
          title
          description
          price
          duration
        }
        specialist {
          id
          name
          avatar
          practiceCount
        }
        date
        duration
        slots
        format
        status
        price
      }
      recentActivity {
        id
        type
        title
        description
        timestamp
        status
      }
    }
  }
`;

// ==================== SEARCH QUERIES ====================

export const SEARCH = gql`
  query Search($input: SearchInput!) {
    search(input: $input) {
      specialists {
        id
        name
        title
        avatar
        practices
        location
        description
        specialties
        skills
        likes
        rate5
      }
      services {
        id
        title
        description
        location
        images
        tags
        specialist {
          id
          name
          title
          avatar
        }
      }
      total
      hasMore
    }
  }
`;

// ==================== USER MUTATIONS ====================

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email {
        address
      }
      bio
      name
      location
      avatar
      timezone
      createdAt
      preferences {
        language
      }
      isSpecialist
      hat
      tier
      practice
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      email {
        address
      }
      bio
      name
      location
      avatar
      timezone
      preferences {
        language
      }
      isSpecialist
      hat
      tier
      practice
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

// ==================== SPECIALIST MUTATIONS ====================

export const CREATE_SPECIALIST = gql`
  mutation CreateSpecialist($input: CreateSpecialistInput!) {
    createSpecialist(input: $input) {
      id
      name
      title
      avatar
      practices
      location
      description
      specialties
      education {
        title
        description
        certificate
      }
      certificates {
        title
        description
        certificate
      }
      experience {
        description
      }
      skills
      likes
      rate5
    }
  }
`;

export const UPDATE_SPECIALIST = gql`
  mutation UpdateSpecialist($id: ID!, $input: UpdateSpecialistInput!) {
    updateSpecialist(id: $id, input: $input) {
      id
      name
      title
      avatar
      practices
      location
      description
      specialties
      education {
        title
        description
        certificate
      }
      certificates {
        title
        description
        certificate
      }
      experience {
        description
      }
      skills
      likes
      rate5
    }
  }
`;

export const DELETE_SPECIALIST = gql`
  mutation DeleteSpecialist($id: ID!) {
    deleteSpecialist(id: $id)
  }
`;

export const LIKE_SPECIALIST = gql`
  mutation LikeSpecialist($id: ID!) {
    likeSpecialist(id: $id)
  }
`;

export const UNLIKE_SPECIALIST = gql`
  mutation UnlikeSpecialist($id: ID!) {
    unlikeSpecialist(id: $id)
  }
`;

// ==================== SERVICE MUTATIONS ====================

export const CREATE_SERVICE = gql`
  mutation CreateService($input: CreateServiceInput!) {
    createService(input: $input) {
      id
      title
      location
      description
      contents
      images
      includes
      specialist {
        id
        name
        title
        avatar
      }
      settings {
        video {
          practices {
            id
            slots
            duration
            price
          }
          score
          enabled
        }
        inPerson {
          practices {
            id
            slots
            duration
            price
          }
          score
          enabled
        }
      }
      tags
    }
  }
`;

export const UPDATE_SERVICE = gql`
  mutation UpdateService($id: ID!, $input: UpdateServiceInput!) {
    updateService(id: $id, input: $input) {
      id
      title
      location
      description
      contents
      images
      includes
      specialist {
        id
        name
        title
        avatar
      }
      settings {
        video {
          practices {
            id
            slots
            duration
            price
          }
          score
          enabled
        }
        inPerson {
          practices {
            id
            slots
            duration
            price
          }
          score
          enabled
        }
      }
      tags
    }
  }
`;

export const DELETE_SERVICE = gql`
  mutation DeleteService($id: ID!) {
    deleteService(id: $id)
  }
`;

// ==================== BOOKING MUTATIONS ====================

export const CREATE_BOOKING = gql`
  mutation CreateBooking($input: CreateBookingInput!) {
    createBooking(input: $input) {
      id
      service {
        id
        title
        description
        price
        duration
      }
      specialist {
        id
        name
        avatar
        practiceCount
      }
      date
      duration
      slots
      format
      status
      createdAt
      updatedAt
      isRepeat
      price
    }
  }
`;

export const UPDATE_BOOKING = gql`
  mutation UpdateBooking($id: ID!, $input: UpdateBookingInput!) {
    updateBooking(id: $id, input: $input) {
      id
      service {
        id
        title
        description
        price
        duration
      }
      specialist {
        id
        name
        avatar
        practiceCount
      }
      date
      duration
      slots
      format
      status
      createdAt
      updatedAt
      isRepeat
      price
    }
  }
`;

export const CANCEL_BOOKING = gql`
  mutation CancelBooking($id: ID!) {
    cancelBooking(id: $id) {
      id
      status
      updatedAt
    }
  }
`;

export const CONFIRM_BOOKING = gql`
  mutation ConfirmBooking($id: ID!) {
    confirmBooking(id: $id) {
      id
      status
      updatedAt
    }
  }
`;

// ==================== CHAT MUTATIONS ====================

export const CREATE_CHAT = gql`
  mutation CreateChat($input: CreateChatInput!) {
    createChat(input: $input) {
      id
      title
      specialistId
      serviceId
      avatar
      isAI
      isAIEnabled
      status
      timestamp
      isMuted
      createdAt
      hasNew
      description
      isSpecialChat
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      type
      content
      timestamp
      specialists {
        id
        name
        title
        avatar
      }
      services {
        id
        title
        description
      }
      files {
        id
        name
        url
        size
        type
      }
      replyTo
      aiMessageType
      tags {
        name
        subtags {
          name
        }
      }
      footerContent
      bookingFrame
      bookingTextTitle
      testQuestion
      questionIndex
    }
  }
`;

export const UPDATE_CHAT = gql`
  mutation UpdateChat($id: ID!, $input: UpdateChatInput!) {
    updateChat(id: $id, input: $input) {
      id
      title
      specialistId
      serviceId
      avatar
      isAI
      isAIEnabled
      status
      timestamp
      isMuted
      createdAt
      hasNew
      description
      isSpecialChat
    }
  }
`;

export const DELETE_CHAT = gql`
  mutation DeleteChat($id: ID!) {
    deleteChat(id: $id)
  }
`;

// ==================== FEEDBACK MUTATIONS ====================

export const CREATE_FEEDBACK = gql`
  mutation CreateFeedback($input: CreateFeedbackInput!) {
    createFeedback(input: $input) {
      id
      rating
      comment
      author
      createdAt
    }
  }
`;

export const UPDATE_FEEDBACK = gql`
  mutation UpdateFeedback($id: ID!, $input: UpdateFeedbackInput!) {
    updateFeedback(id: $id, input: $input) {
      id
      rating
      comment
      author
      createdAt
    }
  }
`;

export const DELETE_FEEDBACK = gql`
  mutation DeleteFeedback($id: ID!) {
    deleteFeedback(id: $id)
  }
`;

// ==================== SUBSCRIPTIONS ====================

export const MESSAGE_ADDED = gql`
  subscription MessageAdded($chatId: ID!) {
    messageAdded(chatId: $chatId) {
      id
      type
      content
      timestamp
      specialists {
        id
        name
        title
        avatar
      }
      services {
        id
        title
        description
      }
      files {
        id
        name
        url
        size
        type
      }
      replyTo
      aiMessageType
      tags {
        name
        subtags {
          name
        }
      }
      footerContent
      bookingFrame
      bookingTextTitle
      testQuestion
      questionIndex
    }
  }
`;

export const BOOKING_UPDATED = gql`
  subscription BookingUpdated($bookingId: ID!) {
    bookingUpdated(bookingId: $bookingId) {
      id
      service {
        id
        title
        description
        price
        duration
      }
      specialist {
        id
        name
        avatar
        practiceCount
      }
      date
      duration
      slots
      format
      status
      createdAt
      updatedAt
      isRepeat
      price
    }
  }
`;

export const CHAT_UPDATED = gql`
  subscription ChatUpdated($chatId: ID!) {
    chatUpdated(chatId: $chatId) {
      id
      title
      specialistId
      serviceId
      avatar
      isAI
      isAIEnabled
      status
      timestamp
      isMuted
      createdAt
      hasNew
      description
      isSpecialChat
    }
  }
`;
