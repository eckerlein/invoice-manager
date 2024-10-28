import { createFileRoute } from "@tanstack/react-router";
import PageHeader from "@/components/sections/PageHeader";
import InvoiceTable from "@/features/invoices/invoiceTable";
import { CreateInvoiceMenuBar } from "@/features/invoices/createInvoiceMenuBar";

export const Route = createFileRoute("/invoices/")({
  component: () => (
    <main className="relative w-full h-full">
      <PageHeader title={"Belege"} actionBar={<CreateInvoiceMenuBar />} />
      <InvoiceTable />
    </main>
  ),
});
