"use client"

import { BalanceHeader } from "./balance-header"
import { BalanceContent } from "./balance-content"
import { useIsMobile } from "@/hooks/use-mobile"
import {useProfileStore} from "@/stores/profile-store";
import {Balance} from "@/types/balance";
import { v4 as uuidv4 } from "uuid"
import {IconButton} from "@/components/icon-button";
import {UserSwitchIcon} from "@phosphor-icons/react";
import {useState} from "react";
import {Hat} from "@/types/user";
import { cn } from "@/lib/utils";
import { PlanCardsContainer } from "./plan-cards-container";
import { TransactionHistory } from "./transaction-history";
import {useAuth} from "@/hooks/use-auth";
import {useSidebar} from "@/contexts/sidebar-context";

export function BalancePage() {
  const isMobile = useIsMobile()
  const {user} = useProfileStore()
  const [cardFilter, setCardFilter] = useState<Hat>('adept')
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year'>('month')
  const { isAuthenticated } = useAuth()
  const { toggleSidebar, isCollapsed } = useSidebar()

   const mockBalance: Balance = {
      amount: 1488,
       subscriptions: [
           {
               id: uuidv4(),
               tier: "pure",
               hat: "adept",
               price: 30000,
               endDate: new Date(),
               isActive: true
           },
           {
               id: uuidv4(),
               tier: "pure_senti",
               hat: "master",
               price: 30000,
               endDate: new Date(),
               isActive: false
           },
           {
               id: uuidv4(),
               tier: "practice",
               hat: "adept",
               price: 30000,
               endDate: new Date(),
               isActive: true
           },
           {
               id: uuidv4(),
               tier: "pro",
               hat: "master",
               price: 30000,
               endDate: new Date(),
               isActive: true
           },
       ],
       transactionHistory: [
           {
               id: uuidv4(),
               amount: 999000,
               name: "Демонстрация возможностей для Мастера с Практис",
               type: "debit",
               time: new Date("2025-09-21T16:34:00"),
               status: "payed"
           },
           {
               id: uuidv4(),
               amount: 2500,
               name: "План подписки Practice / 30 дней",
               type: "debit",
               time: new Date("2025-09-23T17:34:00"),
               status: "payed"
           }
       ]
   }


  return (
      <div className={cn(!isMobile && "pt-24")}>
          <div className="w-full max-w-[845px] mx-auto bg-white shadow-custom-card rounded-sm">
              <BalanceHeader
                  isMobile={isMobile}
                  user={user}
                  isAuthenticated={isAuthenticated}
                  toggleSidebar={toggleSidebar}
              />
              <BalanceContent
                  isMobile={isMobile}
                  user={user}
                  balanceStats={mockBalance}
              />

          <div className={cn(
              "w-full items-center flex flex-row justify-between",
              isMobile ? "p-3" : "p-4"
          )}>
              {!isMobile && (<div/>)}
              {!isMobile && (<div/>)}
              <div/>
              <div/>
              <div className="gap-6 flex flex-row">
                  <IconButton
                      icon={UserSwitchIcon}
                      onClick={() =>{setCardFilter('adept')}}
                      disabled={false}
                      className={cn(
                          "text-neutral-900 flex",
                          cardFilter === 'adept' ? "border border-neutral-900" : ""
                      )}
                  />
                  <IconButton
                      icon={UserSwitchIcon}
                      onClick={() =>{setCardFilter('master')}}
                      disabled={false}
                      iconClassName="text-colors-custom-accent"
                      className={cn(
                          "text-neutral-900 flex",
                          cardFilter === 'master' ? "border border-neutral-900" : ""
                      )}
                  />
              </div>
              <div >
                  <div className="flex flex-row border font-medium border-colors-custom-accent rounded-sm bg-white shadow-custom">
                      <button
                          className={cn(
                              "flex flex-row gap-1 items-center p-1 px-2 rounded-sm transition-all duration-300 ease-in-out border-0",
                              selectedPeriod === "month" ? "bg-neutral-900 ring-1 ring-neutral-900 text-white" : "text-neutral-900"
                          )}
                          onClick={() => setSelectedPeriod("month")}
                      >
                          <span>Месяц</span>
                      </button>
                      <button
                          className={cn(
                              "flex flex-row gap-1 items-center p-1 px-2 rounded-sm transition-all duration-300 ease-in-out border-0",
                              selectedPeriod === "year" ? "bg-neutral-900 ring-1 ring-neutral-900 text-white" : "text-neutral-900"
                          )}
                          onClick={() => setSelectedPeriod("year")}
                      >
                          <span>Год</span>
                          <span className="text-colors-custom-accent font-bold">-30%</span>
                      </button>
                  </div>
              </div>
              <div/>
          </div>
      </div>
      
      {/* Карточки планов */}
      <div className="w-full max-w-[845px] mx-auto">
                    <PlanCardsContainer
            userRole={cardFilter}
            onPlanSelect={(plan) => {
                if (plan === 'practice' && cardFilter !== 'adept') {
                    setCardFilter('adept')
                }
                if (plan === 'pro' && cardFilter !== 'master') {
                    setCardFilter('master')
                }
            }}
            selectedPeriod={selectedPeriod}
            isMobile={isMobile}
            user={user}
          />
      </div>

      {/* История транзакций */}
      <div className="w-full max-w-[845px] mx-auto justify-center">
        <TransactionHistory isMobile={isMobile} transactions={mockBalance.transactionHistory} />
      </div>
   </div>
  )
}
