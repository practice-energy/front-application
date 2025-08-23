"use client"

import React from "react"
import { PurePlanCard } from "./pure-plan-card"
import { PracticePlanCard } from "./practice-plan-card"
import { Hat } from "@/types/user"

interface PlanCardsContainerProps {
  currentPlan?: 'pure' | 'practice'
  onPlanSelect?: (plan: 'pure' | 'practice') => void
  userRole?: Hat
}

export function PlanCardsContainer({ 
  currentPlan = 'pure', 
  onPlanSelect,
  userRole = 'adept'
}: PlanCardsContainerProps) {
  const handlePurePlanClick = () => {
    onPlanSelect?.('pure')
  }

  const handlePracticePlanClick = () => {
    onPlanSelect?.('practice')
  }

  return (
    <div className="flex gap-6 justify-center items-start p-6">
      <PurePlanCard 
        isCurrentPlan={currentPlan === 'pure'}
        onClick={handlePurePlanClick}
      />
      {userRole === 'adept' && (
        <PracticePlanCard 
          isCurrentPlan={currentPlan === 'practice'}
          onClick={handlePracticePlanClick}
        />
      )}
    </div>
  )
}
