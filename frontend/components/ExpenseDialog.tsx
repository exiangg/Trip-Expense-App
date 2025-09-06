import React, { useEffect, useState } from 'react'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import Label from './ui/label'
import { Select } from './ui/select'

export type ExpenseFormValues = {
  description: string
  amount: string
  currency: string
  paid_by: string
  included: boolean
}

export const ExpenseDialog: React.FC<{
  open: boolean
  title: string
  baseCurrency: string
  spendCurrency: string
  people: string[]
  initial?: Partial<ExpenseFormValues>
  onClose: () => void
  onSave: (values: ExpenseFormValues) => void
}> = ({ open, title, baseCurrency, spendCurrency, people, initial, onClose, onSave }) => {
  const [values, setValues] = useState<ExpenseFormValues>({ description: '', amount: '', currency: spendCurrency, paid_by: people[0] || '', included: true })
  const [error, setError] = useState('')
  useEffect(() => {
    setValues(v => ({ ...v, currency: spendCurrency }))
  }, [spendCurrency])
  useEffect(() => {
    if (initial) {
      setValues({
        description: initial.description ?? '',
        amount: initial.amount ?? '',
        currency: initial.currency ?? spendCurrency,
        paid_by: initial.paid_by ?? (people[0] || ''),
        included: initial.included ?? true,
      })
    }
  }, [initial, spendCurrency, people])

  // Reset fields when opening a fresh Add dialog (no initial provided)
  useEffect(() => {
    if (open && !initial) {
      setValues({ description: '', amount: '', currency: spendCurrency, paid_by: people[0] || '', included: true })
      setError('')
    }
  }, [open, initial, spendCurrency, people])
  function submit() {
    setError('')
    const amt = Number(values.amount)
    if (!values.description.trim()) return setError('Description is required')
    if (!(amt > 0)) return setError('Amount must be greater than 0')
    if (!values.currency) return setError('Currency is required')
    onSave(values)
  }
  return (
    <Dialog open={open} onOpenChange={(v)=>!v && onClose()}>
      <DialogHeader>
        <DialogTitle className="text-slate-800">{title}</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="desc">Description</Label>
            <Input id="desc" value={values.description} onChange={e=>setValues({...values, description:e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <Label htmlFor="amt">Amount</Label>
              <Input id="amt" inputMode="decimal" value={values.amount} onChange={e=>setValues({...values, amount:e.target.value})} placeholder={spendCurrency} />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="cur">Currency</Label>
              <Select id="cur" value={values.currency} onChange={(v)=>setValues({...values, currency:v})} options={[{label:spendCurrency, value:spendCurrency}]} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 items-end">
            <div className="grid gap-1">
              <Label htmlFor="paidby">Paid by</Label>
              <Select id="paidby" value={values.paid_by} onChange={(v)=>setValues({...values, paid_by:v})} options={people.map(p=>({label:p, value:p}))} />
            </div>
            <label className="inline-flex gap-2 items-center mt-6">
              <input type="checkbox" checked={values.included} onChange={e=>setValues({...values, included:e.target.checked})} />
              <span>Include in split</span>
            </label>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <p className="text-xs text-slate-500">Base currency: {baseCurrency} · Spend currency: {spendCurrency}</p>
        </div>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={submit}>Save</Button>
      </DialogFooter>
    </Dialog>
  )
}

export default ExpenseDialog
