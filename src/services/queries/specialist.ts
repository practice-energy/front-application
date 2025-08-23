import { gql } from '@apollo/client'

export const GET_SPECIALIST = gql`
  query GetSpecialist($id: UUID!) {
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
        id
        title
        description
        certificate
      }
      certificates {
        id
        title
        description
        certificate
      }
      experience {
        id
        description
      }
      services {
        id
        title
        location
        description
        contents
        images
        includes
        tags
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
        createdAt
        updatedAt
      }
      skills
      likes
      isLiked
      rate5
    }
  }
`

export const GET_LIKED_SPECIALISTS = gql`
  query GetLikedSpecialists {
    likedSpecialists {
      id
      name
      title
      avatar
      practices
      location
      description
      specialties
      education {
        id
        title
        description
        certificate
      }
      certificates {
        id
        title
        description
        certificate
      }
      experience {
        id
        description
      }
      services {
        id
        title
        location
        description
        contents
        images
        includes
        tags
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
        createdAt
        updatedAt
      }
      skills
      likes
      isLiked
      rate5
    }
  }
`
