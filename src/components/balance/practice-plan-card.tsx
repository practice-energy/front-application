"use client"

import React, { useState } from "react"
import { cn } from "@/src/lib/utils"
import {IconPractice2} from "@/components/icons/prractice-2-logo";
import {LoaderPinwheel, Sparkles, SparklesIcon} from "lucide-react";
import {IconPractice} from "@/components/icons/icon-practice";
import {RubleIcon} from "@/components/ui/ruble-sign";

interface PracticePlanCardProps {
  isCurrentPlan?: boolean
  onClick?: () => void
  selectedPeriod: 'month' | 'year'
}

export function PracticePlanCard({ isCurrentPlan = false, onClick, selectedPeriod }: PracticePlanCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleCardClick = () => {
    if (!isFlipped && onClick) {
      onClick()
    } else {
      setIsFlipped(!isFlipped)
    }
  }

  return (
      <div
          className={cn(
              "w-[300px] h-[500px] bg-white border border-gray-200 rounded-sm shadow-custom cursor-pointer transition-all duration-200 hover:shadow-active",
              "flex flex-col"
          )}
          onClick={onClick}
      >
        {/* Header */}
        <div className="p-1.5">
          <div className="flex items-start gap-6 pl-6 pr-1.5 py-6">
            <IconPractice width={90} height={80}/>
            <div className="flex flex-col">
              <div className="text-4xl text-neutral-900 font-semibold">Practice</div>
              {selectedPeriod === 'year' && (<div className="flex flex-col">
                <div className="text-base text-colors-custom-accent font-semibold ml-auto">- 30%</div>
                <div className="items-end flex flex-row gap-2">
                  <div className="flex flex-row gap-1 items-center">
                    <RubleIcon size={26} bold={false}/>
                    <div className="text-2xl">1,750</div>
                  </div>
                  <span className="text-neutral-900 text-xs">/ месяц</span>
                </div>
                <div className="flex"></div>
              </div>)}
            </div>
          </div>
        </div>

        {/* Current Plan Indicator */}
        {isCurrentPlan ? (
            <div className="p-1.5 bg-colors-custom-currentPlanBg rounded-sm text-center mt-1.5 mx-1.5">
              <span className="text-sm text-neutral-900 font-semibold">Ваш текущий план</span>
            </div>
        ) : (
            <div className="p-1.5 bg-colors-custom-accent text-white rounded-sm text-center mt-1.5 mx-1.5">
              <span className="text-sm font-semibold">Получить Practice</span>
            </div>
        )}

        {/* Features List */}
        <div className="flex-1 flex flex-col pl-6 pr-1.5 gap-1.5 mt-[22px]">
          <div className="flex gap-1.5 flex-row items-center">
            <div className="w-3 h-3 bg-colors-custom-accent rounded-sm flex-shrink-0"></div>
            <p className="text-sm text-neutral-900">3,000,000 символов с Alura / месяц</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 flex justify-between items-center">
          <span className="text-base text-neutral-900">Для глубокого погружения</span>
          <Sparkles size={24}/>
        </div>
      </div>
  )
}
