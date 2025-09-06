import React from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { ArrowLeft, Plus } from './icons'

function emojiForName(name: string){
  const n = name.toLowerCase()
  if(n.includes('beach') || n.includes('island') || n.includes('jeju')) return '🏖️'
  if(n.includes('bali') || n.includes('thai') || n.includes('resort')) return '🌴'
  return '✈️'
}

export const TripHeader: React.FC<{
  name: string
  id: number
  baseCurrency: string
  onBack: () => void
  onAddExpense: () => void
  onSettle: () => void
}> = ({ name, id, baseCurrency, onBack, onAddExpense, onSettle }) => (
  <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-white to-slate-50 border border-slate-200/60 shadow-sm">
    <div className="flex items-center gap-2 min-w-0">
      <h1 className="text-2xl font-bold truncate text-blue-700" title={name}>{emojiForName(name)} {name}</h1>
      <Badge variant="outline" className="bg-violet-100 text-violet-800 border-violet-200">#{id}</Badge>
      <Badge className="bg-amber-100 text-amber-800 border-amber-200">{baseCurrency}</Badge>
    </div>
    <div className="flex items-center gap-2">
      <Button variant="secondary" onClick={onBack} aria-label="Back"><ArrowLeft className="mr-1"/>Back</Button>
      <Button onClick={onAddExpense} aria-label="Add expense"><Plus className="mr-1"/>Add Expense</Button>
      <Button variant="outline" onClick={onSettle} aria-label="Settle">Settle</Button>
    </div>
  </div>
)

export default TripHeader
