import { gql } from '@apollo/client'

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
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
      specialistProfile {
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
      isSpecialist
      hat
      tier
      practice
    }
  }
`

export const GET_USER = gql`
  query GetUser($id: UUID!) {
    user(id: $id) {
      id
      email
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
      specialistProfile {
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
      isSpecialist
      hat
      tier
      practice
    }
  }
`
