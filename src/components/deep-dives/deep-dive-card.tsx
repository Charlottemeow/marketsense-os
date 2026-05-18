'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ArrowRight, Calendar } from 'lucide-react'

interface DeepDive {
  id: string
  title: string
  date: string
  eventDescription: string
  firstOrderCause: string
}

interface DeepDiveCardProps {
  deepDive: DeepDive
}

export default function DeepDiveCard({ deepDive }: DeepDiveCardProps) {
  return (
    <Link
      href={`/deep-dives/${deepDive.id}`}
      className="block bg-card border border-border rounded-lg p-5 card-glow hover:bg-card-hover transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground truncate">
            {deepDive.title}
          </h3>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted">
            <Calendar className="w-3.5 h-3.5" />
            <span className="font-mono tabular-nums">{deepDive.date}</span>
          </div>
          <p className="mt-3 text-sm text-muted line-clamp-2">
            {deepDive.eventDescription}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-muted">1st order cause:</span>
            <span className="text-xs text-foreground truncate">{deepDive.firstOrderCause}</span>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-muted shrink-0 mt-1" />
      </div>
    </Link>
  )
}
