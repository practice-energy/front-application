import { useRequireAuth } from "@/hooks/use-require-auth"

export default function DashboardPage() {
  const isAuthenticated = useRequireAuth()

  if (!isAuthenticated) {
    return null // or a loading spinner
  }

  // rest of the component remains the same
}
