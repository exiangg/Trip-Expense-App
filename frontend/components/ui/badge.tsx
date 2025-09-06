import React from 'react'
import { cn } from '../../lib/format'

export const Badge: React.FC<React.HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'outline' | 'secondary' }>
  = ({ className, variant='default', ...props }) => (
  <span className={cn('inline-flex items-center rounded border px-2 py-0.5 text-xs',
    variant === 'default' && 'bg-slate-900 text-white border-slate-900',
    variant === 'secondary' && 'bg-slate-100 text-slate-900 border-slate-200',
    variant === 'outline' && 'border-slate-300 text-slate-700',
    className)} {...props} />
)

