import { render, screen } from '@testing-library/react'
import TripGrid from '../../components/TripGrid'

const trips = [
  { id: 1, name: 'Hangzhou', base_currency: 'SGD', total_base: 0 },
  { id: 2, name: 'Jeju', base_currency: 'SGD', total_base: 910 },
] as any

describe('TripGrid', () => {
  test('renders trip cards', () => {
    render(<TripGrid trips={trips} onSelect={()=>{}} onDelete={()=>{}} />)
    expect(screen.getByText('Hangzhou')).toBeInTheDocument()
    expect(screen.getByText('Jeju')).toBeInTheDocument()
  })
})

