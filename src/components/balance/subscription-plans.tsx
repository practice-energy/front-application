"use client"

import { SubscriptionPlanCard } from "./subscription-plan-card"
import {Subscription} from "@/types/balance";
import {User} from "@/types/user";
import {BanknoteArrowDown, BanknoteArrowUp, DollarSign} from "lucide-react";
import {UserSwitchIcon} from "@phosphor-icons/react";
import {RubleIcon} from "@/components/ui/ruble-sign";
import React from "react";

type BalanceContentProps = {
  isMobile: boolean
  subscriptions: Subscription[]
  user?: User
}

export function SubscriptionPlans({isMobile, subscriptions}: BalanceContentProps) {
  return (
    <div className="space-y-4">
      <div className="text-lg font-medium flex flex-row  items-centertext-neutral-900 justify-between">
        <div>Планы подписки</div>
          <div className="flex items-center flex-row gap-2">
              <DollarSign size={24} className="text-colors-custom-accent"/>
              <UserSwitchIcon size={36} />
              <p className="text-[24px] font-normal pl-1 mt-0.5">₽</p>
          </div>
      </div>
      
      <div className="space-y-3">
        {subscriptions.map((plan) => (
          <SubscriptionPlanCard key={plan.id} plan={plan} isMobile={isMobile}/>
        ))}
      </div>
    </div>
  )
}
