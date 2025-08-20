"use client"

import { ProfileDashboard } from "@/components/profile/profile-dashboard"
import {useAuth} from "@/hooks/use-auth";
import {useRouter} from "next/navigation";

export default function ProfilePage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  if (!isAuthenticated) {
    router.push("/")
  }

  return <ProfileDashboard />
}
