"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SpecialistCard } from "@/components/specialist-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, Search, Filter, SortAsc, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

// Mock saved specialists data
const initialSavedSpecialists = [
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
    savedDate: "2024-01-15",
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
    savedDate: "2024-01-10",
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
    savedDate: "2024-01-08",
  },
  {
    id: 11,
    image: "/placeholder.svg?height=300&width=300",
    name: "Luna Blackwood",
    title: "Energy Healer & Mystic",
    location: "Sedona, AZ",
    rating: 4.88,
    reviews: 189,
    specialties: ["Energy Healing", "Crystal Therapy", "Spiritual Cleansing"],
    isNew: true,
    savedDate: "2024-01-05",
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
    savedDate: "2024-01-03",
  },
  {
    id: 12,
    image: "/placeholder.svg?height=300&width=300",
    name: "Professor James Wright",
    title: "Academic & Research Mentor",
    location: "Cambridge, UK",
    rating: 4.94,
    reviews: 356,
    specialties: ["Academic Writing", "Research Methods", "PhD Guidance"],
    isNew: false,
    savedDate: "2024-01-01",
  },
]

// Mock service for clearing all saved specialists
const savedService = {
  clearAll: () => {
    console.log("Clearing all saved specialists")
    return Promise.resolve()
  },
}

export function ProfileSaved() {
  const { toast } = useToast()
  const router = useRouter()
  const [specialists, setSpecialists] = useState(initialSavedSpecialists)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"recent" | "rating" | "name">("recent")
  const [showClearDialog, setShowClearDialog] = useState(false)

  const handleSpecialistClick = (id: number) => {
    router.push(`/specialist/${id}`)
  }

  const handleRemoveFromSaved = (id: number) => {
    setSpecialists((prev) => prev.filter((s) => s.id !== id))
  }

  const handleClearAll = async () => {
    try {
      await savedService.clearAll()
      setSpecialists([])
      setShowClearDialog(false)
      toast({
        title: "All specialists removed",
        description: "Your saved specialists list has been cleared",
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear saved specialists",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const sortSpecialists = (sortType: "recent" | "rating" | "name") => {
    setSortBy(sortType)
  }

  // Filter specialists based on search term
  const filteredSpecialists = specialists.filter(
    (specialist) =>
      specialist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialist.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
      specialist.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Apply sorting to filtered specialists
  const sortedAndFilteredSpecialists = [...filteredSpecialists].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime()
      case "rating":
        return b.rating - a.rating
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const formatSavedDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return "Today"
    } else if (diffInDays === 1) {
      return "Yesterday"
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Heart className="h-6 w-6 mr-3 text-violet-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Saved Specialists</h1>
            <p className="text-gray-600 mt-1">
              {specialists.length} saved specialists
              {searchTerm &&
                filteredSpecialists.length !== specialists.length &&
                ` (${filteredSpecialists.length} matching "${searchTerm}")`}
            </p>
          </div>
        </div>
        {specialists.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setShowClearDialog(true)}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {specialists.length > 0 && (
        <>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search saved specialists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <SortAsc className="h-4 w-4 mr-2" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => sortSpecialists("recent")}>Recently Added</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => sortSpecialists("rating")}>Rating (High-Low)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => sortSpecialists("name")}>Alphabetical (A-Z)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Specialists Grid */}
          {sortedAndFilteredSpecialists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedAndFilteredSpecialists.map((specialist) => (
                <div key={specialist.id} className="relative group">
                  <div className="relative">
                    <SpecialistCard specialist={specialist} onClick={() => handleSpecialistClick(specialist.id)} />

                    {/* Remove button */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveFromSaved(specialist.id)
                      }}
                    >
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                    </Button>

                    {/* Saved date */}
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Saved {formatSavedDate(specialist.savedDate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No specialists found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search terms or filters</p>
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            </div>
          )}
        </>
      )}

      {specialists.length === 0 && (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No saved specialists yet</h3>
          <p className="text-gray-600 mb-6">
            Start exploring and save specialists you're interested in. You can save specialists by clicking the heart
            icon on their profile cards.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
          >
            Browse Specialists
          </Button>
        </div>
      )}

      {/* Clear All Confirmation Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove all saved specialists?</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove all saved specialists? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleClearAll} className="bg-red-600 hover:bg-red-700 text-white">
              Clear All
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
