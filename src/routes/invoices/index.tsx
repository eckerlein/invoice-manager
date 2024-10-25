import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import PageHeader from "@/components/sections/PageHeader";
import incomingInvoiceStore from "@/features/invoices/incomingInvoiceStore";
import { IncomingInvoice } from "@/features/invoices/invoiceSchema";

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Belegnummer</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Summe</TableHead>
            <TableHead>Dokumentanzahl</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <InvoiceRows />
        </TableBody>
      </Table>
    </main>
  ),
});

// Component to display invoice rows
function InvoiceRows() {
  const [invoices, setInvoices] =
    useState<[string, Omit<IncomingInvoice, "id">][]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    incomingInvoiceStore
      .entries()
      .then((data) => {
        setInvoices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      });
  }, []);

  if (error) return <div>Error: {error.message}</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <>
      {invoices?.map(([id, invoice], index) => (
        <TableRow
          key={index}
          // onClick={() =>
          //   navigate({ to: "/invoices/$invoiceId", params: { invoiceId: id } })
          // }
          className="cursor-pointer hover:bg-secondary transition-colors duration-100 ease-in-out"
          role="button"
          tabIndex={0}
          aria-label={`View details for invoice ${invoice.name}`}
        >
          <TableCell>{id}</TableCell>
          <TableCell>{invoice.name}</TableCell>
          <TableCell>{invoice.amount.toFixed(2)} €</TableCell>
          <TableCell>{invoice.uploadedDocuments.length}</TableCell>
        </TableRow>
      ))}
    </>
  );
}
