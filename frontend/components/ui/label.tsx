import React from 'react'
import { cn } from '../../lib/format'

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className, ...props }) => (
  <label className={cn('text-sm font-medium text-slate-700', className)} {...props} />
)

export default Label

