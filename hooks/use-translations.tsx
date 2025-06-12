"use client"

import { useTranslation as useI18nTranslation, Trans } from "react-i18next"
import { useEffect, useState } from "react"
import i18n, { initI18n } from "../lib/i18n"

export type Language = "en" | "ru"

// Custom hook that wraps react-i18next's useTranslation
export const useTranslations = () => {
  const { t, i18n: i18nInstance } = useI18nTranslation("common")
  const [isReady, setIsReady] = useState(false)

  // Initialize i18n and handle language setup
  useEffect(() => {
    const setupI18n = async () => {
      try {
        await initI18n()

        // Wait for i18n to be ready
        if (i18n.isInitialized) {
          const savedLanguage = localStorage.getItem("language") as Language
          if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ru")) {
            if (i18n.language !== savedLanguage) {
              await i18n.changeLanguage(savedLanguage)
            }
          } else if (!savedLanguage) {
            // Set default to Russian if no language is saved
            await i18n.changeLanguage("ru")
          }
          setIsReady(true)
        }
      } catch (error) {
        console.error("Failed to initialize i18n:", error)
        setIsReady(true) // Set ready even on error to prevent infinite loading
      }
    }

    setupI18n()
  }, [])

  const changeLanguage = async (lang: Language) => {
    try {
      if (i18n.isInitialized && typeof i18n.changeLanguage === "function") {
        await i18n.changeLanguage(lang)
        localStorage.setItem("language", lang)
      }
    } catch (error) {
      console.error("Failed to change language:", error)
    }
  }

  const language = (i18nInstance?.language || i18n?.language || "ru") as Language

  return {
    t,
    language,
    changeLanguage,
    i18n: i18nInstance || i18n,
    Trans,
    isReady,
  }
}

// Re-export useTranslation from react-i18next for direct use
export { useTranslation } from "react-i18next"
