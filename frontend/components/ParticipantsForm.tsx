import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import Label from './ui/label'
import { Input } from './ui/input'

export const ParticipantsForm: React.FC<{
  baseCurrency: string
  spendCurrency: string
  fxRate: string
  personA: string
  personB: string
  onChange: (patch: Partial<{ baseCurrency: string; spendCurrency: string; fxRate: string; personA: string; personB: string }>) => void
  onSave: () => void
  dirty: boolean
}> = ({ baseCurrency, spendCurrency, fxRate, personA, personB, onChange, onSave, dirty }) => (
  <Card>
    <CardHeader>
      <CardTitle>Participants & Currencies</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid gap-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="grid gap-1">
            <Label htmlFor="base">Base currency</Label>
            <Input id="base" value={baseCurrency} onChange={e=>onChange({ baseCurrency: e.target.value.toUpperCase() })} />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="spend">Spend currency</Label>
            <Input id="spend" value={spendCurrency} onChange={e=>onChange({ spendCurrency: e.target.value.toUpperCase() })} />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="fx">FX rate (Spend→Base)</Label>
            <Input id="fx" inputMode="decimal" value={fxRate} onChange={e=>onChange({ fxRate: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="grid gap-1">
            <Label htmlFor="p1">Person A</Label>
            <Input id="p1" value={personA} onChange={e=>onChange({ personA: e.target.value })} />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="p2">Person B</Label>
            <Input id="p2" value={personB} onChange={e=>onChange({ personB: e.target.value })} />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={onSave} disabled={!dirty}>Save</Button>
        </div>
      </div>
    </CardContent>
  </Card>
)

export default ParticipantsForm

