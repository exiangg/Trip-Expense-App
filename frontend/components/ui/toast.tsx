import React, { createContext, useContext, useState } from 'react'

type ToastMsg = { id: number; title?: string; description?: string }

const ToastCtx = createContext<{ push: (t: Omit<ToastMsg, 'id'>) => void } | null>(null)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ToastMsg[]>([])
  function push(t: Omit<ToastMsg, 'id'>) {
    const id = Date.now() + Math.random()
    setItems(prev => [...prev, { id, ...t }])
    setTimeout(() => setItems(prev => prev.filter(i => i.id !== id)), 2500)
  }
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="fixed right-4 bottom-4 space-y-2 z-[60]">
        {items.map(i => (
          <div key={i.id} className="card px-4 py-3 min-w-[240px]">
            {i.title && <div className="font-medium mb-1">{i.title}</div>}
            {i.description && <div className="text-sm text-slate-700">{i.description}</div>}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast(){
  const ctx = useContext(ToastCtx)
  if(!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

