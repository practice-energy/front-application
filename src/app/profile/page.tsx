"use client"

import { ProfileDashboard } from "@/src/components/profile/profile-dashboard"
import {useAuth} from "@/src/hooks/use-auth";
import {useRouter} from "next/navigation";

export default function ProfilePage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  if (!isAuthenticated) {
    router.push("/")
  }

  return <ProfileDashboard />
}
