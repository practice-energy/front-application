import { gql } from '@apollo/client'

export const UPSCALE_TO_SPECIALIST = gql`
  mutation UpscaleToSpecialist($input: CreateSpecialistInput!) {
    upscaleToSpecialist(input: $input) {
      accessToken
      refreshToken
    }
  }
`

export const UPDATE_SPECIALIST = gql`
  mutation UpdateSpecialist($input: UpdateSpecialistInput!) {
    updateSpecialist(input: $input) {
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

export const LIKE_SPECIALIST = gql`
  mutation LikeSpecialist($id: UUID!) {
    like(id: $id)
  }
`

export const DISLIKE_SPECIALIST = gql`
  mutation DislikeSpecialist($id: UUID!) {
    dislike(id: $id)
  }
`
