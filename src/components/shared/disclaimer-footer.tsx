"use client"

import { useLanguage } from "@/lib/i18n/context"

export function DisclaimerFooter() {
  const { t } = useLanguage()
  return (
    <div className="px-6 py-3">
      <p className="text-xs text-muted text-center leading-relaxed">
        {t("app.disclaimer")}
      </p>
    </div>
  )
}
