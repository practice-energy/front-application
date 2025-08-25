"use client"

import React from "react"
import { cn } from "@/src/lib/utils"
import {IconPractice1} from "@/components/icons/practice-1-logo";
import {IconPure} from "@/components/icons/prractice-2-logo";
import {LoaderPinwheel} from "lucide-react";

interface PureSentiPlanCardProps {
  isCurrentPlan?: boolean
  onClick?: () => void
}

export function PureSentiPlanCard({ isCurrentPlan = false, onClick }: PureSentiPlanCardProps) {
  return (
    <div 
      className={cn(
        "w-[300px] h-[500px] bg-white border border-gray-200 rounded-sm shadow-custom cursor-pointer transition-all duration-200 hover:shadow-active",
        "flex flex-col"
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-1.5  ">
        <div className="flex items-center gap-3 pl-4 pr-2 py-6 border border-neutral-900 bg-neutral-900  rounded-sm">
          <IconPure width={68} height={80} className="text-white opacity-100"/>
          <div className="flex flex-col gap-[20px]">
            <div className="text-4xl text-white font-semibold whitespace-nowrap">Pure Senti</div>
            <div className="text-2xl text-white font-medium">Бесплатно</div>
          </div>
        </div>
      </div>

      {/* Current Plan Indicator */}
      {isCurrentPlan ? (
        <div className="p-1.5 bg-colors-custom-currentPlanBg rounded-sm text-center mt-1.5 mx-1.5">
          <span className="text-sm text-neutral-900 font-semibold">Ваш текущий план</span>
        </div>
      ) : (
        <div className="p-1.5 bg-white border border-neutral-900 rounded-sm text-center mt-1.5 mx-1.5">
            <span className="text-sm text-neutral-900 font-semibold">Выбрать Pure</span>
        </div>
      )}

      {/* Features List */}
      <div className="p-2 flex flex-1">
        <div className="flex-1 flex flex-col px-1.5 py-3 gap-1.5 border border-neutral-900 rounded-sm">
          <div className="flex gap-1.5 flex-row items-center">
            <div className="w-3 h-3 bg-neutral-200 rounded-sm flex-shrink-0"></div>
            <p className="text-sm text-neutral-900">1000 символов с Alura / 4 часа</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-2 pb-2">
        <div className="p-2 flex justify-between items-center border border-neutral-900 rounded-sm">
          <span className="text-base text-neutral-900">Для общих запросов</span>
          <LoaderPinwheel size={24}/>
        </div>
      </div>
    </div>
  )
}
