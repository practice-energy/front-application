import React, { useState } from 'react';
import {
  useGetMe,
  useGetSpecialists,
  useGetServices,
  useGetBookings,
  useGetChats,
  useCreateBooking,
  useSendMessage,
  useLikeSpecialist,
  useSearch,
  useMessageAdded,
  useOptimisticUpdate,
} from './graphql-hooks';
import {
  CreateBookingInput,
  SendMessageInput,
  SearchInput,
} from './graphql-types';

// ==================== USER PROFILE COMPONENT ====================

export const UserProfile: React.FC = () => {
  const { data, loading, error } = useGetMe();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data?.me) return <div>No user data</div>;

  const user = data.me;

  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
      <p>Location: {user.location}</p>
      <p>Timezone: {user.timezone}</p>
      <p>Hat: {user.hat}</p>
      <p>Tier: {user.tier}</p>
      <p>Practice: {user.practice}</p>
      
      {user.specialistProfile && (
        <div className="specialist-info">
          <h2>Specialist Profile</h2>
          <p>Title: {user.specialistProfile.title}</p>
          <p>Specialties: {user.specialistProfile.specialties.join(', ')}</p>
          <p>Likes: {user.specialistProfile.likes}</p>
        </div>
      )}
    </div>
  );
};

// ==================== SPECIALISTS LIST COMPONENT ====================

