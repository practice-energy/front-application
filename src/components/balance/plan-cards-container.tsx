"use client"

import React from "react"
import { PurePlanCard } from "./pure-plan-card"
import { PracticePlanCard } from "./practice-plan-card"
import { PracticeProPlanCard } from "./practice-pro-plan-card"
import {Hat, Tier, User} from "@/types/user"
import { cn } from "@/src/lib/utils"
import {PureSentiPlanCard} from "@/components/balance/pure-senti-plan-card";

interface PlanCardsContainerProps {
  currentPlan?: Tier
  onPlanSelect?: (plan: Tier) => void
  userRole?: Hat
  selectedPeriod: 'month' | 'year'
  isMobile: boolean
  user?: User
}

export function PlanCardsContainer({
  userRole = 'adept',
  currentPlan = userRole === 'adept' ? 'pure' : 'pure_senti',
  onPlanSelect,
  isMobile,
  selectedPeriod,
  user,
}: PlanCardsContainerProps) {
  const handlePurePlanClick = () => {
    onPlanSelect?.('pure')
  }

  const handlePracticePlanClick = () => {
    onPlanSelect?.('practice')
  }

  const handlePracticeProPlanClick = () => {
    onPlanSelect?.('pro')
  }

  return (
    <div className={cn(
        "flex justify-center items-start",
        isMobile ? " flex-col gap-6 mx-auto w-[300px] py-[18px]" : "flex-row gap-[114px] p-[18px]"
        )}>
      {userRole === 'adept' && (<div className={cn(
        "transition-all duration-500 ease-in-out flex",
        "transform-gpu",
          isMobile && "w-max-[300px]"
      )}>
        <PurePlanCard 
          isCurrentPlan={currentPlan === 'pure'}
          onClick={handlePurePlanClick}
        />
      </div>
      )}
      
      {userRole === 'adept' && (
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
          isMobile={isMobile}
          user={user}
        />
      </div>
      )}

      {userRole === 'master' && (<div className={cn(
              "transition-all duration-500 ease-in-out flex",
              "transform-gpu",
              isMobile && "w-max-[300px]"
          )}>
            <PureSentiPlanCard
                isCurrentPlan={currentPlan === 'pure_senti'}
                onClick={handlePurePlanClick}
            />
          </div>
      )}

      {userRole === 'master' && (
        <div className={cn(
        "transition-all duration-500 ease-in-out",
        "transform-gpu",
        userRole === 'master' 
          ? "opacity-100 translate-x-0" 
          : "opacity-0 translate-x-4 pointer-events-none"
      )}>
        <PracticeProPlanCard 
          isCurrentPlan={currentPlan === 'pro'}
          onClick={handlePracticeProPlanClick}
          selectedPeriod={selectedPeriod}
          isMobile={isMobile}
          user={user}
        />
      </div>)}
    </div>
  )
}
