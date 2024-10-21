import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/contacts/')({
  component: () => <div>Hello /contacts/!</div>,
})
