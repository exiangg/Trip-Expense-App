import React from 'react'
export const Separator: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`h-px w-full bg-slate-200 ${className || ''}`} />
)

