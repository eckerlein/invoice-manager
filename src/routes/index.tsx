import { createFileRoute } from "@tanstack/react-router";
import PageHeader from "@/components/sections/PageHeader";
import InvoiceTable from "@/features/invoices/invoiceTable";
import ContactTable from "@/features/contacts/contactTable";
import { DashboardCard } from "@/features/dashboard/DashboardCard";
import { FinancialChart } from "@/features/dashboard/FinancialChart";

export const Route = createFileRoute("/")({
  component: () => {
    return (
      <main className="relative w-full h-full">
        <PageHeader title="Dashboard" size="lg" />

        <div className="grid grid-cols-2 gap-4 p-4">
          <FinancialChart />
          {/* <DashboardCard title="Rechnungen" link="/invoices/create">
            <InvoiceTable />
          </DashboardCard> */}

          <DashboardCard title="Kontakte" link="/contacts/create">
            <ContactTable />
          </DashboardCard>
        </div>
      </main>
    );
  },
});
