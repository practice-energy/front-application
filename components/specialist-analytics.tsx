"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, Calendar, Star, DollarSign, MessageCircle, Clock } from "lucide-react"

export function SpecialistAnalytics() {
  // Mock analytics data
  const stats = [
    {
      title: "Total Revenue",
      value: "2,840",
      unit: "Centi",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Total Clients",
      value: "24",
      unit: "",
      change: "+8.3%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Sessions This Month",
      value: "18",
      unit: "",
      change: "+15.2%",
      trend: "up",
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      title: "Average Rating",
      value: "4.9",
      unit: "/5",
      change: "+0.1",
      trend: "up",
      icon: Star,
      color: "text-yellow-600",
    },
    {
      title: "Response Time",
      value: "2.3",
      unit: "hours",
      change: "-0.5h",
      trend: "up",
      icon: Clock,
      color: "text-indigo-600",
    },
    {
      title: "Messages Sent",
      value: "156",
      unit: "",
      change: "+22.1%",
      trend: "up",
      icon: MessageCircle,
      color: "text-pink-600",
    },
  ]

  const recentSessions = [
    {
      id: 1,
      client: "Sarah M.",
      service: "Astrology Reading",
      date: "Jan 24, 2024",
      duration: "60 min",
      revenue: 120,
    },
    {
      id: 2,
      client: "Michael R.",
      service: "Life Coaching",
      date: "Jan 23, 2024",
      duration: "50 min",
      revenue: 95,
    },
    {
      id: 3,
      client: "Jessica L.",
      service: "Meditation Session",
      date: "Jan 22, 2024",
      duration: "45 min",
      revenue: 80,
    },
    {
      id: 4,
      client: "David K.",
      service: "Spiritual Consultation",
      date: "Jan 21, 2024",
      duration: "90 min",
      revenue: 180,
    },
  ]

  const topServices = [
    { name: "Astrology Reading", sessions: 12, revenue: 1440, percentage: 45 },
    { name: "Life Coaching", sessions: 8, revenue: 760, percentage: 30 },
    { name: "Meditation Session", sessions: 6, revenue: 480, percentage: 20 },
    { name: "Spiritual Consultation", sessions: 2, revenue: 360, percentage: 5 },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600">Track your performance and growth metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <div className="flex items-baseline space-x-1">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    {stat.unit && <span className="text-sm text-gray-500">{stat.unit}</span>}
                  </div>
                  <div className="flex items-center mt-2">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className={`text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sessions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Recent Sessions</h3>
          <div className="space-y-4">
            {recentSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <p className="font-medium">{session.client}</p>
                    <Badge variant="secondary" className="text-xs">
                      {session.service}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{session.date}</span>
                    <span>{session.duration}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-violet-600">{session.revenue} Centi</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Services */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Top Services</h3>
          <div className="space-y-4">
            {topServices.map((service, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{service.name}</span>
                  <span className="text-sm text-gray-600">{service.sessions} sessions</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                    <div className="bg-violet-600 h-2 rounded-full" style={{ width: `${service.percentage}%` }}></div>
                  </div>
                  <span className="text-sm font-medium text-violet-600">{service.revenue} Centi</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="font-semibold mb-1">Growing Revenue</h4>
            <p className="text-sm text-gray-600">Your monthly revenue has increased by 12.5% this month</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="font-semibold mb-1">Client Retention</h4>
            <p className="text-sm text-gray-600">85% of your clients book follow-up sessions</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <h4 className="font-semibold mb-1">High Ratings</h4>
            <p className="text-sm text-gray-600">Your average rating is in the top 10% of specialists</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <h4 className="font-semibold mb-1">Quick Response</h4>
            <p className="text-sm text-gray-600">You respond to messages 40% faster than average</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
