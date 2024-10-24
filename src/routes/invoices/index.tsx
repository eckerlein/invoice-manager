import { Link, createFileRoute } from "@tanstack/react-router";

import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import PageHeader from "@/components/sections/PageHeader";

export const Route = createFileRoute("/invoices/")({
  component: () => {
    return (
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Belegnummer</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Summe</TableHead>
              <TableHead>Art</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{/* <ContactRows /> */}</TableBody>
        </Table>
      </main>
    );
  },
});
