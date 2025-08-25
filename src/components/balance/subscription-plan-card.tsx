"use client"

import { Card, CardContent } from "@/src/components/ui/card"
import {Subscription} from "@/types/balance";
import {cn} from "@/lib/utils";
import {IconPure} from "@/components/icons/prractice-2-logo";
import {Hat, Tier} from "@/types/user";
import {IconPractice} from "@/components/icons/icon-practice";
import {RubleIcon} from "@/components/ui/ruble-sign";
import {formatNumber} from "@/utils/format";
import {UserSwitchIcon} from "@phosphor-icons/react";
import {ActivityStatus} from "@/components/ui/activity-status";

interface PlanIconProps {
  tier: Tier
}

function tierName(tier: Tier) {
  switch (tier) {
    case "pure":
      return "Pure"
    case "practice":
      return "Practice"
    case "pro":
      return "Senti Pro"
    case "pure_senti":
      return "Pure Senti"
  }
}

function renderPlanIcon(tier ) {
  switch (tier) {
    case "pure":
      return <div className="border border-neutral-900 rounded-sm items-center justify-center py-[17px] px-0.5">
        <IconPure width={36} height={42}/>
      </div>
    case "pure_senti":
      return <div className="border border-neutral-900 bg-neutral-900 rounded-sm items-center justify-center py-[17px] px-0.5">
        <IconPure width={36} height={42} className="text-white"/>
      </div>
    case "practice":
      return <div className="border border-neutral-900 rounded-sm items-center justify-center py-[22px] px-0.5">
        <IconPractice width={36} height={32}/>
      </div>
    case "pro":
      return <div className="border  border-neutral-900 bg-neutral-900 rounded-sm items-center justify-center py-[22px] px-0.5">
        <IconPractice width={36} height={32} className="text-white"/>
      </div>
  }

  return null
}

function renderHat(hat: Hat ) {
  switch (hat) {
    case "adept":
      return <div className="flex flex-row gap-1.5  text-neutral-900 items-center">
        <div className="text-sm">
          Инициант
        </div>
        <UserSwitchIcon size={18}/>
      </div>
    case "master":
      return <div className="flex flex-row gap-1.5 text-colors-custom-accent items-center">
        <div className="text-sm">
          Мастер
        </div>
        <UserSwitchIcon size={18}/>
      </div>
  }

  return null
}

interface SubscriptionPlanCardProps {
  isMobile: boolean
  plan: Subscription
}

export function SubscriptionPlanCard({ plan, isMobile }: SubscriptionPlanCardProps) {
  return (
    <div className={cn(
        "bg-white shadow-mid rounded-sm",
        isMobile ? "w-full" : "w-[392px]"
    )}>
      <div className="p-1 flex flex-row gap-4">
        {renderPlanIcon(plan.tier)}
        <div className="flex items-center justify-between gap-3 py-0.5 pr-0.5 flex-1">
          <div className="flex flex-col">
            <div className="text-sm font-medium text-neutral-900 whitespace-nowrap">
              Текущий план подписки:
            </div>
            <div className="text-sm font-medium text-neutral-900">
              {tierName(plan.tier)}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex flex-row gap-1.5 text-sm">
              <div>
                до {plan.endDate ? new Date(plan.endDate).toLocaleDateString('ru-RU') : ''}
              </div>
              <ActivityStatus status={plan.isActive ? 'payed' : 'unpayed'} showTitle={false} />
            </div>
            <div className="flex flex-row text-sm font-medium items-center">
              {formatNumber(plan.price)}
              <RubleIcon size={18} bold={false} />
            </div>
            {renderHat(plan.hat)}
          </div>
        </div>
      </div>
    </div>
  )
}
