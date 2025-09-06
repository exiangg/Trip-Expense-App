import React from 'react'
import { cn } from '../../lib/format'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, variant='default', size='md', ...props }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
    const variants: Record<NonNullable<Props['variant']>, string> = {
      default: 'bg-blue-600 hover:bg-blue-700 text-white focus-visible:ring-blue-300',
      secondary: 'bg-emerald-600 hover:bg-emerald-700 text-white focus-visible:ring-emerald-300',
      outline: 'border border-slate-300 hover:bg-slate-50 text-slate-800',
      ghost: 'hover:bg-slate-100',
      destructive: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-300',
    }
    const sizes: Record<NonNullable<Props['size']>, string> = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-9 px-4 text-sm',
      lg: 'h-11 px-6',
      icon: 'h-9 w-9',
    }
    return (
      <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
    )
  }
)
Button.displayName = 'Button'
