import { gql } from '@apollo/client'

export const GET_CALENDAR = gql`
  query GetCalendar($hat: UserHat!) {
    calendar(hat: $hat) {
      calendarRestrictions {
        id
        gmt
        commons {
          Mon {
            id
            date
            isActive
            intervals {
              start
              end
              formats
            }
            isPractice
          }
          Tue {
            id
            date
            isActive
            intervals {
              start
              end
              formats
            }
            isPractice
          }
          Wed {
            id
            date
            isActive
            intervals {
              start
              end
              formats
            }
            isPractice
          }
          Thu {
            id
            date
            isActive
            intervals {
              start
              end
              formats
            }
            isPractice
          }
          Fri {
            id
            date
            isActive
            intervals {
              start
              end
              formats
            }
            isPractice
          }
          Sat {
            id
            date
            isActive
            intervals {
              start
              end
              formats
            }
            isPractice
          }
          Sun {
            id
            date
            isActive
            intervals {
              start
              end
              formats
            }
            isPractice
          }
        }
        restrictions {
          id
          date
          isActive
          intervals {
            start
            end
            formats
          }
          isPractice
        }
        location
      }
      bookings {
        id
        date
        duration
        format
        status
        createdAt
        updatedAt
        isRepeat
        price
      }
    }
  }
`

export const GET_DASHBOARD = gql`
  query GetDashboard {
    dashboard {
      hat
      upcomingActivities {
        id
        startTime
        endTime
        date
        status
        createdAt
        updatedAt
        isRepeat
        duration
        format
        price
        service {
          id
          title
          description
        }
        specialist {
          id
          name
          avatar
        }
        user {
          id
          name
          avatar
        }
        practiceCount
      }
    }
  }
`
