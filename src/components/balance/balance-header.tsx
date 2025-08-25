"use client"

import { BalanceHeaderIcons } from "./balance-header-icons"
import {Balance} from "@/types/balance";
import {SettingsMobileHeader} from "@/components/header/components/balance-mobile-header";
import {User} from "@/types/user";

type BalanceHeaderProps = {
    isMobile: boolean
    toggleSidebar: () => void
    isAuthenticated: boolean
    user?: User
}

export function BalanceHeader({
    isMobile, toggleSidebar, user, isAuthenticated
  }: BalanceHeaderProps) {
  if (isMobile) {
      return (
          <>
              <SettingsMobileHeader
                  toggleSidebar={toggleSidebar}
                  user={user}
                  isAuthenticated={isAuthenticated}
                  title="Баланс и планы"
              />
          </>
      )
  }

  return (
    <div className="bg-black text-white h-[106px] flex items-center justify-between rounded-t-sm px-9">
      <div className="text-[24px] font-medium">Баланс и планы</div>
      <BalanceHeaderIcons
          isMobile={isMobile}
      />
    </div>
  )
}
