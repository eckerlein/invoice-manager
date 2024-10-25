import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { IncomingInvoice } from "@/features/invoices/invoiceSchema";
import ContactStore from "@/features/contacts/contactStore"; // Update to import ContactStore singleton
import { getContactName } from "@/features/contacts/contactUtils";
import IncomingInvoiceStore from "@/features/invoices/incomingInvoiceStore";

type InvoiceTableProps = {
  onRowClick?: (invoiceId: string) => void;
  compact?: boolean;
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
  const [visibleColumns, setVisibleColumns] = useState({
    showContact: false,
    showBelegnummer: false,
    showDokumentanzahl: false,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        const invoiceStore = await IncomingInvoiceStore.getInstance();
        const invoiceData = await invoiceStore.entries();

        // Get the singleton instance of ContactStore and retrieve contact data
        const contactStore = await ContactStore.getInstance();
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

  // Detect container width and adjust visible columns
  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setVisibleColumns({
          showContact: width >= 400, // Show contact if container is at least 400px wide
          showBelegnummer: width >= 500, // Show Belegnummer if container is at least 500px wide
          showDokumentanzahl: width >= 600, // Show Dokumentanzahl if container is at least 600px wide
        });
      }
    }

    // Run resize logic after the data is fetched
    if (!loading) {
      handleResize();
    }

    // Add a resize listener
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [loading, invoices]);

  if (error) return <div>Error: {error.message}</div>;
  if (loading) return <div></div>;

  return (
    <div ref={containerRef} className="w-full">
      <Table className="table-fixed w-full min-w-0">
        <TableHeader>
          <TableRow>
            <TableHead className="truncate">Name</TableHead>
            {visibleColumns.showContact && (
              <TableHead className="truncate">Kontakt</TableHead>
            )}
            <TableHead className="truncate">Summe</TableHead>
            {visibleColumns.showBelegnummer && (
              <TableHead className="truncate">Belegnummer</TableHead>
            )}
            {visibleColumns.showDokumentanzahl && (
              <TableHead className="truncate">Dokumentanzahl</TableHead>
            )}
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
              <TableCell className="truncate">{invoice.name}</TableCell>
              {visibleColumns.showContact && (
                <TableCell className="truncate">
                  {invoice.contact
                    ? (contactNames[invoice.contact] ?? "Unknown")
                    : "No Contact"}
                </TableCell>
              )}
              <TableCell className="truncate">
                {invoice.amount.toFixed(2)} €
              </TableCell>
              {visibleColumns.showBelegnummer && (
                <TableCell className="truncate">{id}</TableCell>
              )}
              {visibleColumns.showDokumentanzahl && (
                <TableCell className="truncate">
                  {invoice.uploadedDocuments.length}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
