import { gql } from '@apollo/client'

export const GET_SERVICE = gql`
  query GetService($id: UUID!) {
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
            slots
            duration
            price
          }
          score
          enabled
        }
        inPerson {
          practices {
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
        author
        avatar
        comment
        createdAt
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
      createdAt
      updatedAt
    }
  }
`
