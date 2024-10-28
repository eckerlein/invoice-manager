import { createFileRoute } from "@tanstack/react-router";
import PageHeader from "@/components/sections/PageHeader";
import InvoiceTable from "@/features/invoices/invoiceTable";
import ContactTable from "@/features/contacts/contactTable";
import { DashboardCard } from "@/features/dashboard/DashboardCard";
import { IncomeExpenseTrendChart } from "@/features/charts/IncomeExpenseTrendChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BalanceOverTimeChart } from "@/features/charts/BalanceOverTimeCHart";
import { BalanceOverTimeBigChart } from "@/features/charts/BalanceOverTimeBigChart";

export const Route = createFileRoute("/")({
  component: () => {
    return (
      <main className="relative w-full h-full">
        <PageHeader title="Dashboard" size="lg" />

        <div className="grid grid-cols-2 gap-4 p-4">
          <Tabs
            defaultValue="financial-trends"
            className="w-full aspect-[3/2] grid grid-rows-[auto_1fr] gap-2"
          >
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="financial-trends">Trends</TabsTrigger>
              <TabsTrigger value="balance">Balance</TabsTrigger>
            </TabsList>
            <TabsContent value="financial-trends" className="h-full">
              <IncomeExpenseTrendChart chartHeight={150} className="h-full" />
            </TabsContent>
            <TabsContent value="balance">
              <BalanceOverTimeChart />
            </TabsContent>
          </Tabs>
          {/* <DashboardCard title="Rechnungen" link="/invoices/create">
            <InvoiceTable />
          </DashboardCard> */}

          <DashboardCard
            title="Kontakte"
            link="/contacts/create"
            className="aspect-[3/2]"
          >
            <ContactTable />
          </DashboardCard>
        </div>
        <BalanceOverTimeBigChart />
      </main>
    );
  },
});
