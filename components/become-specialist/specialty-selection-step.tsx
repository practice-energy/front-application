"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X, Check } from "lucide-react"
import { useTranslations } from "@/hooks/use-translations"

interface SpecialtySelectionStepProps {
  specialties: string[]
  customSpecialty: string
  onSpecialtiesChange: (specialties: string[]) => void
  onCustomSpecialtyChange: (specialty: string) => void
}

const availableSpecialties = [
  "Астрология",
  "Таро и оракулы",
  "Нумерология",
  "Медитация и визуализация",
  "Энергетические практики",
]

export function SpecialtySelectionStep({
  specialties,
  customSpecialty,
  onSpecialtiesChange,
  onCustomSpecialtyChange,
}: SpecialtySelectionStepProps) {
  const { t } = useTranslations()

  const handleSpecialtyToggle = (specialty: string) => {
    const newSpecialties = specialties.includes(specialty)
      ? specialties.filter((s) => s !== specialty)
      : [...specialties, specialty]
    onSpecialtiesChange(newSpecialties)

    if (customSpecialty === specialty) {
      onCustomSpecialtyChange("")
    }
  }

  const handleAddCustomSpecialty = () => {
    if (customSpecialty.trim() && !specialties.includes(customSpecialty.trim())) {
      handleSpecialtyToggle(customSpecialty.trim())
      onCustomSpecialtyChange("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddCustomSpecialty()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
          Select Your Specialties
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto transition-colors duration-300">
          Choose the areas where you can help others
        </p>
      </div>

      {/* Specialty Grid */}
      <div className="flex flex-wrap justify-center gap-3">
        {availableSpecialties.map((specialty) => {
          const isSelected = specialties.includes(specialty)
          return (
            <button
              key={specialty}
              type="button"
              className={`px-4 py-2 rounded-sm text-sm font-medium border transition-all duration-200 ${
                isSelected
                  ? "bg-violet-500 text-white border-violet-500 shadow-sm"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20"
              }`}
              onClick={() => handleSpecialtyToggle(specialty)}
            >
              {specialty}
            </button>
          )
        })}
      </div>

      <div className="mt-4">
        <Label
          htmlFor="customSpecialty"
          className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300"
        >
          Add Custom Specialty
        </Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="customSpecialty"
            value={customSpecialty}
            onChange={(e) => onCustomSpecialtyChange(e.target.value)}
            placeholder="Enter your specialty..."
            className="flex-1 text-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 transition-colors duration-300"
            onKeyPress={handleKeyPress}
          />
          <Button
            type="button"
            onClick={handleAddCustomSpecialty}
            variant="outline"
            size="sm"
            className="text-violet-600 border-violet-300 hover:bg-violet-50 dark:text-violet-400 dark:border-violet-600 dark:hover:bg-violet-900/20 transition-colors duration-300 bg-transparent"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Selected Specialties with Removal */}
      {specialties.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 transition-colors duration-300">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 bg-violet-600 rounded-sm flex items-center justify-center">
              <Check className="h-3 w-3 text-white" />
            </div>
            <span className="font-medium text-gray-800 dark:text-gray-200 text-sm transition-colors duration-300">
              {specialties.length} specialt{specialties.length === 1 ? "y" : "ies"} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {specialties.map((specialty) => (
              <div
                key={specialty}
                className="inline-flex items-center px-3 py-1 rounded-sm text-sm font-medium bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-500 shadow-sm group hover:border-red-300 transition-all duration-200"
              >
                <span className="mr-2">{specialty}</span>
                <button
                  type="button"
                  onClick={() => handleSpecialtyToggle(specialty)}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
