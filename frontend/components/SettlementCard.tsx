import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from './ui/table'
import { formatCurrency } from '../lib/format'

export const SettlementCard: React.FC<{
  baseCurrency: string
  personA: string
  personB: string
  byPerson: Record<string, number>
  perShare: number
  settlement: { from: string | null; to: string | null; amount: number }
}> = ({ baseCurrency, personA, personB, byPerson, perShare, settlement }) => {
  const rows = [personA, personB].map(p => ({
    person: p,
    paid: byPerson[p] || 0,
    owes: perShare,
    net: (byPerson[p] || 0) - perShare,
  }))
  const sentence = settlement.amount > 0 && settlement.from && settlement.to
    ? `${settlement.from} pays ${settlement.to} ${formatCurrency(settlement.amount, baseCurrency)}`
    : 'Even split — no transfer'
  return (
    <Card className="rounded-2xl shadow-lg bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-lg">💸</span>
          <span className="text-slate-800">Settlement Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Person</TableHead>
              <TableHead className="text-right">Paid (base)</TableHead>
              <TableHead className="text-right">Owes</TableHead>
              <TableHead className="text-right">Net</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(r => (
              <TableRow key={r.person}>
                <TableCell>{r.person}</TableCell>
                <TableCell className="text-right tabular">{formatCurrency(r.paid, baseCurrency)}</TableCell>
                <TableCell className="text-right tabular">{formatCurrency(r.owes, baseCurrency)}</TableCell>
                <TableCell className={"text-right tabular "+(r.net>=0? 'text-green-700':'text-red-700')}>{formatCurrency(r.net, baseCurrency)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 grid gap-3">
          <div className="p-3 rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-900 font-medium">
            👉 {sentence}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SettlementCard
