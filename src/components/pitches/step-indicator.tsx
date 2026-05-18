'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

const STEPS = [
  'Company Snapshot',
  'Recommendation',
  'Market Narrative',
  'Variant View',
  'Investment Thesis',
  'Valuation',
  'Catalysts',
  'Risks',
  'Export',
]

interface StepIndicatorProps {
  currentStep: number
  onStepClick?: (step: number) => void
}

export default function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-1">
      {STEPS.map((label, i) => {
        const stepNum = i + 1
        const isCompleted = stepNum < currentStep
        const isCurrent = stepNum === currentStep
        const isClickable = isCompleted || isCurrent

        return (
          <div key={label} className="flex items-center gap-1 flex-1">
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => onStepClick?.(stepNum)}
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-colors',
                isCompleted && 'bg-accent text-accent-foreground',
                isCurrent && 'bg-accent/20 text-accent border border-accent',
                !isClickable && 'bg-card text-muted border border-border',
                isClickable && !isCompleted && !isCurrent && 'hover:bg-card-hover',
              )}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
            </button>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'h-px flex-1',
                  stepNum < currentStep ? 'bg-accent/50' : 'bg-border',
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
