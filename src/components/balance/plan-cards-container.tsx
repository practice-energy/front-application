"use client"

import React from "react"
import { PurePlanCard } from "./pure-plan-card"
import { PracticePlanCard } from "./practice-plan-card"
import { Hat } from "@/types/user"
import { cn } from "@/src/lib/utils"

interface PlanCardsContainerProps {
  currentPlan?: 'pure' | 'practice'
  onPlanSelect?: (plan: 'pure' | 'practice') => void
  userRole?: Hat
  selectedPeriod: 'month' | 'year'
  isMobile: boolean
}

export function PlanCardsContainer({ 
  currentPlan = 'pure', 
  onPlanSelect,
  userRole = 'adept',
  isMobile,
  selectedPeriod,
}: PlanCardsContainerProps) {
  const handlePurePlanClick = () => {
    onPlanSelect?.('pure')
  }

  const handlePracticePlanClick = () => {
    onPlanSelect?.('practice')
  }

  return (
    <div className="flex gap-6 justify-center items-start p-6">
      <div className={cn(
        "transition-all duration-500 ease-in-out",
        "transform-gpu"
      )}>
        <PurePlanCard 
          isCurrentPlan={currentPlan === 'pure'}
          onClick={handlePurePlanClick}
        />
      </div>
      
      <div className={cn(
        "transition-all duration-500 ease-in-out",
        "transform-gpu",
        userRole === 'adept' 
          ? "opacity-100 translate-x-0" 
          : "opacity-0 translate-x-4 pointer-events-none"
      )}>
        <PracticePlanCard 
          isCurrentPlan={currentPlan === 'practice'}
          onClick={handlePracticePlanClick}
          selectedPeriod={selectedPeriod}
        />
      </div>
    </div>
  )
}
