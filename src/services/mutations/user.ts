import { gql } from '@apollo/client'

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput) {
    updateUser(input: $input)
  }
`

export const PUSH_PERSONALITY_TEST = gql`
  mutation PushPersonalityTest($input: PersonalityTestInput) {
    pushPersonalityTest(input: $input)
  }
`
