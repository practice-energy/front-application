"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SearchBar } from "@/components/search-bar"
import { SpecialistCard } from "@/components/specialist-card"
import { useTranslations } from "@/hooks/use-translations"

// Reduced list of specialists with fewer specialties per specialist
const allSpecialists = [
  {
    id: 1,
    image: "/placeholder.svg?height=300&width=300",
    name: "Elena Rodriguez",
    title: "Spiritual Guide & Life Coach",
    location: "San Francisco, CA",
    rating: 4.9,
    reviews: 127,
    specialties: ["Astrology", "Life Coaching", "Meditation"],
    isNew: true,
  },
  {
    id: 2,
    image: "/placeholder.svg?height=300&width=300",
    name: "Marcus Chen",
    title: "Business Strategy Consultant",
    location: "New York, NY",
    rating: 4.8,
    reviews: 89,
    specialties: ["Business Strategy", "Leadership", "Finance"],
    isNew: false,
  },
  {
    id: 3,
    image: "/placeholder.svg?height=300&width=300",
    name: "Dr. Sarah Williams",
    title: "Wellness & Nutrition Expert",
    location: "Los Angeles, CA",
    rating: 4.95,
    reviews: 203,
    specialties: ["Nutrition", "Wellness", "Yoga"],
    isNew: false,
  },
  {
    id: 4,
    image: "/placeholder.svg?height=300&width=300",
    name: "Jean-Pierre Dubois",
    title: "Creative Arts Mentor",
    location: "Paris, France",
    rating: 4.7,
    reviews: 156,
    specialties: ["Art Therapy", "Creative Writing", "Design"],
    isNew: true,
  },
  {
    id: 5,
    image: "/placeholder.svg?height=300&width=300",
    name: "Priya Sharma",
    title: "Tech Career Advisor",
    location: "Bangalore, India",
    rating: 4.92,
    reviews: 78,
    specialties: ["Career Coaching", "Tech Skills", "Remote Work"],
    isNew: false,
  },
  {
    id: 6,
    image: "/placeholder.svg?height=300&width=300",
    name: "David Thompson",
    title: "Fitness & Performance Coach",
    location: "Austin, TX",
    rating: 4.85,
    reviews: 234,
    specialties: ["Personal Training", "Nutrition", "Recovery"],
    isNew: false,
  },
  {
    id: 7,
    image: "/placeholder.svg?height=300&width=300",
    name: "Dr. Amara Okafor",
    title: "Relationship Therapist",
    location: "London, UK",
    rating: 4.93,
    reviews: 312,
    specialties: ["Relationship Therapy", "Communication", "Family Counseling"],
    isNew: false,
  },
  {
    id: 8,
    image: "/placeholder.svg?height=300&width=300",
    name: "Kai Nakamura",
    title: "Mindfulness & Zen Master",
    location: "Kyoto, Japan",
    rating: 4.97,
    reviews: 445,
    specialties: ["Meditation", "Mindfulness", "Spiritual Growth"],
    isNew: true,
  },
]

export default function HomePage() {
  const router = useRouter()
  const { t } = useTranslations()
  const [displayedSpecialists, setDisplayedSpecialists] = useState(allSpecialists.slice(0, 8))
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = (query: string, category?: string) => {
    const searchId = Date.now().toString()
    router.push(`/search/${searchId}?q=${encodeURIComponent(query)}${category ? `&category=${category}` : ""}`)
  }

  const handleSpecialistClick = (id: number) => {
    router.push(`/specialist/${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="pb-8">
        {/* Search Bar Section */}
        <section className="py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </section>
      </main>
    </div>
  )
}
