import React from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import Label from './ui/label'
import { Plus, Trash2, ChevronRight, Suitcase } from './icons'
import { formatCurrency, cn } from '../lib/format'

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

export const TripList: React.FC<{
  trips: Trip[]
  selectedId: number | null
  onSelect: (id: number) => void
  onAdd: () => void
  onDelete: (trip: Trip) => void
}> = ({ trips, selectedId, onSelect, onAdd, onDelete }) => {
  const [q, setQ] = React.useState('')
  const filtered = trips.filter(t => t.name.toLowerCase().includes(q.toLowerCase()))
  return (
    <>
    <aside className="hidden md:flex w-80 border-r bg-white/90 backdrop-blur h-screen sticky top-0 p-4 flex-col gap-3">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold">欠💰还💰</h2>
      </div>
      <div>
        <Label htmlFor="search" className="sr-only">Search trips</Label>
        <Input id="search" placeholder="Search trips" value={q} onChange={e=>setQ(e.target.value)} />
      </div>
      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <div className="h-full grid place-items-center text-center p-4">
            <div>
              <p className="text-slate-600 mb-2">No trips yet</p>
              <Button onClick={onAdd}><Plus className="mr-1"/>Create your first trip</Button>
            </div>
          </div>
        ) : (
          <ul className="space-y-2">
            {filtered.map(t => (
              <li key={t.id} className={cn('group rounded-xl bg-white shadow-md hover:shadow-lg transition', selectedId===t.id && 'ring-2 ring-sky-300')}>
                <button aria-selected={selectedId===t.id} onClick={()=>onSelect(t.id)} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-sky-50 text-left">
                  <div className="flex items-center gap-2 min-w-0">
                    <Suitcase className="w-5 h-5 text-sky-500"/>
                    <span className="font-semibold truncate" title={t.name}>{t.name}</span>
                    <span className="text-xs bg-amber-200 text-amber-800 rounded px-1.5 py-0.5">{t.base_currency}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono tabular text-slate-700">{typeof t.total_base !== 'undefined' ? formatCurrency(Number(t.total_base||0), t.base_currency) : ''}</span>
                    <ChevronRight className="opacity-40"/>
                  </div>
                </button>
                <div className="absolute mt-[-38px] right-3 opacity-0 group-hover:opacity-100">
                  <button aria-label="Delete trip" title="Delete" className="text-slate-600 hover:text-red-600" onClick={()=>onDelete(t)}>
                    <Trash2 />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
    {/* Mobile bottom sheet */}
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t p-2 rounded-t-2xl shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold">Trip List</h2>
        <Button size="sm" onClick={onAdd}><Plus className="mr-1"/>New</Button>
      </div>
      <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
        {filtered.map(t => (
          <button key={t.id} className={cn('flex items-center justify-between p-3 rounded-xl hover:bg-sky-100 transition', selectedId===t.id && 'bg-sky-50 ring-1 ring-sky-300')} onClick={()=>onSelect(t.id)}>
            <div className="flex items-center gap-2">
              <Suitcase className="w-5 h-5 text-sky-500"/>
              <span className="font-semibold truncate" title={t.name}>{t.name}</span>
            </div>
            <span className="font-mono text-slate-700 tabular">{typeof t.total_base !== 'undefined' ? formatCurrency(Number(t.total_base||0), t.base_currency) : ''}</span>
          </button>
        ))}
      </div>
    </div>
    </>
  )
}

export default TripList
