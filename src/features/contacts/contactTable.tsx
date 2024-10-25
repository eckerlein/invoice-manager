import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getContactCities,
  getContactName,
} from "@/features/contacts/contactUtils";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ContactStore from "@/features/contacts/contactStore";
import { Contact } from "@/features/contacts/contactSchema";

type ContactTableProps = {
  onRowClick?: (contactId: string) => void;
  compact?: boolean; // This will allow for a smaller version later
};

export default function ContactTable({
  onRowClick,
  compact = false,
}: ContactTableProps) {
  const [contacts, setContacts] = useState<[string, Omit<Contact, "id">][]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [visibleColumns, setVisibleColumns] = useState({
    showCustomerNumber: false,
    showCity: false,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchContacts() {
      try {
        const store = await ContactStore.getInstance();
        const data = await store.entries();
        setContacts(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching contacts:", err);
        setError(err as Error);
        setLoading(false);
      }
    }

    fetchContacts();
  }, []);

  // Detect container width and adjust visible columns
  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setVisibleColumns({
          showCustomerNumber: width >= 400,
          showCity: width >= 600,
        });
      }
    }

    // Trigger the resize logic initially and after data is fetched
    if (!loading) {
      handleResize(); // Trigger after data fetch
    }

    // Add the resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [loading, contacts]); // Add 'contacts' and 'loading' as dependencies

  if (error) return <div>Error: {error.message}</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div ref={containerRef} className="w-full">
      <Table className="table-fixed w-full min-w-0">
        <TableHeader>
          <TableRow>
            <TableHead className="truncate">Name</TableHead>
            {visibleColumns.showCustomerNumber && (
              <TableHead className="truncate">Kundennummer</TableHead>
            )}
            {visibleColumns.showCity && (
              <TableHead className="truncate">Stadt</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts?.map(([id, contact], index) => (
            <TableRow
              key={index}
              onClick={() => {
                if (onRowClick) {
                  onRowClick(id);
                } else {
                  navigate({
                    to: `/contacts/$contactId`,
                    params: { contactId: id },
                  });
                }
              }}
              className="cursor-pointer hover:bg-secondary transition-colors duration-100 ease-in-out"
              role="button"
              tabIndex={0}
              aria-label={`View details for ${
                contact.baseInfo?.type === "person"
                  ? contact.baseInfo.firstName
                  : contact.baseInfo?.companyName
              }`}
            >
              <TableCell className="truncate">
                {getContactName(contact)}
              </TableCell>
              {visibleColumns.showCustomerNumber && (
                <TableCell className="truncate">{id}</TableCell>
              )}
              {visibleColumns.showCity && (
                <TableCell className="truncate">
                  {getContactCities(contact)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
