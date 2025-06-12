export interface User {
  id: string
  first_name: string
  last_name: string
  email: {
    address: string
    verified: boolean
  }
  photo_url: string
  created_at: string
  account_balance: number
  tier: string
  isSpecialist?: boolean
}
