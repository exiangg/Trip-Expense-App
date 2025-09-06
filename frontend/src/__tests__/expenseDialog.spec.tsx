import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import ExpenseDialog from '../../components/ExpenseDialog'

describe('ExpenseDialog', () => {
  test('resets fields on open when adding new', () => {
    const onClose = vi.fn()
    const onSave = vi.fn()
    const people = ['Yixiang', 'Tracy']
    const { rerender } = render(
      <ExpenseDialog open={false} title="Add" baseCurrency="SGD" spendCurrency="SGD" people={people} onClose={onClose} onSave={onSave} />
    )
    // Open dialog first time
    rerender(<ExpenseDialog open={true} title="Add" baseCurrency="SGD" spendCurrency="SGD" people={people} onClose={onClose} onSave={onSave} />)
    expect((screen.getByLabelText('Description') as HTMLInputElement).value).toBe('')
    expect((screen.getByLabelText('Amount') as HTMLInputElement).value).toBe('')

    // Type some data then close
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test' } })
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '12' } })
    rerender(<ExpenseDialog open={false} title="Add" baseCurrency="SGD" spendCurrency="SGD" people={people} onClose={onClose} onSave={onSave} />)

    // Re-open should be cleared again
    rerender(<ExpenseDialog open={true} title="Add" baseCurrency="SGD" spendCurrency="SGD" people={people} onClose={onClose} onSave={onSave} />)
    expect((screen.getByLabelText('Description') as HTMLInputElement).value).toBe('')
    expect((screen.getByLabelText('Amount') as HTMLInputElement).value).toBe('')
  })
})
