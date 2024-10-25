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

import contactStore from "@/features/contacts/contactStore"; // Import the contact store
import { getContactName } from "@/features/contacts/contactUtils"; // Import the utility to get the contact name

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
            <TableHead>Kontakt</TableHead>
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
  const [contactNames, setContactNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const invoiceData = await incomingInvoiceStore.entries();
        const contactPromises = invoiceData.map(async ([id, invoice]) => {
          if (invoice.contact) {
            const contact = await contactStore.get(invoice.contact);
            if (contact) {
              return { [invoice.contact]: getContactName(contact) };
            }
          }
          return {};
        });

        const contactNameResults = await Promise.all(contactPromises);
        const mergedContactNames = Object.assign({}, ...contactNameResults);

        setInvoices(invoiceData);
        setContactNames(mergedContactNames);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err as Error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (error) return <div>Error: {error.message}</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <>
      {invoices?.map(([id, invoice], index) => (
        <TableRow
          key={index}
          onClick={() =>
            navigate({ to: "/invoices/$invoiceId", params: { invoiceId: id } })
          }
          className="cursor-pointer hover:bg-secondary transition-colors duration-100 ease-in-out"
          role="button"
          tabIndex={0}
          aria-label={`View details for invoice ${invoice.name}`}
        >
          <TableCell>{id}</TableCell>
          <TableCell>{invoice.name}</TableCell>
          <TableCell>
            {invoice.contact
              ? (contactNames[invoice.contact] ?? "Unknown")
              : "No Contact"}
          </TableCell>
          <TableCell>{invoice.amount.toFixed(2)} €</TableCell>
          <TableCell>{invoice.uploadedDocuments.length}</TableCell>
        </TableRow>
      ))}
    </>
  );
}
