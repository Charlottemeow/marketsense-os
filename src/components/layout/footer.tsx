"use client"

import { useLanguage } from "@/lib/i18n/context"

export function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="border-t border-border bg-card py-3 px-6">
      <p className="text-xs text-muted text-center">
        {t("app.disclaimer")}
      </p>
    </footer>
  )
}
