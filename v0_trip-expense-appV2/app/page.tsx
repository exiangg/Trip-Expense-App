"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Plus, Trash2, MapPin, Users, Calculator, Plane } from "lucide-react"

interface Trip {
  id: string
  name: string
  totalAmount: number
  currency: string
  participants: string[]
  expenses: Expense[]
}

interface Expense {
  id: string
  description: string
  amount: number
  currency: string
  paidBy: string
  category: string
}

const mockTrips: Trip[] = [
  {
    id: "1",
    name: "Chengdu Adventure",
    totalAmount: 10000,
    currency: "RMB",
    participants: ["Yixiang", "Tracy"],
    expenses: [
      { id: "1", description: "Air ticket", amount: 2000, currency: "SGD", paidBy: "Tracy", category: "Transport" },
      { id: "2", description: "Hotel", amount: 3000, currency: "RMB", paidBy: "Yixiang", category: "Accommodation" },
      { id: "3", description: "Food", amount: 1500, currency: "RMB", paidBy: "Tracy", category: "Food" },
    ],
  },
  {
    id: "2",
    name: "Mexico Getaway",
    totalAmount: 8500,
    currency: "RMB",
    participants: ["Yixiang", "Tracy"],
    expenses: [
      { id: "4", description: "Flight", amount: 4000, currency: "RMB", paidBy: "Yixiang", category: "Transport" },
      { id: "5", description: "Resort", amount: 3500, currency: "RMB", paidBy: "Tracy", category: "Accommodation" },
      { id: "6", description: "Activities", amount: 1000, currency: "RMB", paidBy: "Yixiang", category: "Activities" },
    ],
  },
]

export default function TripExpenseApp() {
  const [trips] = useState<Trip[]>(mockTrips)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString()}`
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "transport":
        return <Plane className="h-4 w-4" />
      case "accommodation":
        return <MapPin className="h-4 w-4" />
      case "food":
        return <span className="text-sm">🍽️</span>
      case "activities":
        return <span className="text-sm">🎯</span>
      default:
        return <Calculator className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "transport":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "accommodation":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "food":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "activities":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-rose-100 text-rose-800 border-rose-200"
    }
  }

  if (selectedTrip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTrip(null)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Trips
            </Button>
          </div>

          <div className="space-y-6">
            {/* Trip Header */}
            <Card className="border-primary/20 bg-gradient-to-r from-white to-blue-50 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                      <MapPin className="h-6 w-6" />
                      {selectedTrip.name}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {selectedTrip.participants.join(", ")}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Total Spent</div>
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(selectedTrip.totalAmount, selectedTrip.currency)}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Settlement Summary */}
            <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-secondary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-accent" />
                  <span className="text-foreground">Settlement Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Outstanding</div>
                    <div className="text-lg font-semibold">RMB 5,000.00</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">FX Rate</div>
                    <div className="text-lg font-semibold">1 SGD = 5.25 RMB</div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                    <span className="font-medium text-amber-800">Yixiang owes Tracy</span>
                    <span className="font-bold text-amber-700">RMB 2,500.00</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                    <span className="font-medium text-emerald-800">Tracy owes Yixiang</span>
                    <span className="font-bold text-emerald-700">RMB 1,200.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expenses List */}
            <Card className="bg-gradient-to-r from-slate-50 to-purple-50 border-accent/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">💰</span>
                    <span className="text-foreground">Expenses</span>
                  </span>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-md">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Expense
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedTrip.expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-sm hover:shadow-md border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(expense.category)}
                          <div>
                            <div className="font-medium">{expense.description}</div>
                            <div className="text-sm text-muted-foreground">Paid by {expense.paidBy}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={getCategoryColor(expense.category)}>
                          {expense.category}
                        </Badge>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(expense.amount, expense.currency)}</div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary flex items-center justify-center gap-3">
            <span className="text-3xl">✈️</span>
            Trip Expense Tracker
          </h1>
          <p className="text-lg text-secondary-foreground font-medium">Manage your travel expenses together 🌟</p>
        </div>

        {/* Trip List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Your Trips</h2>
            <Button className="bg-primary hover:bg-primary/90 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              New Trip
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {trips.map((trip) => (
              <Card
                key={trip.id}
                className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-gradient-to-br from-white to-slate-50 border border-border hover:border-primary/30"
                onClick={() => setSelectedTrip(trip)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-primary flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {trip.name}
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-secondary-foreground font-medium flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {trip.participants.join(", ")}
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-secondary/20 text-secondary-foreground border-secondary/30 font-semibold"
                    >
                      {trip.expenses.length} expenses
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-muted-foreground">Total Spent</span>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(trip.totalAmount, trip.currency)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <Card className="bg-gradient-to-r from-white to-slate-50 border-border shadow-lg">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                <div className="text-3xl font-bold text-primary">{trips.length}</div>
                <div className="text-sm font-semibold text-primary/80">Total Trips</div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="text-3xl font-bold text-emerald-700">
                  {trips.reduce((sum, trip) => sum + trip.expenses.length, 0)}
                </div>
                <div className="text-sm font-semibold text-emerald-600">Total Expenses</div>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <div className="text-3xl font-bold text-amber-700">
                  RMB {trips.reduce((sum, trip) => sum + trip.totalAmount, 0).toLocaleString()}
                </div>
                <div className="text-sm font-semibold text-amber-600">Total Spent</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
