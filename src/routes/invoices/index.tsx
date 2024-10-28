import { Link, createFileRoute } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import PageHeader from "@/components/sections/PageHeader";
import { Plus } from "lucide-react";
import InvoiceTable from "@/features/invoices/invoiceTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/invoices/")({
  component: () => (
    <main className="relative w-full h-full">
      <PageHeader
        title={"Belege"}
        actionBar={
          <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({ ring: "none" })}>
              <Plus />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link to="/invoices/createIncoming">Einkaufsrechnung</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/invoices/createOutgoing">Verkaufsrechnung</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />
      <InvoiceTable />
    </main>
  ),
});
