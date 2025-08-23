import { gql } from '@apollo/client'

export const CREATE_CALENDAR = gql`
  mutation CreateCalendar($input: CreateCalendarInput!) {
    createCalendar(input: $input)
  }
`

export const UPDATE_CALENDAR = gql`
  mutation UpdateCalendar($input: UpdateCalendarInput!) {
    updateCalendar(input: $input)
  }
`
