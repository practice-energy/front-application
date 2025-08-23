"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { CreditCard, ArrowDown } from "lucide-react"

export function AccountBalance() {
  const [balance] = useState(10000)
  const [selectedPeriod, setSelectedPeriod] = useState<"month" | "year">("year")

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        Доступный баланс аккаунта
      </h2>
      
      <Card className="border border-gray-200 dark:border-gray-800">
        <CardContent className="p-6">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <div className="text-2xl font-semibold text-purple-600 dark:text-purple-400">
              {balance.toLocaleString()} Senti
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Вы можете оплатить в Senti план подписки Practice на 100%
          </p>
          
          <Button className="w-full bg-black hover:bg-gray-800 text-white mb-4">
            <CreditCard className="h-4 w-4 mr-2" />
            <ArrowDown className="h-3 w-3 mr-1" />
            Программа раннего доступа
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("month")}
              className="flex-1"
            >
              Месяц
            </Button>
            <Button
              variant={selectedPeriod === "year" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("year")}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              Год - 30%
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
