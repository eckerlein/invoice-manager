import { createFileRoute } from "@tanstack/react-router";
import PageHeader from "@/components/sections/PageHeader";
import InvoiceTable from "@/features/invoices/invoiceTable";
import { useEffect, useState } from "react";
import { DashboardCard } from "@/features/dashboard/DashboardCard";
import { IncomeExpenseTrendChart } from "@/features/charts/IncomeExpenseTrendChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BalanceOverTimeChart } from "@/features/charts/BalanceOverTimeCHart";
import { BalanceOverTimeBigChart } from "@/features/charts/BalanceOverTimeBigChart";

export const Route = createFileRoute("/")({
  component: () => {
    // State variable to force re-render
    const [tabKey, setTabKey] = useState(0);

    // Effect to listen for window resize and update tabKey
    useEffect(() => {
      const handleResize = () => setTabKey((prevKey) => prevKey + 1);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
      <main className="relative w-full h-[max(100vh,800px)] flex flex-col">
        <PageHeader title="Dashboard" variants={{ position: "static" }} />

        <div className="h-full w-full p-4">
          <div className="grid grid-cols-2 grid-rows-5 h-full w-full gap-4">
            <div className="row-span-3">
              <Tabs
                defaultValue="financial-trends"
                key={tabKey} // Re-render Tabs on resize
                className="w-full h-full grid grid-rows-[auto_1fr] gap-2"
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
        </div>
      </main>
    );
  },
});
