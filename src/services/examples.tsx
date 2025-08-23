import React from 'react'
import { useGetMe, useGetSpecialist, useLikeSpecialist } from './index'

// Пример компонента профиля пользователя
export const UserProfile: React.FC = () => {
  const { data: user, loading, error } = useGetMe()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!user) return <div>No user data</div>

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <p>{user.bio}</p>
      <p>Location: {user.location}</p>
      <p>Hat: {user.hat}</p>
      <p>Tier: {user.tier}</p>
      <p>Practice: {user.practice}</p>
    </div>
  )
}

// Пример компонента профиля специалиста
export const SpecialistProfile: React.FC<{ id: string }> = ({ id }) => {
  const { data: specialist, loading, error } = useGetSpecialist({ id })
  const [likeSpecialist] = useLikeSpecialist()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!specialist) return <div>No specialist data</div>

  const handleLike = () => {
    likeSpecialist({ variables: { id } })
  }

  return (
    <div>
      <h1>{specialist.name}</h1>
      <p>{specialist.title}</p>
      <p>{specialist.description}</p>
      <p>Location: {specialist.location}</p>
      <p>Practices: {specialist.practices}</p>
      <p>Likes: {specialist.likes}</p>
      <p>Rating: {specialist.rate5}</p>
      <button onClick={handleLike}>
        {specialist.isLiked ? 'Unlike' : 'Like'}
      </button>
      
      <h2>Services</h2>
      {specialist.services.map(service => (
        <div key={service.id}>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
          <p>Location: {service.location}</p>
        </div>
      ))}
    </div>
  )
}

// Пример компонента списка избранных специалистов
export const LikedSpecialistsList: React.FC = () => {
  const { data: specialists, loading, error } = useGetLikedSpecialists()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!specialists) return <div>No specialists data</div>

  return (
    <div>
      <h1>Liked Specialists</h1>
      {specialists.map(specialist => (
        <div key={specialist.id}>
          <h3>{specialist.name}</h3>
          <p>{specialist.title}</p>
          <p>Location: {specialist.location}</p>
          <p>Likes: {specialist.likes}</p>
        </div>
      ))}
    </div>
  )
}

// Пример компонента календаря
export const CalendarView: React.FC<{ hat: string }> = ({ hat }) => {
  const { data: calendar, loading, error } = useGetCalendar({ hat })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!calendar) return <div>No calendar data</div>

  return (
    <div>
      <h1>Calendar</h1>
      <p>GMT: {calendar.calendarRestrictions.gmt}</p>
      <p>Location: {calendar.calendarRestrictions.location}</p>
      
      <h2>Bookings</h2>
      {calendar.bookings?.map(booking => (
        <div key={booking.id}>
          <h3>{booking.service.title}</h3>
          <p>Date: {booking.date}</p>
          <p>Duration: {booking.duration}</p>
          <p>Format: {booking.format}</p>
          <p>Status: {booking.status}</p>
        </div>
      ))}
    </div>
  )
}

// Пример компонента дашборда
export const DashboardView: React.FC = () => {
  const { data: dashboard, loading, error } = useGetDashboard()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!dashboard) return <div>No dashboard data</div>

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Hat: {dashboard.hat}</p>
      
      <h2>Upcoming Activities</h2>
      {dashboard.upcomingActivities?.map(activity => (
        <div key={activity.id}>
          <h3>{activity.service?.title}</h3>
          <p>Date: {activity.date}</p>
          <p>Duration: {activity.duration}</p>
          <p>Format: {activity.format}</p>
          <p>Status: {activity.status}</p>
          <p>Price: {activity.price}</p>
        </div>
      ))}
    </div>
  )
}
