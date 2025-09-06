export function formatCurrency(value: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value || 0)
  } catch {
    return `${currency} ${Number(value || 0).toFixed(2)}`
  }
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

