"use client"

import * as React from "react"
import type { Lang } from "./dictionary"
import { dictionary } from "./dictionary"

interface LanguageContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string) => string
}

const LanguageContext = React.createContext<LanguageContextType | null>(null)

function getInitialLang(): Lang {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("marketsense-lang") as Lang | null
    if (stored === "en" || stored === "zh-CN") return stored
    const browserLang = navigator.language
    if (browserLang.startsWith("zh")) return "zh-CN"
  }
  return "en"
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>("en")

  React.useEffect(() => {
    setLangState(getInitialLang())
  }, [])

  const setLang = React.useCallback((newLang: Lang) => {
    setLangState(newLang)
    localStorage.setItem("marketsense-lang", newLang)
    document.documentElement.lang = newLang
  }, [])

  const t = React.useCallback(
    (key: string): string => {
      const entry = dictionary[key]
      if (!entry) return key
      return entry[lang]
    },
    [lang]
  )

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext)
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return ctx
}
