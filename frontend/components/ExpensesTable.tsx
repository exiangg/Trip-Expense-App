import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from './ui/table'
import { Button } from './ui/button'
import { Edit, Trash2, Plane } from './icons'
import { formatCurrency } from '../lib/format'

export type Expense = {
  id: number
  trip_id: number
  description: string
  amount: number
  paid_by: string | null
  currency: string
  fx_rate: number
  amount_base: number
  excluded?: number
}

export const ExpensesTable: React.FC<{
  baseCurrency: string
  expenses: Expense[]
  onEdit: (e: Expense) => void
  onDelete: (e: Expense) => void
  onToggleExclude: (e: Expense) => void
}> = ({ baseCurrency, expenses, onEdit, onDelete, onToggleExclude }) => (
  <Card className="rounded-2xl shadow-lg bg-gradient-to-r from-slate-50 to-purple-50 border border-purple-200/40">
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="text-lg">💰</span>
          <span>Expenses</span>
        </span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead className="text-right">FX→Base</TableHead>
            <TableHead>Paid by</TableHead>
            <TableHead>Included</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map(x => {
            const excluded = !!x.excluded
            const baseStr = x.currency !== baseCurrency ? `${formatCurrency(x.amount_base, baseCurrency)}` : ''
            const icon = x.description.match(/flight|air|plane|airline|ticket/i) ? '✈️' : (x.description.match(/hotel|stay|resort|room/i) ? '🏨' : '🧾')
            return (
              <TableRow key={x.id} className={excluded ? 'opacity-60' : ''}>
                <TableCell style={{ textDecoration: excluded ? 'line-through' : 'none' }}>
                  <span className="mr-1">{icon}</span>{x.description}
                </TableCell>
                <TableCell className="text-right tabular">{formatCurrency(x.amount, x.currency)}</TableCell>
                <TableCell>
                  <span className="text-xs rounded px-1.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-200">{x.currency}</span>
                </TableCell>
                <TableCell className="text-right tabular">{baseStr}</TableCell>
                <TableCell>{x.paid_by || ''}</TableCell>
                <TableCell>
                  <button className={`text-xs rounded-full px-3 py-0.5 border ${excluded? 'bg-slate-100 border-slate-300':'bg-green-50 border-green-300'}`} onClick={() => onToggleExclude(x)}>
                    {excluded ? 'Excluded' : 'Included'}
                  </button>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" aria-label="Edit expense" onClick={() => onEdit(x)} className="text-sky-600 hover:text-sky-700"><Edit/></Button>
                  <Button size="sm" variant="ghost" aria-label="Delete expense" onClick={() => onDelete(x)} className="text-red-600 hover:text-red-700"><Trash2/></Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
)

export default ExpensesTable
