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
import ContactStore from "@/features/contacts/contactStore";
import { getContactName } from "@/features/contacts/contactUtils";
import IncomingInvoiceStore from "@/features/invoices/incoming/incomingInvoiceStore";
import OutgoingInvoiceStore from "@/features/invoices/outgoing/outgoingInvoiceStore";
import { TrendingUp, TrendingDown } from "lucide-react";

type InvoiceTableProps = {
  onRowClick?: (invoiceId: string) => void;
  compact?: boolean;
};

type Invoice = {
  id: string;
  type: "incoming" | "outgoing";
  name: string;
  contact: string | undefined;
  documentDate: Date;
  amount: number;
  uploadedDocumentsCount: number;
};

export default function InvoiceTable({
  onRowClick,
  compact = false,
}: InvoiceTableProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [contactNames, setContactNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [visibleColumns, setVisibleColumns] = useState({
    showContact: false,
    showBelegnummer: false,
    showDokumentanzahl: false,
    showType: true,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [incomingStore, outgoingStore] = await Promise.all([
          IncomingInvoiceStore.getInstance(),
          OutgoingInvoiceStore.getInstance(),
        ]);

        const incomingInvoicesData = await incomingStore.entries();
        const outgoingInvoicesData = await outgoingStore.entries();

        const allInvoices: Invoice[] = [
          ...incomingInvoicesData.map(([id, invoice]) => ({
            id,
            type: "incoming" as const,
            name: invoice.name,
            contact: invoice.contact,
            documentDate: invoice.documentDate,
            amount: invoice.amount,
            uploadedDocumentsCount: invoice.uploadedDocuments?.length || 0,
          })),
          ...outgoingInvoicesData.map(([id, invoice]) => ({
            id,
            type: "outgoing" as const,
            name: invoice.name,
            contact: invoice.contact,
            documentDate: invoice.documentDate,
            amount: invoice.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            ),
            uploadedDocumentsCount: invoice.uploadedDocuments?.length || 0,
          })),
        ];

        const sortedInvoices = allInvoices.sort(
          (a, b) => b.documentDate.getTime() - a.documentDate.getTime()
        );

        const contactStore = await ContactStore.getInstance();
        const contactPromises = sortedInvoices.map(async (invoice) => {
          if (invoice.contact) {
            const contact = await contactStore.get(invoice.contact);
            if (contact) return { [invoice.contact]: getContactName(contact) };
          }
          return {};
        });

        const contactNameResults = await Promise.all(contactPromises);
        const mergedContactNames = Object.assign({}, ...contactNameResults);

        setInvoices(sortedInvoices);
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

  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setVisibleColumns({
          showContact: width >= 400,
          showBelegnummer: width >= 500,
          showDokumentanzahl: width >= 600,
          showType: true,
        });
      }
    }

    if (!loading) handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [loading, invoices]);

  if (error) return <div>Error: {error.message}</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div ref={containerRef} className="w-full">
      <Table className="table-fixed w-full min-w-0">
        <TableHeader>
          <TableRow>
            <TableHead className="truncate">Name</TableHead>
            {visibleColumns.showType && (
              <TableHead className="truncate">Typ</TableHead>
            )}
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
          {invoices.map((invoice, index) => (
            <TableRow
              key={index}
              onClick={() => {
                if (onRowClick) {
                  onRowClick(invoice.id);
                } else {
                  if (invoice.type === "outgoing") {
                    navigate({
                      to: `/invoices/$outgoingId/edit`,
                      params: { outgoingId: invoice.id },
                    });
                  } else if (invoice.type === "incoming") {
                    navigate({
                      to: `/invoices/$incomingInvoiceId`,
                      params: { incomingInvoiceId: invoice.id },
                    });
                  }
                }
              }}
              className="cursor-pointer hover:bg-secondary transition-colors duration-100 ease-in-out"
              role="button"
              tabIndex={0}
              aria-label={`View details for invoice ${invoice.name}`}
            >
              <TableCell className="truncate">{invoice.name}</TableCell>
              {visibleColumns.showType && (
                <TableCell className="truncate">
                  {invoice.type === "outgoing" ? (
                    <span className="flex items-center text-green-500">
                      <TrendingUp className="mr-1" /> Verkaufsrechnung
                    </span>
                  ) : (
                    <span className="flex items-center text-red-500">
                      <TrendingDown className="mr-1" /> Einkaufsrechnung
                    </span>
                  )}
                </TableCell>
              )}
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
                <TableCell className="truncate">{invoice.id}</TableCell>
              )}
              {visibleColumns.showDokumentanzahl && (
                <TableCell className="truncate">
                  {invoice.uploadedDocumentsCount}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
