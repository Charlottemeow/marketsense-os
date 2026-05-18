'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface UpdateLog {
  id: string
  provider: string
  action: string
  status: 'success' | 'error'
  message: string
  timestamp: string
  duration: string
}

interface UpdateLogsProps {
  logs: UpdateLog[]
}

const PAGE_SIZE = 10

export default function UpdateLogs({ logs }: UpdateLogsProps) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(logs.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const visibleLogs = logs.slice(start, start + PAGE_SIZE)

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-3 py-2">Time</th>
              <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-3 py-2">Provider</th>
              <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-3 py-2">Action</th>
              <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-3 py-2">Status</th>
              <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-3 py-2">Duration</th>
              <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-3 py-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {visibleLogs.map(log => (
              <tr key={log.id} className="border-b border-border hover:bg-card-hover transition-colors">
                <td className="px-3 py-2.5 font-mono text-data-xs tabular-nums text-muted">{log.timestamp}</td>
                <td className="px-3 py-2.5 text-foreground">{log.provider}</td>
                <td className="px-3 py-2.5 text-foreground">{log.action}</td>
                <td className="px-3 py-2.5">
                  <span className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                    log.status === 'success' ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative',
                  )}>
                    {log.status}
                  </span>
                </td>
                <td className="px-3 py-2.5 font-mono text-data-xs tabular-nums text-muted">{log.duration}</td>
                <td className="px-3 py-2.5 text-muted max-w-[200px] truncate">{log.message}</td>
              </tr>
            ))}
            {visibleLogs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-muted text-sm">
                  No update logs yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-muted">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1 hover:bg-card-hover rounded transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 text-muted" />
            </button>
            <button
              type="button"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1 hover:bg-card-hover rounded transition-colors disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4 text-muted" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
