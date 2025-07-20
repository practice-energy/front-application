"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "@/hooks/use-translations"
import { Search, ChevronDown, ChevronUp, HelpCircle } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  popular: boolean
}

export default function HelpPage() {
  const { t } = useTranslations()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [openItems, setOpenItems] = useState<string[]>([])

  const faqData: FAQItem[] = [
    {
      id: "1",
      question: "How do I book a session with a specialist?",
      answer:
        "To book a session, browse our specialists, select one that matches your needs, choose an available time slot, and complete the booking process. You'll receive a confirmation email with session details.",
      category: "booking",
      popular: true,
    },
    {
      id: "2",
      question: "What payment methods do you accept?",
      answer:
        "We accept Centi digital coins as our primary currency. You can purchase Centi through our platform using credit cards, PayPal, or bank transfers.",
      category: "payment",
      popular: true,
    },
    {
      id: "3",
      question: "How do I become a specialist on the platform?",
      answer:
        "Click 'Become a Specialist' in the header, fill out your profile with qualifications and experience, set your services and pricing, and submit for review. Our team will verify your credentials within 3-5 business days.",
      category: "specialist",
      popular: true,
    },
    {
      id: "4",
      question: "Can I cancel or reschedule my booking?",
      answer:
        "Yes, you can cancel or reschedule up to 24 hours before your session. Go to your profile > Calendar to manage your bookings. Cancellations within 24 hours may incur a fee.",
      category: "booking",
      popular: false,
    },
    {
      id: "5",
      question: "How do video sessions work?",
      answer:
        "Video sessions are conducted through our secure platform. You'll receive a link in your confirmation email. Make sure you have a stable internet connection and a device with camera and microphone.",
      category: "technical",
      popular: false,
    },
    {
      id: "6",
      question: "What if I'm not satisfied with my session?",
      answer:
        "We offer a satisfaction guarantee. If you're not happy with your session, contact our support team within 48 hours for a refund or to schedule with another specialist.",
      category: "support",
      popular: true,
    },
    {
      id: "7",
      question: "How do I set my availability as a specialist?",
      answer:
        "Go to your specialist dashboard > Schedule tab. You can set your working hours, block unavailable times, and manage your calendar. Changes sync in real-time with the booking system.",
      category: "specialist",
      popular: false,
    },
    {
      id: "8",
      question: "Is my personal information secure?",
      answer:
        "Yes, we use enterprise-grade encryption and follow strict privacy policies. Your personal information is never shared with third parties without your consent.",
      category: "privacy",
      popular: false,
    },
    {
      id: "9",
      question: "How do I withdraw my earnings as a specialist?",
      answer:
        "Specialists can withdraw earnings weekly through the Balance section. We support bank transfers, PayPal, and digital wallet withdrawals. Minimum withdrawal is 100 Centi.",
      category: "payment",
      popular: false,
    },
    {
      id: "10",
      question: "What happens if a specialist doesn't show up?",
      answer:
        "If a specialist doesn't show up within 15 minutes of the scheduled time, you'll receive an automatic full refund and can book with another specialist immediately.",
      category: "support",
      popular: false,
    },
  ]

  const categories = [
    { id: "all", label: "All Topics", count: faqData.length },
    {
      id: "booking",
      label: "Booking & Scheduling",
      count: faqData.filter((item) => item.category === "booking").length,
    },
    { id: "payment", label: "Payment & Billing", count: faqData.filter((item) => item.category === "payment").length },
    {
      id: "specialist",
      label: "For Specialists",
      count: faqData.filter((item) => item.category === "specialist").length,
    },
    {
      id: "technical",
      label: "Technical Support",
      count: faqData.filter((item) => item.category === "technical").length,
    },
    { id: "support", label: "Customer Support", count: faqData.filter((item) => item.category === "support").length },
    { id: "privacy", label: "Privacy & Security", count: faqData.filter((item) => item.category === "privacy").length },
  ]

  const filteredFAQs = faqData.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const popularFAQs = faqData.filter((item) => item.popular)

  const toggleItem = (itemId: string) => {
    setOpenItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  return (
    <div className="min-h-screen  dark:bg-gray-900 transition-colors duration-300">
      <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-violet-600 dark:bg-violet-700 rounded-lg flex items-center justify-center mx-auto mb-6 transition-colors duration-300">
            <HelpCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300">
            Find answers to common questions and get the help you need
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 text-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-violet-500 focus:ring-violet-500 transition-colors duration-300"
            />
          </div>
        </div>

        {/* Popular Questions */}
        {!searchTerm && selectedCategory === "all" && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 transition-colors duration-300">
              Popular Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularFAQs.map((faq) => (
                <Card
                  key={faq.id}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg"
                  onClick={() => toggleItem(faq.id)}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">
                      {faq.question}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800 transition-colors duration-300 rounded-lg"
                    >
                      Popular
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 transition-colors duration-300">
                    {faq.answer}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-300 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-300 ${
                      selectedCategory === category.id
                        ? "bg-violet-100 text-violet-700 border border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{category.label}</span>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 transition-colors duration-300 rounded-lg"
                      >
                        {category.count}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* FAQ List */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                {selectedCategory === "all"
                  ? "All Questions"
                  : categories.find((c) => c.id === selectedCategory)?.label}
              </h2>
              <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                {filteredFAQs.length} {filteredFAQs.length === 1 ? "question" : "questions"}
              </span>
            </div>

            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <Card
                  key={faq.id}
                  className="overflow-hidden border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-300 rounded-lg"
                >
                  <Collapsible open={openItems.includes(faq.id)} onOpenChange={() => toggleItem(faq.id)}>
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-300">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-left transition-colors duration-300">
                            {faq.question}
                          </h3>
                          {faq.popular && (
                            <Badge
                              variant="secondary"
                              className="bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800 transition-colors duration-300 rounded-lg"
                            >
                              Popular
                            </Badge>
                          )}
                        </div>
                        {openItems.includes(faq.id) ? (
                          <ChevronUp className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed pt-4 transition-colors duration-300">
                          {faq.answer}
                        </p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4 transition-colors duration-300" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">
                  No questions found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Try adjusting your search terms or browse different categories
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
