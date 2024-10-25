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
import { useEffect, useState } from "react";
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

  if (error) return <div>Error: {error.message}</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Kundennummer</TableHead>
          <TableHead>Stadt</TableHead>
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
            <TableCell>{getContactName(contact)}</TableCell>
            <TableCell>{id}</TableCell>
            <TableCell>{getContactCities(contact)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
