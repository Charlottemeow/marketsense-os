'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'
import PitchWizard from '@/components/pitches/pitch-wizard'
import { ArrowLeft } from 'lucide-react'

export default function NewPitchPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (data: any) => {
    setIsSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    console.log('Pitch saved:', data)
    setIsSaving(false)
    router.push('/pitches')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/pitches"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('pitch.back')}
        </Link>
        <h1 className="text-2xl font-display text-foreground mt-2">{t('pitch.new')}</h1>
        <p className="text-sm text-muted mt-1">Create a formal investment thesis with variant views</p>
      </div>

      <PitchWizard onSave={handleSave} isSaving={isSaving} />
    </div>
  )
}
