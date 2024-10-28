import { createFileRoute } from "@tanstack/react-router";
import PageHeader from "@/components/sections/PageHeader";
import InvoiceTable from "@/features/invoices/invoiceTable";
import { useEffect, useState } from "react";
import { IncomeExpenseTrendChart } from "@/features/charts/IncomeExpenseTrendChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BalanceOverTimeBigChart } from "@/features/charts/BalanceOverTimeBigChart";
import ContactTable from "@/features/contacts/contactTable";
import { CreateInvoiceMenuBar } from "@/features/invoices/createInvoiceMenuBar";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { BalanceOverTimeChart } from "@/features/charts/BalanceOverTimeChart";

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
        <div className="h-full w-full p-4">
          <div className="grid grid-cols-2 grid-rows-[auto_1fr_1fr_1fr_1fr_1fr] h-full w-full gap-4">
            <PageHeader
              className="-mx-4 -mt-4 col-span-2"
              title="Dashboard"
              variants={{ position: "static" }}
            />
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

            <Tabs
              defaultValue="invoices"
              key={"invoices" + tabKey} // Re-render Tabs on resize
              className="w-full grid grid-rows-[auto_1fr] gap-2 row-span-3"
            >
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="invoices">Rechnungen</TabsTrigger>
                <TabsTrigger value="contacts">Kontakte</TabsTrigger>
              </TabsList>

              <TabsContent
                value="invoices"
                className="overflow-y-auto border rounded-lg min-h-0"
              >
                <PageHeader
                  title={"Belege"}
                  actionBar={
                    <CreateInvoiceMenuBar
                      triggerClassName={buttonVariants({ size: "xs" })}
                    />
                  }
                  variants={{ size: "md" }}
                />
                <InvoiceTable />
              </TabsContent>

              <TabsContent
                value="contacts"
                className="overflow-y-auto border rounded-lg min-h-0"
              >
                <PageHeader
                  title={"Belege"}
                  actionBar={
                    <Link
                      className={buttonVariants({ size: "xs" })}
                      to="/contacts/create"
                    >
                      <Plus />
                    </Link>
                  }
                  variants={{ size: "md" }}
                />
                <ContactTable />
              </TabsContent>
            </Tabs>

            <BalanceOverTimeBigChart className="col-span-2 row-span-2" />
          </div>
        </div>
      </main>
    );
  },
});
