import { gql } from '@apollo/client'

export const BOOK_SLOT = gql`
  mutation BookSlot($input: BookSlotInput!) {
    bookSlot(input: $input)
  }
`

export const REBOOK_SLOT = gql`
  mutation RebookSlot($input: RebookSlotInput!) {
    rebookSlot(input: $input)
  }
`

export const BURN_BOOKING = gql`
  mutation BurnBooking($id: UUID!) {
    burnBooking(id: $id)
  }
`

export const APPROVE_BOOKING = gql`
  mutation ApproveBooking($id: UUID!, $hat: UserHat!) {
    approveBooking(id: $id, hat: $hat)
  }
`

export const COMPLETE_BOOKING = gql`
  mutation CompleteBooking($id: UUID!, $hat: UserHat!) {
    completeBooking(id: $id, hat: $hat)
  }
`
