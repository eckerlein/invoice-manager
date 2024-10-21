import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/invoices/')({
  component: () => <div>
		<h1>Invoices</h1>
		<p>Here are your invoices</p>
	</div>,
})
