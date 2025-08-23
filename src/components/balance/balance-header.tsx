"use client"

import { BalanceHeaderIcons } from "./balance-header-icons"
import {Balance} from "@/types/balance";

type BalanceHeaderProps = {
    isMobile: boolean
}

export function BalanceHeader({
    isMobile,
  }: BalanceHeaderProps) {
  return (
    <div className="bg-black text-white h-[106px] flex items-center justify-between px-9">
      <div className="text-[24px] font-medium">Баланс и планы</div>
      <BalanceHeaderIcons
          isMobile={isMobile}
      />
    </div>
  )
}
