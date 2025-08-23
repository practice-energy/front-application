"use client"

import { SubscriptionPlanCard } from "./subscription-plan-card"

export function SubscriptionPlans() {
  const plans = [
    {
      id: "pure",
      name: "Pure",
      icon: "barcode",
      currentPlan: "Pure",
      expiryDate: "20.09.25",
      price: "0 ₽",
      tier: "Инициант",
      isCurrent: true,
    },
    {
      id: "practice-pro",
      name: "Practice Pro",
      icon: "cross",
      currentPlan: "Practice Pro",
      expiryDate: "20.09.25",
      price: "6,500 ₽",
      tier: "Мастер",
      isCurrent: true,
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        Планы подписки
      </h2>
      
      <div className="space-y-3">
        {plans.map((plan) => (
          <SubscriptionPlanCard key={plan.id} plan={plan} />
        ))}
      </div>
      
      <div className="flex justify-center gap-2 mt-4">
        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  )
}
