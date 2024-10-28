import { createFileRoute } from "@tanstack/react-router";
import PageHeader from "@/components/sections/PageHeader";
import InvoiceTable from "@/features/invoices/invoiceTable";
import ContactTable from "@/features/contacts/contactTable";
import { DashboardCard } from "@/features/dashboard/DashboardCard";
import { FinancialChart } from "@/features/dashboard/FinancialChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/")({
  component: () => {
    return (
      <main className="relative w-full h-full">
        <PageHeader title="Dashboard" size="lg" />

        <div className="grid grid-cols-2 gap-4 p-4">
          <Tabs defaultValue="last-6-months" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="last-6-months">Letzte 6 Monate</TabsTrigger>
              {/* <TabsTrigger value="last-year">Letztes Jahr</TabsTrigger> */}
            </TabsList>
            <TabsContent value="last-6-months">
              <FinancialChart />
            </TabsContent>
          </Tabs>
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
