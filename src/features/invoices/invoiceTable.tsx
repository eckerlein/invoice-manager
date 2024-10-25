import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import incomingInvoiceStore from "@/features/invoices/incomingInvoiceStore";
import { IncomingInvoice } from "@/features/invoices/invoiceSchema";
import contactStore from "@/features/contacts/contactStore";
import { getContactName } from "@/features/contacts/contactUtils";

type InvoiceTableProps = {
  onRowClick?: (invoiceId: string) => void;
  compact?: boolean; // Option for a compact version of the table
};

export default function InvoiceTable({
  onRowClick,
  compact = false,
}: InvoiceTableProps) {
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
        const contactPromises = invoiceData.map(async ([, invoice]) => {
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
        {invoices?.map(([id, invoice], index) => (
          <TableRow
            key={index}
            onClick={() => {
              if (onRowClick) {
                onRowClick(id);
              } else {
                navigate({
                  to: `/invoices/$invoiceId`,
                  params: { invoiceId: id },
                });
              }
            }}
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
      </TableBody>
    </Table>
  );
}
