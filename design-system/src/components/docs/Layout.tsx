import { type ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Toaster } from 'sonner'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen pl-[280px] max-[900px]:pl-0">
      <Sidebar />
      <main className="relative px-12 py-14 max-[760px]:px-5 max-[760px]:py-10">
        {children}
      </main>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--surface-2)',
            border: '1px solid var(--line-2)',
            color: 'var(--text)',
          },
        }}
      />
    </div>
  )
}
