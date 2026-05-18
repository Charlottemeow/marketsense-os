'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { FileText, Copy, Check, ArrowLeft } from 'lucide-react'

interface PitchData {
  companyName: string
  ticker: string
  sector: string
  currentPrice: string
  recommendation: string
  targetPrice: string
  timeHorizon: string
  marketNarrative: string
  variantViewBull: string
  variantViewBear: string
  investmentThesis: string
  valuationMethodology: string
  valuationAnalysis: string
  catalysts: string
  risks: string
}

interface PitchExportProps {
  data: PitchData
  onBack: () => void
}

export default function PitchExport({ data, onBack }: PitchExportProps) {
  const [scriptLength, setScriptLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [copied, setCopied] = useState(false)

  const generateMarkdown = () => {
    const lines: string[] = []
    const includeDetail = scriptLength !== 'short'

    lines.push(`# ${data.companyName} (${data.ticker}) — ${data.recommendation}`)
    lines.push('')
    lines.push(`**Sector:** ${data.sector}`)
    lines.push(`**Current Price:** ${data.currentPrice}`)
    lines.push(`**Target Price:** ${data.targetPrice}`)
    lines.push(`**Time Horizon:** ${data.timeHorizon}`)
    lines.push('')
    lines.push('---')
    lines.push('')
    lines.push('## Thesis')
    lines.push('')
    lines.push(data.investmentThesis)
    lines.push('')

    if (includeDetail) {
      lines.push('---')
      lines.push('')
      lines.push('## Market Narrative')
      lines.push('')
      lines.push(data.marketNarrative)
      lines.push('')
      lines.push('---')
      lines.push('')
      lines.push('## Variant View')
      lines.push('')
      lines.push('### Bull Case')
      lines.push(data.variantViewBull)
      lines.push('')
      lines.push('### Bear Case')
      lines.push(data.variantViewBear)
      lines.push('')
      lines.push('---')
      lines.push('')
      lines.push('## Valuation')
      lines.push('')
      lines.push(`**Methodology:** ${data.valuationMethodology}`)
      lines.push('')
      lines.push(data.valuationAnalysis)
      lines.push('')
    }

    if (scriptLength === 'long') {
      lines.push('---')
      lines.push('')
      lines.push('## Catalysts')
      lines.push('')
      lines.push(data.catalysts)
      lines.push('')
      lines.push('---')
      lines.push('')
      lines.push('## Risks')
      lines.push('')
      lines.push(data.risks)
    }

    return lines.join('\n')
  }

  const handleCopy = async () => {
    const md = generateMarkdown()
    await navigator.clipboard.writeText(md)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const md = generateMarkdown()
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.ticker || 'pitch'}_investment_pitch.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to edit
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted">Pitch script length:</span>
        <div className="flex gap-1">
          {(['short', 'medium', 'long'] as const).map(length => (
            <button
              key={length}
              type="button"
              onClick={() => setScriptLength(length)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                scriptLength === length
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-card text-muted border border-border hover:bg-card-hover',
              )}
            >
              {length.charAt(0).toUpperCase() + length.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">
          {generateMarkdown()}
        </pre>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Markdown'}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground rounded-md text-sm font-medium hover:bg-card-hover transition-colors"
        >
          <FileText className="w-4 h-4" />
          Download .md
        </button>
      </div>
    </div>
  )
}
