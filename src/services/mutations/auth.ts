import { gql } from '@apollo/client'

export const REQUEST_LOGIN = gql`
  mutation RequestLogin($input: RequestLoginInput!) {
    requestLogin(input: $input)
  }
`

export const VERIFY_LOGIN = gql`
  mutation VerifyLogin($input: VerifyLoginInput!) {
    verifyLogin(input: $input) {
      accessToken
      refreshToken
    }
  }
`

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($input: RefreshTokenInput!) {
    refreshToken(input: $input) {
      accessToken
      refreshToken
    }
  }
`

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`

export const TEST_LOGIN = gql`
  mutation TestLogin($input: RequestLoginInput!) {
    testLogin(input: $input) {
      accessToken
      refreshToken
    }
  }
`
