import React from 'react'
import { Card, CardContent } from './ui/card'
import { Wallet, Users, Calculator } from './icons'
import { formatCurrency } from '../lib/format'

export const SummaryCards: React.FC<{
  baseCurrency: string
  total: number
  outstanding: number
  fxRate?: number
  showFx?: boolean
  participants: string[]
}> = ({ baseCurrency, total, outstanding, fxRate, showFx, participants }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <Card className="p-4 rounded-2xl shadow-lg bg-gradient-to-br from-white to-slate-50 border border-slate-200/60">
      <CardContent className="flex items-center gap-3 p-0">
        <Wallet className="text-sky-600" />
        <div>
          <div className="text-sm font-semibold text-slate-600">Total Spent</div>
          <div className="tabular text-2xl font-bold text-slate-900">{formatCurrency(total, baseCurrency)}</div>
        </div>
      </CardContent>
    </Card>
    <Card className="p-4 rounded-2xl shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/70">
      <CardContent className="flex items-center gap-3 p-0">
        <Calculator className="text-emerald-700" />
        <div>
          <div className="text-sm font-semibold text-emerald-800">Outstanding</div>
          <div className="tabular text-2xl font-bold text-emerald-900">{formatCurrency(Math.max(outstanding, 0), baseCurrency)}</div>
        </div>
      </CardContent>
    </Card>
    <Card className="p-4 rounded-2xl shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/70">
      <CardContent className="p-0">
        <div className="text-sm font-semibold text-amber-800">Participants</div>
        <div className="font-medium text-amber-900">{participants.join(' · ')}</div>
        {showFx && (
          <div className="mt-2 text-xs text-amber-700">
            FX Rate: {`1 ${baseCurrency} = ${fxRate ? (1/Number(fxRate)).toFixed(4) : '—'} spend`}
          </div>
        )}
      </CardContent>
    </Card>
  </div>
)

export default SummaryCards
