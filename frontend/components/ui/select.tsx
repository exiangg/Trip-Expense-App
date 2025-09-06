import React from 'react'

type Option = { label: string; value: string }

export const Select: React.FC<{
  id?: string
  value: string
  onChange: (v: string) => void
  options: Option[]
  disabled?: boolean
  className?: string
}> = ({ id, value, onChange, options, disabled, className }) => (
  <select id={id} value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
          className={`h-9 rounded-md border border-slate-300 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 ${className||''}`}>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
)

