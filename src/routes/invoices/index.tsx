import { Link, createFileRoute } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import PageHeader from "@/components/sections/PageHeader";
import { Plus } from "lucide-react";
import InvoiceTable from "@/features/invoices/invoiceTable";

export const Route = createFileRoute("/invoices/")({
  component: () => (
    <main className="relative w-full h-full">
      <PageHeader
        title={"Belege"}
        actionBar={
          <Link
            to="/invoices/create"
            className={buttonVariants({ variant: "default" })}
          >
            <Plus />
          </Link>
        }
      />
      <InvoiceTable />
    </main>
  ),
});