export const SpecialistsList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  
  const { data, loading, error } = useGetSpecialists({
    search,
    location,
    pagination: { page: 1, limit: 10 },
  });

  const [likeSpecialist] = useLikeSpecialist();

  const handleLike = async (specialistId: string) => {
    try {
      await likeSpecialist({ variables: { id: specialistId } });
    } catch (error) {
      console.error('Error liking specialist:', error);
    }
  };

  if (loading) return <div>Loading specialists...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="specialists-list">
      <div className="filters">
        <input
          type="text"
          placeholder="Search specialists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="specialists-grid">
        {data?.specialists.map((specialist) => (
          <div key={specialist.id} className="specialist-card">
            <img src={specialist.avatar} alt={specialist.name} />
            <h3>{specialist.name}</h3>
            <p>{specialist.title}</p>
            <p>{specialist.location}</p>
            <p>Likes: {specialist.likes}</p>
            <button
              onClick={() => handleLike(specialist.id)}
              className={specialist.isLiked ? 'liked' : ''}
            >
              {specialist.isLiked ? '❤️' : '🤍'} Like
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== SERVICES LIST COMPONENT ====================

export const ServicesList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [format, setFormat] = useState<'VIDEO' | 'IN_PERSON' | undefined>();
  
  const { data, loading, error } = useGetServices({
    search,
    format,
    pagination: { page: 1, limit: 10 },
  });

  if (loading) return <div>Loading services...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="services-list">
      <div className="filters">
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={format || ''}
          onChange={(e) => setFormat(e.target.value as 'VIDEO' | 'IN_PERSON' | undefined)}
        >
          <option value="">All formats</option>
          <option value="VIDEO">Video</option>
          <option value="IN_PERSON">In Person</option>
        </select>
      </div>

      <div className="services-grid">
        {data?.services.map((service) => (
          <div key={service.id} className="service-card">
            <img src={service.images[0]} alt={service.title} />
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <p>Location: {service.location}</p>
            <p>Tags: {service.tags.join(', ')}</p>
            <p>Reviews: {service.reviews.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== BOOKING COMPONENT ====================

export const BookingComponent: React.FC<{ serviceId: string; specialistId: string }> = ({
  serviceId,
  specialistId,
}) => {
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState(60);
  const [format, setFormat] = useState<'VIDEO' | 'IN_PERSON'>('VIDEO');
  
  const [createBooking, { loading, error }] = useCreateBooking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookingInput: CreateBookingInput = {
      serviceId,
      specialistId,
      date,
      duration,
      slots: Math.ceil(duration / 60),
      format,
    };

    try {
      const result = await createBooking({ variables: { input: bookingInput } });
      console.log('Booking created:', result.data?.createBooking);
      // Reset form or redirect
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <h2>Book a Session</h2>
      
      <div className="form-group">
        <label>Date:</label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Duration (minutes):</label>
        <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
          <option value={90}>1.5 hours</option>
          <option value={120}>2 hours</option>
        </select>
      </div>

      <div className="form-group">
        <label>Format:</label>
        <select value={format} onChange={(e) => setFormat(e.target.value as 'VIDEO' | 'IN_PERSON')}>
          <option value="VIDEO">Video</option>
          <option value="IN_PERSON">In Person</option>
        </select>
      </div>

      {error && <div className="error">{error.message}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Book Session'}
      </button>
    </form>
  );
};

// ==================== CHAT COMPONENT ====================

export const ChatComponent: React.FC<{ chatId: string }> = ({ chatId }) => {
  const [message, setMessage] = useState('');
  
  const { data: chatData } = useGetChat(chatId);
  const [sendMessage] = useSendMessage();
  
  // Subscribe to new messages
  const { data: newMessage } = useMessageAdded(chatId);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const messageInput: SendMessageInput = {
      chatId,
      content: message,
      type: 'USER',
    };

    try {
      await sendMessage({ variables: { input: messageInput } });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!chatData?.chat) return <div>Loading chat...</div>;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>{chatData.chat.title}</h2>
      </div>

      <div className="messages-container">
        {chatData.chat.messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.type.toLowerCase()}`}>
            <div className="message-content">{msg.content}</div>
            <div className="message-timestamp">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        
        {newMessage?.messageAdded && (
          <div className={`message ${newMessage.messageAdded.type.toLowerCase()}`}>
            <div className="message-content">{newMessage.messageAdded.content}</div>
            <div className="message-timestamp">
              {new Date(newMessage.messageAdded.timestamp).toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={!message.trim()}
        />
        <button type="submit" disabled={!message.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

// ==================== SEARCH COMPONENT ====================

export const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState('');
  const [search, { data, loading, error }] = useSearch();

  const handleSearch = async () => {
    if (!query.trim()) return;

    const searchInput: SearchInput = {
      query: query.trim(),
      pagination: { page: 1, limit: 10 },
    };

    try {
      await search({ variables: { input: searchInput } });
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <div className="search-container">
      <div className="search-input">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search specialists and services..."
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <div className="error">{error.message}</div>}

      {data?.search && (
        <div className="search-results">
          <h3>Specialists ({data.search.specialists.length})</h3>
          <div className="specialists-results">
            {data.search.specialists.map((specialist) => (
              <div key={specialist.id} className="specialist-result">
                <img src={specialist.avatar} alt={specialist.name} />
                <div>
                  <h4>{specialist.name}</h4>
                  <p>{specialist.title}</p>
                  <p>{specialist.location}</p>
                </div>
              </div>
            ))}
          </div>

          <h3>Services ({data.search.services.length})</h3>
          <div className="services-results">
            {data.search.services.map((service) => (
              <div key={service.id} className="service-result">
                <img src={service.images[0]} alt={service.title} />
                <div>
                  <h4>{service.title}</h4>
                  <p>{service.description}</p>
                  <p>by {service.specialist.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== OPTIMISTIC UPDATE EXAMPLE ====================

export const OptimisticLikeButton: React.FC<{ specialistId: string; initialLiked: boolean }> = ({
  specialistId,
  initialLiked,
}) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(0);

  const optimisticUpdate = useOptimisticUpdate(
    GET_SPECIALISTS,
    {},
    (data, optimisticData) => {
      // Update the specialists list optimistically
      return {
        ...data,
        specialists: data.specialists.map((specialist) =>
          specialist.id === specialistId
            ? { ...specialist, likes: specialist.likes + 1, isLiked: true }
            : specialist
        ),
      };
    }
  );

  const handleLike = async () => {
    setIsLiked(true);
    setLikeCount(prev => prev + 1);

    try {
      await optimisticUpdate({
        likeSpecialist: { id: specialistId }
      });
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(false);
      setLikeCount(prev => prev - 1);
      console.error('Error liking specialist:', error);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={isLiked ? 'liked' : ''}
      disabled={isLiked}
    >
      {isLiked ? '❤️' : '🤍'} Like ({likeCount})
    </button>
  );
};

// ==================== DASHBOARD COMPONENT ====================

export const DashboardComponent: React.FC<{ userId: string }> = ({ userId }) => {
  const { data, loading, error } = useGetDashboardStats(userId);
  const { data: bookingsData } = useGetBookings({ userId });

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data?.dashboardStats) return <div>No dashboard data</div>;

  const stats = data.dashboardStats;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p>{stats.totalBookings}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p>{stats.completedBookings}</p>
        </div>
        <div className="stat-card">
          <h3>Cancelled</h3>
          <p>{stats.cancelledBookings}</p>
        </div>
        <div className="stat-card">
          <h3>Total Earnings</h3>
          <p>${stats.totalEarnings}</p>
        </div>
        <div className="stat-card">
          <h3>Average Rating</h3>
          <p>{stats.averageRating.toFixed(1)} ⭐</p>
        </div>
        <div className="stat-card">
          <h3>Reviews</h3>
          <p>{stats.reviewsCount}</p>
        </div>
      </div>

      <div className="upcoming-bookings">
        <h2>Upcoming Bookings</h2>
        {stats.upcomingBookings.map((booking) => (
          <div key={booking.id} className="booking-item">
            <h4>{booking.service.title}</h4>
            <p>with {booking.specialist.name}</p>
            <p>{new Date(booking.date).toLocaleDateString()}</p>
            <p>Status: {booking.status}</p>
          </div>
        ))}
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        {stats.recentActivity.map((activity) => (
          <div key={activity.id} className="activity-item">
            <h4>{activity.title}</h4>
            <p>{activity.description}</p>
            <p>{new Date(activity.timestamp).toLocaleDateString()}</p>
            <span className={`status ${activity.status.toLowerCase()}`}>
              {activity.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
