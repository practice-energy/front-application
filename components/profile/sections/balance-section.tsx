"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Wallet, CreditCard, Plus, ArrowUpRight, ArrowDownLeft, DollarSign, Check, Crown, Infinity } from "lucide-react"
import { cn } from "@/lib/utils"

export function BalanceSection() {
  const [currentBalance] = useState(245.5)
  const [addAmount, setAddAmount] = useState("")
  const [currentTier] = useState("premium") // free, premium, infinite

  const subscriptionTiers = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "month",
      features: [
        "Up to 3 sessions per month",
        "Basic specialist access",
        "Email support",
        "Standard booking",
        "Mobile app access",
      ],
      buttonText: "Current Plan",
    },
    {
      id: "premium",
      name: "Premium",
      price: "$29",
      period: "month",
      features: [
        "Up to 15 sessions per month",
        "Access to all specialists",
        "Priority booking",
        "24/7 chat support",
        "Advanced analytics",
      ],
      buttonText: "Current Plan",
      popular: true,
    },
    {
      id: "infinite",
      name: "Infinite",
      price: "$99",
      period: "month",
      features: [
        "Unlimited sessions",
        "Premium specialist access",
        "Instant booking",
        "Dedicated support manager",
        "Custom wellness plans",
      ],
      buttonText: "Upgrade",
    },
  ]

  const transactions = [
    {
      id: 1,
      date: "2024-01-20",
      description: "Psychology Session with Dr. Anna Smith",
      amount: -85.0,
      status: "completed",
    },
    {
      id: 2,
      date: "2024-01-18",
      description: "Account Top-up",
      amount: 100.0,
      status: "completed",
    },
    {
      id: 3,
      date: "2024-01-15",
      description: "Life Coaching with Michael Johnson",
      amount: -65.0,
      status: "completed",
    },
    {
      id: 4,
      date: "2024-01-12",
      description: "Cancelled Session Refund",
      amount: 75.0,
      status: "pending",
    },
  ]

  const paymentMethods = [
    {
      id: 1,
      type: "visa",
      last4: "4242",
      expiry: "12/26",
      isDefault: true,
    },
    {
      id: 2,
      type: "mastercard",
      last4: "8888",
      expiry: "08/25",
      isDefault: false,
    },
  ]

  const handleAddFunds = () => {
    console.log("Adding funds:", addAmount)
    setAddAmount("")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="secondary" className="text-xs">
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="text-xs">
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive" className="text-xs">
            Failed
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-[935px] mx-auto px-4 lg:px-6 space-y-8 transition-all duration-300">
      {/* Current Balance */}
      <Card className="border border-gray-200 dark:border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Wallet className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Available Balance</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your current account balance</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
              ${currentBalance.toFixed(2)}
            </div>
          </div>

          <div className="flex gap-3">
            <Input
              type="number"
              placeholder="Amount to add"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleAddFunds}
              className="bg-violet-600 hover:bg-violet-700 text-white"
              disabled={!addAmount || Number.parseFloat(addAmount) <= 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Funds
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Tiers */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Subscription Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subscriptionTiers.map((tier) => (
            <Card
              key={tier.id}
              className={cn(
                "border relative",
                currentTier === tier.id
                  ? "border-violet-600 dark:border-violet-500"
                  : "border-gray-200 dark:border-gray-800",
                tier.popular && "border-violet-600 dark:border-violet-500",
              )}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-violet-600 text-white">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="p-6 text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    {tier.id === "free" && <DollarSign className="h-5 w-5 text-gray-600 dark:text-gray-400" />}
                    {tier.id === "premium" && <Crown className="h-5 w-5 text-gray-600 dark:text-gray-400" />}
                    {tier.id === "infinite" && <Infinity className="h-5 w-5 text-gray-600 dark:text-gray-400" />}
                  </div>
                </div>
                <CardTitle className="text-xl text-gray-900 dark:text-gray-100">{tier.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-semibold text-gray-900 dark:text-gray-100">{tier.price}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">/{tier.period}</span>
                </div>
              </CardHeader>

              <CardContent className="p-6 pt-0">
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-4 w-4 mt-0.5 text-gray-600 dark:text-gray-400 shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={currentTier === tier.id ? "outline" : "default"}
                  className={cn(
                    "w-full",
                    currentTier === tier.id
                      ? "cursor-not-allowed opacity-60"
                      : "bg-violet-600 hover:bg-violet-700 text-white",
                  )}
                  disabled={currentTier === tier.id}
                >
                  {currentTier === tier.id ? "Current Plan" : tier.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <Card className="border border-gray-200 dark:border-gray-800">
        <CardHeader className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">Payment Methods</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Manage your saved payment methods
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-5 bg-gray-900 dark:bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-white dark:text-gray-900 text-xs font-medium">
                    {method.type === "visa" ? "VISA" : "MC"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">•••• •••• •••• {method.last4}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Expires {method.expiry}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {method.isDefault && (
                  <Badge variant="secondary" className="text-xs">
                    Default
                  </Badge>
                )}
                <Button size="sm" variant="outline">
                  Remove
                </Button>
              </div>
            </div>
          ))}

          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="border border-gray-200 dark:border-gray-800">
        <CardHeader className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <DollarSign className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Transaction History
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Your recent transactions and payments
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    {transaction.amount > 0 ? (
                      <ArrowDownLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{transaction.description}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
