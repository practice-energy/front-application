"use client"

import React, { useState } from "react"
import { cn } from "@/src/lib/utils"
import {DollarSign, Mail, Sparkles} from "lucide-react";
import {IconPractice} from "@/components/icons/icon-practice";
import { v4 as uuidv4 } from "uuid"
import Image from "next/image";
import {Subscription} from "@/types/balance";
import {SubscriptionPayCard} from "@/components/balance/subscription-pay-card";

interface PracticePlanCardProps {
  isMobile: boolean
  isCurrentPlan?: boolean
  onClick?: () => void
  selectedPeriod: 'month' | 'year'
}

export function PracticePlanCard({ isCurrentPlan = false, onClick, selectedPeriod, isMobile }: PracticePlanCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [payed, setPayed] = useState(false)

  const handleCardClick = () => {
    setIsFlipped(!isFlipped)
  }

  const subscriptionPlan: Subscription = selectedPeriod === 'month' ? {
    id: uuidv4(),
    tier: 'practice',
    hat: 'adept',
    price: 2500,
    endDate: new Date(),
    isActive: false,
  } : {
    id: uuidv4(),
    tier: 'practice',
    hat: 'adept',
    price: 21000,
    endDate: new Date(),
    isActive: false,
  }

  return (
    <div className="w-[300px] h-[500px] relative">
      <div
        className="relative w-full h-full"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        <div
          className={cn(
            "relative w-full h-full transition-transform duration-700 ease-in-out",
            "transform-gpu backface-hidden"
          )}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Передняя сторона карточки */}
          <div
            className={cn(
              "w-full h-full bg-white border border-gray-200 rounded-sm shadow-custom cursor-pointer transition-all duration-200 hover:shadow-active",
              "flex flex-col backface-hidden"
            )}
            style={{ backfaceVisibility: 'hidden' }}
            onClick={handleCardClick}
          >
        {/* Header */}
        <div className="p-1.5">
          <div className="relative h-[142px]">
            <div className={cn(
              "absolute inset-0 flex items-start gap-6 pl-6 pr-1.5 pt-6 pb-2 border border-neutral-900 rounded-sm transition-all duration-300 ease-in-out transform-gpu",
              selectedPeriod === 'year' 
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 pointer-events-none"
            )}>
              <IconPractice width={90} height={80}/>
              <div className="flex flex-col">
                <div className="text-4xl text-neutral-900 font-semibold">Practice</div>
                <div className="flex flex-col">
                  <div className="text-colors-custom-accent font-semibold ml-auto leading-4">- 30%</div>
                  <div className="items-end flex flex-row gap-2 mr-2">
                    <div className="flex flex-row gap-1 items-center justify-start leading-7">
                      <p className="text-[26px]">₽</p>
                      <div className="text-2xl whitespace-nowrap"> 1,750</div>
                    </div>
                    <span className="text-neutral-900 text-xs whitespace-nowrap mb-1.5">/ месяц</span>
                  </div>
                  <div className="flex text-xs text-neutral-900">
                    Всего: 21,000 ₽ / год.
                  </div>
                </div>
              </div>
            </div>
            
            <div className={cn(
              "absolute inset-0 flex items-start gap-6 pl-6 pr-1.5 pt-6 pb-2 border border-neutral-900 rounded-sm transition-all duration-300 ease-in-out transform-gpu",
              selectedPeriod === 'month' 
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 pointer-events-none"
            )}>
              <IconPractice width={90} height={80}/>
              <div className="flex flex-col gap-[20px]">
                <div className="text-4xl text-neutral-900 font-semibold">Practice</div>
                <div className="items-end flex flex-row gap-2 mr-2">
                  <div className="flex flex-row gap-1 items-center justify-start leading-7">
                    <p className="text-[26px]">₽</p>
                    <div className="text-2xl whitespace-nowrap"> 2,500</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Plan Indicator */}
        {isCurrentPlan ? (
            <div className="p-1.5 bg-colors-custom-currentPlanBg rounded-sm text-center mt-1.5 mx-1.5">
              <span className="text-sm text-neutral-900 font-semibold">Ваш текущий план</span>
            </div>
        ) : (
            <div 
              className="p-1.5 bg-colors-custom-accent text-white rounded-sm text-center mt-1.5 mx-1.5 cursor-pointer hover:bg-violet-700 transition-colors"
            >
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

          {/* Задняя сторона карточки - Payment Interface */}
          <div
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center cursor-pointer"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
            onClick={handleCardClick}
          >
            <div className="w-full h-full bg-white border border-colors-custom-accent rounded-sm shadow-active flex flex-col p-2 gap-2">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div className="font-semibold text-2xl text-neutral-900">Оплата</div>
                <div className="flex gap-2 text-center items-center">
                  <span className="text-2xl text-neutral-900">₽</span>
                  <DollarSign size={24} className="text-colors-custom-accent"/>
                </div>
              </div>

              {/* Subscription Plan Details */}
              <SubscriptionPayCard plan={subscriptionPlan} period={selectedPeriod} payed={payed ? 'payed' : 'unpayed'}/>

              {/* QR Code */}
              <div className="bg-white border border-neutral-900 rounded-sm p-2 flex justify-center items-center overflow-hidden h-[200px]">
                <Image
                    src="/practice-qr.svg"
                    width={160}
                    height={160}
                    alt="QR Code"
                    className="rounded-sm overflow-hidden w-[160px] aspect-square"
                />
              </div>

              <div className="items-center justify-center border border-neutral-900 font-semibold rounded-sm p-2 gap-[14px] h-[100px]">
                <div className="flex flex-row items-start justify-center text-2xl">
                  <div className="text-colors-custom-accent ">Senti</div>
                  <div className="text-neutral-900 ">Pay</div>
                </div>
                <button
                    className="bg-colors-custom-accent mx-auto text-white rounded-sm h-[36px] w-[180px] flex items-center justify-center transition-colors hover:bg-violet-700"
                    onClick={() => {}}
                >
                  Оплатить в Senti
                </button>
              </div>

              {/* Email */}
              <div className="bg-white border border-neutral-900 rounded-sm p-2 flex items-center gap-2">
                <Mail size={24} className="text-neutral-900"/>
                <span className="text-sm text-black">actor@havanaghila.de</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
