"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, CreditCard, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react"

interface ProfileBalanceProps {
  balance: number
}

export function ProfileBalance({ balance }: ProfileBalanceProps) {
  // Mock transaction data
  const transactions = [
    {
      id: 1,
      type: "payment",
      description: "Astrology Reading with Elena Rodriguez",
      amount: -120,
      date: "2024-01-24T15:30:00Z",
      status: "completed",
    },
    {
      id: 2,
      type: "refund",
      description: "Refund for cancelled session",
      amount: 95,
      date: "2024-01-22T10:15:00Z",
      status: "completed",
    },
    {
      id: 3,
      type: "topup",
      description: "Account top-up",
      amount: 200,
      date: "2024-01-20T09:00:00Z",
      status: "completed",
    },
  ]

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Wallet className="h-6 w-6 mr-3 text-violet-600" />
        <h1 className="text-2xl font-bold text-gray-900">Balance & Payments</h1>
      </div>

      {/* Coming Soon Notice */}
      <Card className="p-8 text-center bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
          <Clock className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          We're working on an enhanced balance and payment system. Soon you'll be able to manage your wallet, add Centi,
          and track all your transactions in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" className="border-violet-300 text-violet-700 hover:bg-violet-50">
            Notify Me When Ready
          </Button>
          <Button className="bg-gradient-to-r from-violet-500 to-purple-600">Learn More</Button>
        </div>
      </Card>

      {/* Current Balance (Preview) */}
      <Card
        className="p-6 opacity-50 cursor-pointer hover:opacity-60 transition-opacity"
        onClick={() => (window.location.href = "/balance/coming-soon")}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Current Balance</h3>
          <span className="text-2xl font-bold text-violet-600">{balance.toFixed(0)} Centi</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Button disabled className="bg-gray-100 text-gray-400">
            <CreditCard className="h-4 w-4 mr-2" />
            Add Centi
          </Button>
          <Button disabled variant="outline" className="border-gray-200 text-gray-400">
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Withdraw
          </Button>
        </div>
      </Card>

      {/* Transaction History (Preview) */}
      <Card className="p-6 opacity-50">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === "payment"
                      ? "bg-red-100"
                      : transaction.type === "refund"
                        ? "bg-green-100"
                        : "bg-blue-100"
                  }`}
                >
                  {transaction.type === "payment" ? (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                  {transaction.amount > 0 ? "+" : ""}
                  {Math.abs(transaction.amount)} Centi
                </p>
                <p className="text-sm text-gray-500 capitalize">{transaction.status}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
