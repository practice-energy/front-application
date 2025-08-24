"use client"

import {Subscription} from "@/types/balance";
import {cn} from "@/lib/utils";
import {IconPractice2} from "@/components/icons/prractice-2-logo";
import {Hat, Tier} from "@/types/user";
import {IconPractice} from "@/components/icons/icon-practice";
import {RubleIcon} from "@/components/ui/ruble-sign";
import {formatNumber} from "@/utils/format";
import {UserSwitchIcon} from "@phosphor-icons/react";
import {ActivityStatus} from "@/components/ui/activity-status";
import React from "react";

function tierName(tier: Tier) {
  switch (tier) {
    case "pure":
      return "Pure"
    case "practice":
      return "Practice"
    case "pro":
      return "Senti Pro"
  }
}

function renderPlanIcon(tier ) {
  switch (tier) {
    case "pure":
      return <div className="border border-neutral-900 rounded-sm items-center justify-center py-[17px] px-0.5 transition-all duration-500 ease-in-out">
        <IconPractice2 width={36} height={42}/>
      </div>
    case "practice":
      return <div className="border border-neutral-900 rounded-sm items-center justify-center py-[20px] px-0.5 transition-all duration-500 ease-in-out">
        <IconPractice width={36} height={32}/>
      </div>
    case "pro":
      return <div className="border border-neutral-900 bg-neutral-900 rounded-sm items-center justify-center py-[22px] px-0.5 transition-all duration-500 ease-in-out">
        <IconPractice width={36} height={32} className="text-white"/>
      </div>
  }

  return null
}

function renderHat(hat: Hat ) {
  switch (hat) {
    case "adept":
      return <div className="flex flex-row gap-1.5 text-neutral-900 items-center transition-all duration-500 ease-in-out">
        <div className="text-sm">
          Инициант
        </div>
        <UserSwitchIcon size={18}/>
      </div>
    case "master":
      return <div className="flex flex-row gap-1.5 text-colors-custom-accent items-center transition-all duration-500 ease-in-out">
        <div className="text-sm">
          Мастер
        </div>
        <UserSwitchIcon size={18}/>
      </div>
  }

  return null
}

interface SubscriptionPayCardProps {
  plan: Subscription
  period: 'month' | 'year'
  payed: boolean
}

export function SubscriptionPayCard({ plan, period, payed }: SubscriptionPayCardProps) {
  return (
    <div className={cn(
        "bg-white shadow-custom rounded-sm w-full border border-neutral-900 transition-opacity duration-500 ease-in-out",
    )}>
      <div className="p-1 flex flex-row gap-3">
        {renderPlanIcon(plan.tier)}
        <div className="flex items-center justify-between flex-1">
          <div className="flex flex-col">
            <div className="text-sm font-medium text-neutral-900 whitespace-nowrap transition-all duration-500 ease-in-out">
              План подписки:
            </div>
            <div className="text-sm font-medium text-neutral-900 whitespace-nowrap transition-all duration-500 ease-in-out">
              {tierName(plan.tier)} / {period === 'month' ? '30 дней' : '1 год'}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 pr-0.5 ">
            <div className="flex flex-row gap-1.5 text-sm transition-all duration-500 ease-in-out">
              <ActivityStatus status={plan.isActive ? 'payed' : 'unpayed'} showTitle={false} />
            </div>
            <div className="flex flex-row text-sm font-medium items-center transition-all duration-500 ease-in-out">
              {formatNumber(plan.price)}
              <RubleIcon size={24} bold={false} className="ml-1" />
            </div>
            {renderHat(plan.hat)}
          </div>
        </div>
      </div>
    </div>
  )
}
