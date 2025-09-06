import React from 'react'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from './ui/dialog'
import { Button } from './ui/button'

export const ConfirmDialog: React.FC<{
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onCancel: () => void
  onConfirm: () => void
}> = ({ open, title, message, confirmLabel='Confirm', onCancel, onConfirm }) => (
  <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
    </DialogHeader>
    <DialogContent>
      <p className="text-sm text-slate-700">{message}</p>
    </DialogContent>
    <DialogFooter>
      <Button variant="outline" onClick={onCancel}>Cancel</Button>
      <Button variant="destructive" onClick={onConfirm}>{confirmLabel}</Button>
    </DialogFooter>
  </Dialog>
)

export default ConfirmDialog

