import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/invoices/createOutgoing')({
  component: () => <div>Hello /invoices/createOutgoing!</div>,
})
