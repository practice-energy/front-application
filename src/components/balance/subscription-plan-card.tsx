"use client"

import { Card, CardContent } from "@/src/components/ui/card"
import { RotateCcw } from "lucide-react"

interface PlanIconProps {
  type: string
}

function PlanIcon({ type }: PlanIconProps) {
  if (type === "barcode") {
    return (
      <div className="w-8 h-10 bg-white border border-gray-300 rounded flex items-center justify-center">
        <div className="flex gap-0.5">
          <div className="w-0.5 h-6 bg-black"></div>
          <div className="w-0.5 h-6 bg-black"></div>
          <div className="w-0.5 h-6 bg-black"></div>
        </div>
      </div>
    )
  }
  
  if (type === "cross") {
    return (
      <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
        <div className="text-white font-bold text-sm">×</div>
      </div>
    )
  }
  
  return null
}

interface SubscriptionPlanCardProps {
  plan: {
    id: string
    name: string
    icon: string
    currentPlan: string
    expiryDate: string
    price: string
    tier: string
    isCurrent: boolean
  }
}

export function SubscriptionPlanCard({ plan }: SubscriptionPlanCardProps) {
  return (
    <Card className="border border-gray-200 dark:border-gray-800">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <PlanIcon type={plan.icon} />
          
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Текущий план подписки: {plan.currentPlan}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                до {plan.expiryDate}
              </span>
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {plan.price}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {plan.tier}
              </span>
              <RotateCcw className="h-3 w-3 text-gray-400" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
