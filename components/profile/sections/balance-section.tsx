"use client"

import type React from "react"

import { useState } from "react"
import { useProfileStore } from "@/stores/profile-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Check, CreditCard, Plus, Zap, Crown, Infinity } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface PricingPlan {
  id: "free" | "premium" | "unlimited"
  name: string
  icon: React.ReactNode
  price: { monthly: string; annual: string }
  features: string[]
  isCurrent: boolean
  popular?: boolean
}

export function BalanceSection() {
  const { user } = useProfileStore()
  const { toast } = useToast()
  const [isAnnual, setIsAnnual] = useState(false)

  const plans: PricingPlan[] = [
    {
      id: "free",
      name: "Free",
      icon: <Zap className="h-5 w-5" />,
      price: { monthly: "$0", annual: "$0" },
      features: [
        "Up to 3 sessions per month",
        "Basic specialist access",
        "Email support",
        "Standard booking",
        "Mobile app access",
      ],
      isCurrent: user?.tier === "Free",
    },
    {
      id: "premium",
      name: "Premium",
      icon: <Crown className="h-5 w-5" />,
      price: { monthly: "$29", annual: "$290" },
      features: [
        "Up to 15 sessions per month",
        "Access to all specialists",
        "Priority booking",
        "24/7 chat support",
        "Advanced analytics",
        "Session recordings",
      ],
      isCurrent: user?.tier === "Premium",
      popular: true,
    },
    {
      id: "unlimited",
      name: "Unlimited",
      icon: <Infinity className="h-5 w-5" />,
      price: { monthly: "$99", annual: "$990" },
      features: [
        "Unlimited sessions",
        "Premium specialist access",
        "Instant booking",
        "Dedicated support manager",
        "Custom wellness plans",
        "API access",
        "White-label options",
      ],
      isCurrent: user?.tier === "Unlimited",
    },
  ]

  const handlePlanSelect = (planId: string) => {
    toast({
      title: "Plan Selection",
      description: `Redirecting to checkout for ${planId} plan...`,
    })
    // In a real app, this would redirect to payment processing
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Balance & Plans</h1>
        <p className="text-gray-600">Manage your subscription and billing preferences</p>
      </div>

      {/* Current Balance Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-purple-600" />
            Current Balance
          </CardTitle>
          <CardDescription>Your available Senti balance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-purple-700">
                {user?.account_balance?.toFixed(1) || "0.0"} Senti
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Equivalent to approximately {formatCurrency(user?.account_balance || 0)}
              </p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" /> Add Funds
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4 py-4">
        <Label htmlFor="billing-toggle" className={cn("text-sm font-medium", !isAnnual && "text-purple-600")}>
          Monthly
        </Label>
        <Switch
          id="billing-toggle"
          checked={isAnnual}
          onCheckedChange={setIsAnnual}
          className="data-[state=checked]:bg-purple-600"
        />
        <Label htmlFor="billing-toggle" className={cn("text-sm font-medium", isAnnual && "text-purple-600")}>
          Annual
          <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
            Save 17%
          </Badge>
        </Label>
      </div>

      {/* Pricing Plans */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "relative transition-all duration-200 hover:shadow-lg",
              plan.popular && "border-purple-500 shadow-md scale-105",
              plan.isCurrent && "ring-2 ring-purple-500 bg-purple-50/50",
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-600 text-white px-3 py-1">Most Popular</Badge>
              </div>
            )}

            {plan.isCurrent && (
              <div className="absolute -top-3 right-4">
                <Badge variant="outline" className="bg-white border-purple-500 text-purple-700">
                  Current Plan
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-2">
                <div
                  className={cn(
                    "p-2 rounded-full",
                    plan.id === "free" && "bg-gray-100 text-gray-600",
                    plan.id === "premium" && "bg-purple-100 text-purple-600",
                    plan.id === "unlimited" && "bg-blue-100 text-blue-600",
                  )}
                >
                  {plan.icon}
                </div>
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="mt-4">
                <div className="text-3xl font-bold">{isAnnual ? plan.price.annual : plan.price.monthly}</div>
                <div className="text-sm text-gray-500">per {isAnnual ? "year" : "month"}</div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </CardContent>

            <CardFooter className="pt-4">
              <Button
                variant={plan.isCurrent ? "outline" : plan.popular ? "default" : "outline"}
                className={cn(
                  "w-full transition-all duration-200",
                  plan.isCurrent && "cursor-not-allowed opacity-60",
                  plan.popular && "bg-purple-600 hover:bg-purple-700",
                  !plan.popular && !plan.isCurrent && "hover:bg-purple-50 hover:border-purple-300",
                )}
                disabled={plan.isCurrent}
                onClick={() => handlePlanSelect(plan.name)}
              >
                {plan.isCurrent ? "Current Plan" : "Select Plan"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Payment Method Section */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your payment options and billing information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-xs text-gray-500">Expires 12/25</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Default
            </Badge>
          </div>
          <Button variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Payment Method
          </Button>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest billing activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: "2024-01-15", description: "Premium Plan - Monthly", amount: "$29.00" },
              { date: "2024-01-10", description: "Session with Dr. Smith", amount: "-$15.00" },
              { date: "2024-01-05", description: "Added Funds", amount: "+$50.00" },
            ].map((transaction, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div>
                  <p className="font-medium text-sm">{transaction.description}</p>
                  <p className="text-xs text-gray-500">{transaction.date}</p>
                </div>
                <div
                  className={cn(
                    "font-medium text-sm",
                    transaction.amount.startsWith("+") && "text-green-600",
                    transaction.amount.startsWith("-") && "text-red-600",
                  )}
                >
                  {transaction.amount}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
