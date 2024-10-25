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
import contactStore from "@/features/contacts/contactStore";
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
    contactStore
      .entries()
      .then((data) => {
        setContacts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching contacts:", err);
        setError(err);
        setLoading(false);
      });
  }, []);

  // Detect container width and adjust visible columns
  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setVisibleColumns({
          showCustomerNumber: width >= 400, // Show customer number if container is at least 400px wide
          showCity: width >= 500, // Show city if container is at least 600px wide
        });
      }
    }

    // Initial check
    handleResize();

    // Add a resize listener
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
