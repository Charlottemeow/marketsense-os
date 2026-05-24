'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'
import DeepDiveForm from '@/components/deep-dives/deep-dive-form'
import { ArrowLeft } from 'lucide-react'

export default function NewDeepDivePage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (data: any) => {
    setIsSaving(true)
    await new Promise(r => setTimeout(r, 800))
    console.log('Deep dive saved:', data)
    setIsSaving(false)
    router.push('/deep-dives')
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/deep-dives"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('dive.back')}
        </Link>
        <h1 className="text-2xl font-display text-foreground mt-2">{t('dive.new')}</h1>
        <p className="text-sm text-muted mt-1">Document and analyze a market event in detail</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <DeepDiveForm onSave={handleSave} isSaving={isSaving} />
      </div>
    </div>
  )
}
