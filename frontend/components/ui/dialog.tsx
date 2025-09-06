import React from 'react'
import { cn } from '../../lib/format'

export const Dialog: React.FC<{ open: boolean, onOpenChange: (v: boolean) => void, children: React.ReactNode }>
  = ({ open, onOpenChange, children }) => {
  if (!open) return null
  return (
    <div className="backdrop" role="dialog" aria-modal="true" onClick={() => onOpenChange(false)}>
      <div className="card w-[560px] max-w-[95vw]" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('px-4 py-3 border-b', className)} {...props} />
)
export const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3 className={cn('text-base font-semibold', className)} {...props} />
)
export const DialogContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('p-4', className)} {...props} />
)
export const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('px-4 py-3 border-t flex justify-end gap-2', className)} {...props} />
)

