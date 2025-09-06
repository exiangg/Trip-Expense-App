import React, { useEffect, useMemo, useState } from 'react'
import TripList, { Trip } from '../components/TripList'
import TripHeader from '../components/TripHeader'
import SummaryCards from '../components/SummaryCards'
import ParticipantsForm from '../components/ParticipantsForm'
import SettlementCard from '../components/SettlementCard'
import ExpensesTable, { Expense } from '../components/ExpensesTable'
import ExpenseDialog, { ExpenseFormValues } from '../components/ExpenseDialog'
import ConfirmDialog from '../components/ConfirmDialog'
import { ToastProvider, useToast } from '../components/ui/toast'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Plus } from '../components/icons'
import TripGrid from '../components/TripGrid'

const API = 'http://localhost:4000'

type Summary = {
  base_currency: string
  total_included_base: number
  per_person_share: number
  by_person: Record<string, number>
  deltas: Record<string, number>
  settlement: { from: string | null; to: string | null; amount: number }
}

function AppInner(){
  const { push } = useToast()
  const [trips, setTrips] = useState<Trip[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const selectedTrip = useMemo(() => trips.find(t => t.id === selectedId) || null, [trips, selectedId])

  // New trip state
  const [newTripName, setNewTripName] = useState('')

  // Settings form state
  const [baseCurrency, setBaseCurrency] = useState('SGD')
  const [spendCurrency, setSpendCurrency] = useState('SGD')
  const [fxRate, setFxRate] = useState('1')
  const [personA, setPersonA] = useState('Yixiang')
  const [personB, setPersonB] = useState('Tracy')
  const [dirty, setDirty] = useState(false)

  // Dialogs
  const [expenseOpen, setExpenseOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [confirmTrip, setConfirmTrip] = useState<Trip | null>(null)
  const [confirmExpense, setConfirmExpense] = useState<Expense | null>(null)

  async function loadTrips(){
    const res = await fetch(`${API}/trips`)
    if(!res.ok) throw new Error('Failed to load trips')
    const data = await res.json()
    setTrips(data)
  }
  async function loadExpenses(tripId: number){
    const res = await fetch(`${API}/trips/${tripId}/expenses`)
    if(!res.ok) throw new Error('Failed to load expenses')
    setExpenses(await res.json())
  }
  async function loadSummary(tripId: number){
    const res = await fetch(`${API}/trips/${tripId}/summary`)
    if(!res.ok) { setSummary(null); return }
    setSummary(await res.json())
  }

  useEffect(() => { loadTrips().catch(()=>{}) }, [])
  useEffect(() => { if(selectedId){ loadExpenses(selectedId).catch(()=>{}); loadSummary(selectedId).catch(()=>{}) } }, [selectedId])
  useEffect(() => {
    function onKey(e: KeyboardEvent){
      if(e.altKey && (e.key === 'e' || e.key === 'E')){
        if(selectedTrip){ setEditingExpense(null); setExpenseOpen(true) }
      }
      if(e.altKey && (e.key === 'n' || e.key === 'N')){
        addTrip()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedTrip, newTripName])
  useEffect(() => {
    if(selectedTrip){
      setBaseCurrency(selectedTrip.base_currency || 'SGD')
      setSpendCurrency(selectedTrip.spend_currency || selectedTrip.base_currency || 'SGD')
      setFxRate(String(selectedTrip.fx_rate ?? 1))
      setPersonA(selectedTrip.p1_name || 'Me')
      setPersonB(selectedTrip.p2_name || 'Wife')
      setDirty(false)
    }
  }, [selectedTrip?.id])

  async function addTrip(){
    if(!newTripName.trim()) return
    const res = await fetch(`${API}/trips`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: newTripName }) })
    if(!res.ok) return
    setNewTripName('')
    await loadTrips()
  }
  async function deleteTrip(trip: Trip){
    const res = await fetch(`${API}/trips/${trip.id}`, { method:'DELETE' })
    if(res.ok){
      if(selectedId===trip.id){ setSelectedId(null); setExpenses([]); setSummary(null) }
      await loadTrips()
      push({ title: 'Trip deleted' })
    }
  }
  async function saveSettings(){
    if(!selectedTrip) return
    const res = await fetch(`${API}/trips/${selectedTrip.id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ base_currency: baseCurrency, spend_currency: spendCurrency, fx_rate: Number(fxRate||'1'), p1_name: personA, p2_name: personB }) })
    if(res.ok){
      await loadTrips(); await loadExpenses(selectedTrip.id); await loadSummary(selectedTrip.id)
      setDirty(false)
      push({ title: 'Settings saved' })
    }
  }
  async function onSaveExpense(values: ExpenseFormValues){
    if(!selectedTrip) return
    const body = { description: values.description, amount: Number(values.amount), paid_by: values.paid_by || undefined, currency: values.currency, fx_rate: undefined, excluded: values.included ? 0 : 1 }
    if(editingExpense){
      const res = await fetch(`${API}/expenses/${editingExpense.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
      if(res.ok){ setExpenseOpen(false); setEditingExpense(null); await loadExpenses(selectedTrip.id); await loadTrips(); await loadSummary(selectedTrip.id); push({ title:'Expense updated' }) }
    } else {
      const res = await fetch(`${API}/trips/${selectedTrip.id}/expenses`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
      if(res.ok){
        const created = await res.json()
        // apply exclusion if needed
        if(values.included === false){
          await fetch(`${API}/expenses/${created.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ excluded: 1 }) })
        }
        setExpenseOpen(false)
        await loadExpenses(selectedTrip.id); await loadTrips(); await loadSummary(selectedTrip.id); push({ title:'Expense added' })
      }
    }
  }
  async function toggleExclude(e: Expense){
    await fetch(`${API}/expenses/${e.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ excluded: !e.excluded }) })
    if(selectedId){ await loadExpenses(selectedId); await loadTrips(); await loadSummary(selectedId) }
  }
  async function confirmDeleteExpense(){
    if(!confirmExpense) return
    await fetch(`${API}/expenses/${confirmExpense.id}`, { method:'DELETE' })
    setConfirmExpense(null)
    if(selectedId){ await loadExpenses(selectedId); await loadTrips(); await loadSummary(selectedId) }
  }

  const outstanding = useMemo(() => {
    if(!summary) return 0
    return Math.abs(summary.settlement.amount || 0)
  }, [summary])

  return (
    <div className="flex bg-gradient-to-br from-sky-50 to-emerald-50 min-h-screen">
      <TripList
        trips={trips}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onAdd={addTrip}
        onDelete={(t)=>setConfirmTrip(t)}
      />

      <main className="flex-1 p-4 space-y-4">
        {/* Optional top bar with new trip input */}
        <div className="flex items-center gap-3">
          <Input className="w-auto flex-1 min-w-0" placeholder="New trip name" value={newTripName} onChange={e=>setNewTripName(e.target.value)} onKeyDown={e=>{ if(e.altKey && e.key.toLowerCase()==='n'){ addTrip() } }} />
          <Button size="lg" className="rounded-full shadow-md whitespace-nowrap flex-shrink-0 min-w-[120px]" onClick={addTrip} aria-label="Create new trip">
            <Plus className="mr-2" />
            New Trip
          </Button>
        </div>

        {selectedTrip ? (
          <div className="space-y-4">
            <TripHeader
              name={selectedTrip.name}
              id={selectedTrip.id}
              baseCurrency={selectedTrip.base_currency}
              onBack={() => setSelectedId(null)}
              onAddExpense={() => { setEditingExpense(null); setExpenseOpen(true) }}
              onSettle={() => summary && push({ title: '💸 Settlement', description: summary.settlement.amount>0 ? `${summary.settlement.from} pays ${summary.settlement.to} ${new Intl.NumberFormat(undefined,{style:'currency',currency: summary.base_currency}).format(summary.settlement.amount)}` : 'Even split — no transfer' })}
            />

            <SummaryCards
              baseCurrency={selectedTrip.base_currency}
              total={summary?.total_included_base || 0}
              outstanding={outstanding}
              fxRate={selectedTrip.fx_rate}
              showFx={selectedTrip.base_currency !== selectedTrip.spend_currency}
              participants={[personA, personB]}
            />

            <ParticipantsForm
              baseCurrency={baseCurrency}
              spendCurrency={spendCurrency}
              fxRate={fxRate}
              personA={personA}
              personB={personB}
              dirty={dirty}
              onChange={(patch) => { if(patch.baseCurrency!==undefined) setBaseCurrency(patch.baseCurrency); if(patch.spendCurrency!==undefined) setSpendCurrency(patch.spendCurrency); if(patch.fxRate!==undefined) setFxRate(patch.fxRate); if(patch.personA!==undefined) setPersonA(patch.personA); if(patch.personB!==undefined) setPersonB(patch.personB); setDirty(true) }}
              onSave={saveSettings}
            />

            <SettlementCard
              baseCurrency={summary?.base_currency || selectedTrip.base_currency}
              personA={personA}
              personB={personB}
              byPerson={summary?.by_person || {}}
              perShare={summary?.per_person_share || 0}
              settlement={summary?.settlement || { from:null, to:null, amount: 0 }}
            />

            <ExpensesTable
              baseCurrency={selectedTrip.base_currency}
              expenses={expenses}
              onEdit={(e)=>{ setEditingExpense(e); setExpenseOpen(true) }}
              onDelete={(e)=>setConfirmExpense(e)}
              onToggleExclude={toggleExclude}
            />
          </div>
        ) : (
          <TripGrid
            trips={trips}
            onSelect={setSelectedId}
            onDelete={(t)=>setConfirmTrip(t)}
          />
        )}
      </main>

      {/* Dialogs */}
      <ExpenseDialog
        open={expenseOpen}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
        baseCurrency={selectedTrip?.base_currency || 'SGD'}
        spendCurrency={selectedTrip?.spend_currency || selectedTrip?.base_currency || 'SGD'}
        people={[personA, personB]}
        initial={editingExpense ? { description: editingExpense.description, amount: String(editingExpense.amount), currency: editingExpense.currency, paid_by: editingExpense.paid_by || '', included: !editingExpense.excluded } : undefined}
        onClose={() => { setExpenseOpen(false); setEditingExpense(null) }}
        onSave={(v)=>{ onSaveExpense(v).then(()=>push({ title: editingExpense ? '🎉 Expense Updated' : '🎉 Expense Added', description: `${v.description} ${v.currency} ${v.amount}` })) }}
      />

      <ConfirmDialog
        open={!!confirmTrip}
        title="Delete trip?"
        message={`Delete "${confirmTrip?.name}" and all its expenses?`}
        onCancel={() => setConfirmTrip(null)}
        onConfirm={() => { if(confirmTrip) deleteTrip(confirmTrip); setConfirmTrip(null) }}
        confirmLabel="Delete"
      />

      <ConfirmDialog
        open={!!confirmExpense}
        title="Delete expense?"
        message={`Delete "${confirmExpense?.description}"?`}
        onCancel={() => setConfirmExpense(null)}
        onConfirm={confirmDeleteExpense}
        confirmLabel="Delete"
      />
    </div>
  )
}

export default function App(){
  return (
    <ToastProvider>
      <AppInner/>
    </ToastProvider>
  )
}
