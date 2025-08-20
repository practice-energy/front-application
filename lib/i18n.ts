import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import Backend from "i18next-http-backend"
import LanguageDetector from "i18next-browser-languagedetector"

const initI18n = async () => {
  if (!i18n.isInitialized) {
    await i18n
      .use(Backend)
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        lng: "ru", // default language
        fallbackLng: "en",
        debug: false,

        interpolation: {
          escapeValue: false, // not needed for react as it escapes by default
        },

        backend: {
          loadPath: "/locales/{{lng}}/{{ns}}.json",
        },

        detection: {
          order: ["localStorage", "navigator"],
          caches: ["localStorage"],
        },

        defaultNS: "common",
        ns: ["common"],

        react: {
          useSuspense: false,
        },
      })
  }
  return i18n
}

// Initialize immediately
initI18n()

export default i18n
export { initI18n }
