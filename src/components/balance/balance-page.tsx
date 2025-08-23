"use client"

import { BalanceHeader } from "./balance-header"
import { BalanceContent } from "./balance-content"
import { useIsMobile } from "@/hooks/use-mobile"

export function BalancePage() {
  const isMobile = useIsMobile()
  return (
    <div className="w-full max-w-[845px] mx-auto bg-white shadow-custom-card mt-24 rounded-sm">
      <BalanceHeader
          isMobile={isMobile}
      />
      <BalanceContent />
    </div>
  )
}
