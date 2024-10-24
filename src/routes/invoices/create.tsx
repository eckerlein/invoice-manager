import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/invoices/create')({
  component: () => <div>Hello /invoices/create!</div>,
})
