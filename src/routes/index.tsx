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
      <main className="relative w-full min-h-screen overflow-y-auto flex flex-col">
        <PageHeader title="Dashboard" variants={{ position: "static" }} />

        <div className="h-full w-full p-4">
          <div className="grid grid-cols-2 grid-rows-5 h-full w-full gap-4">
            <div className="row-span-3">
              <Tabs
                defaultValue="financial-trends"
                className="w-full h-full overflow-clip grid grid-rows-[auto_1fr] gap-2 "
              >
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="financial-trends">Trends</TabsTrigger>
                  <TabsTrigger value="balance">Balance</TabsTrigger>
                </TabsList>
                <TabsContent value="financial-trends" className="h-full">
                  <IncomeExpenseTrendChart className="h-full" />
                </TabsContent>
                <TabsContent value="balance">
                  <BalanceOverTimeChart className="h-full" />
                </TabsContent>
              </Tabs>
            </div>

            <DashboardCard
              title="Rechnungen"
              link="/invoices/create"
              className="row-span-3"
            >
              <InvoiceTable />
            </DashboardCard>
            <BalanceOverTimeBigChart className="col-span-2 row-span-2" />
          </div>

          {/* <DashboardCard title="Kontakte" link="/contacts/create">
            <ContactTable />
          </DashboardCard> */}
        </div>
      </main>
    );
  },
});
