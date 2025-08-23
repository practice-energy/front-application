"use client"

import {DollarSign, BanknoteArrowUp, BanknoteArrowDown} from "lucide-react"
import {RubleIcon} from "@/components/ui/ruble-sign";
import {UserSwitchIcon} from "@phosphor-icons/react";

type BalanceHeaderIconsProps = {
    isMobile: boolean
}

export function BalanceHeaderIcons({isMobile}: BalanceHeaderIconsProps) {
  return (
    <div className="flex items-center gap-2">
      <DollarSign size={24} />
      <div className="flex flex-col items-center gap-2">
          {!isMobile && ( <div className="flex items-center">
              <BanknoteArrowUp size={24} className="transform  -scale-y-100"/>
          </div>)}
          <UserSwitchIcon size={36} />
          {!isMobile && (<div className="flex items-center">
              <BanknoteArrowDown size={24} className="transform -scale-x-100 -scale-y-100" />
          </div>)}
      </div>
      <RubleIcon size={24} bold={false} />
    </div>
  )
}
