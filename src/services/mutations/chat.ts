import { gql } from '@apollo/client'

export const ADD_CHAT = gql`
  mutation AddChat($input: AddChatInput!) {
    addChat(input: $input)
  }
`

export const PUSH_MESSAGE = gql`
  mutation PushMessage($input: MessageInput) {
    pushMessage(input: $input)
  }
`

export const ACK_MESSAGES = gql`
  mutation AckMessages($hat: UserHat) {
    ackMessages(hat: $hat)
  }
`
