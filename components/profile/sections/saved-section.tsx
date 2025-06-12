"use client"

import { useState } from "react"
import { useProfileStore } from "@/stores/profile-store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SpecialistCard } from "@/components/specialist-card"
import { Trash2, SortAsc, FolderOpen } from "lucide-react"
import { savedService } from "@/services/mock-data"
import { useTranslations } from "@/hooks/use-translations"

// Sort options
const SORT_OPTIONS = [
  { value: "recent", label: "Recently Added" },
  { value: "az", label: "A-Z" },
  { value: "rating", label: "Rating: High to Low" },
]

export function SavedSection() {
  const { t } = useTranslations()
  const { savedSpecialists, clearAllSpecialists, setLoading } = useProfileStore()
  const [sortOption, setSortOption] = useState<string>("recent")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleClearAll = async () => {
    setLoading(true)
    try {
      await savedService.clearAll()
      clearAllSpecialists()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to clear specialists:", error)
    } finally {
      setLoading(false)
    }
  }

  // Convert savedSpecialists to the format expected by SpecialistCard
  const formattedSpecialists = savedSpecialists.map((specialist) => ({
    id: specialist.id,
    image: specialist.photo,
    name: specialist.name,
    title: specialist.specialties.join(", "),
    location: "Local",
    rating: specialist.rating,
    reviews: specialist.reviewCount,
    specialties: specialist.specialties,
    isNew: false,
    savedAt: specialist.savedDate,
  }))

  // Sort specialists based on selected option
  const sortedSpecialists = [...formattedSpecialists].sort((a, b) => {
    switch (sortOption) {
      case "az":
        return a.name.localeCompare(b.name)
      case "rating":
        return b.rating - a.rating
      case "recent":
      default:
        return b.savedAt.getTime() - a.savedAt.getTime()
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("savedSection.title", "Saved Specialists")}</h1>
          <p className="text-gray-600">
            {t(
              "savedSection.count",
              { count: savedSpecialists.length },
              `${savedSpecialists.length} specialists saved`,
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Control */}
          <div className="flex items-center gap-2">
            <SortAsc className="h-4 w-4 text-gray-500" />
            <Select value={sortOption} onValueChange={(value) => setSortOption(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(`savedSection.sortOptions.${option.value}`, option.label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear All Button */}
          {savedSpecialists.length > 0 && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                  {t("savedSection.clearAll", "Clear All")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("savedSection.confirmClear.title", "Remove all saved specialists?")}</DialogTitle>
                  <DialogDescription>
                    {t(
                      "savedSection.confirmClear.description",
                      "This will permanently remove all specialists from your saved list.",
                    )}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {t("common.cancel", "Cancel")}
                  </Button>
                  <Button variant="destructive" onClick={handleClearAll}>
                    {t("common.confirm", "Confirm")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Content */}
      {savedSpecialists.length === 0 ? (
        <Card className="p-6">
          <div className="text-center py-12">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">{t("savedSection.empty.title", "No saved specialists")}</h3>
            <p className="mt-1 text-gray-500">
              {t("savedSection.empty.description", "Start saving specialists to see them appear here")}
            </p>
            <Button className="mt-6">{t("savedSection.empty.browseButton", "Browse Specialists")}</Button>
          </div>
        </Card>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {sortedSpecialists.map((specialist) => (
              <SpecialistCard key={specialist.id} specialist={specialist} showSpecialties={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
