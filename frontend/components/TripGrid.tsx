import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Trash2, Suitcase } from './icons'
import { formatCurrency } from '../lib/format'

export type Trip = {
  id: number
  name: string
  base_currency: string
  spend_currency?: string
  fx_rate?: number
  p1_name?: string
  p2_name?: string
  total_base?: number
}

const Participants: React.FC<{ a?: string; b?: string }> = ({ a, b }) => {
  const list = [a, b].filter(Boolean).join(', ')
  return <span className="text-sm text-slate-600">{list || '—'}</span>
}

const TripCard: React.FC<{
  trip: Trip
  onSelect: (id: number) => void
  onDelete: (trip: Trip) => void
}> = ({ trip, onSelect, onDelete }) => (
  <Card
    className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-gradient-to-br from-white to-slate-50 border border-slate-200/70"
    onClick={() => onSelect(trip.id)}
  >
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg font-semibold text-blue-700 flex items-center gap-2">
          <Suitcase className="w-5 h-5" />
          <span className="truncate" title={trip.name}>{trip.name}</span>
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700"
          onClick={(e) => { e.stopPropagation(); onDelete(trip) }}
          aria-label="Delete trip"
        >
          <Trash2 />
        </Button>
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center justify-between">
        <Participants a={trip.p1_name} b={trip.p2_name} />
        <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200 font-semibold">
          {trip.base_currency}
        </Badge>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-600">Total Spent</span>
        <span className="text-xl font-bold text-slate-900">
          {typeof trip.total_base !== 'undefined' ? formatCurrency(Number(trip.total_base || 0), trip.base_currency) : ''}
        </span>
      </div>
    </CardContent>
  </Card>
)

const TripGrid: React.FC<{
  trips: Trip[]
  onSelect: (id: number) => void
  onDelete: (trip: Trip) => void
}> = ({ trips, onSelect, onDelete }) => {
  if (!trips || trips.length === 0) {
    return (
      <div className="h-full grid place-items-center text-center p-6 rounded-2xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-blue-50">
        <div>
          <div className="text-3xl mb-2">✈️</div>
          <p className="text-slate-700 mb-1 font-medium">No trips yet</p>
          <p className="text-slate-500">Create your first trip to get started.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {trips.map(t => (
        <TripCard key={t.id} trip={t} onSelect={onSelect} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default TripGrid
