"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import {CreditCard, ArrowDown, BanknoteArrowUp} from "lucide-react"

export function AccountBalance() {
  const [balance] = useState(10000)
  const [selectedPeriod, setSelectedPeriod] = useState<"month" | "year">("year")

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium text-neutral-900 ">
        Доступный баланс аккаунта
      </div>

      <div>
          <div className="bg-colors-custom-specialistCardStatItemBg rounded-sm shadow-custom w-min">
              <div className="text-2xl font-semibold text-colors-custom-accent px-2 whitespace-nowrap">
                  {balance.toLocaleString()} Senti
              </div>
          </div>

       <div className="pt-3">
        <span className="text-sm text-neutral-900">
          Вы можете оплатить в <span className="text-colors-custom-accent">Senti</span><br/> план подписки <span className="font-medium">Practice</span> на 100%
        </span>
      </div>

          <div className="pt-4">
              <button className="w-full bg-neutral-900 text-white mb-4 flex flex-row rounded-sm items-center justify-between px-3 py-2 gap-2.5">
                  <div>
                      Программа раннего доступа
                  </div>
                  <BanknoteArrowUp size={36} className="transform  -scale-y-100"/>
              </button>
          </div>
      </div>
    </div>
  )
}
