"use client"

import { SubscriptionPlanCard } from "./subscription-plan-card"
import {Subscription} from "@/types/balance";
import {User} from "@/types/user";

type BalanceContentProps = {
  isMobile: boolean
  subscriptions: Subscription[]
  user?: User
}

export function SubscriptionPlans({isMobile, subscriptions}: BalanceContentProps) {
  return (
    <div className="space-y-4">
      <div className="text-lg font-medium text-gray-900">
        Планы подписки
      </div>
      
      <div className="space-y-3">
        {subscriptions.map((plan) => (
          <SubscriptionPlanCard key={plan.id} plan={plan} isMobile={isMobile}/>
        ))}
      </div>
    </div>
  )
}
