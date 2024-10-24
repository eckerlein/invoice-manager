import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Contact } from "@/features/contacts/contactSchema";

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
import contactStore from "@/features/contacts/contactStore";
import {
  getContactCities,
  getContactName,
} from "@/features/contacts/contactUtils";
import { Plus } from "lucide-react";
import PageHeader from "@/components/sections/PageHeader";

export const Route = createFileRoute("/contacts/")({
  component: () => (
    <main className="relative w-full h-full">
      <PageHeader
        title={"Kontakte"}
        actionBar={
          <Link
            to="/contacts/create"
            className={buttonVariants({ variant: "default" })}
          >
            <Plus />
          </Link>
        }
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Kundennummer</TableHead>
            <TableHead>Stadt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <ContactRows />
        </TableBody>
      </Table>
    </main>
  ),
});

function ContactRows() {
  const [data, setData] = useState<[string, Omit<Contact, "id">][]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    contactStore
      .entries()
      .then((data) => {
        setData(data);
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
      {data?.map(([id, contact], index) => (
        <TableRow
          key={index}
          onClick={() =>
            navigate({ to: "/contacts/$contactId", params: { contactId: id } })
          }
          className="cursor-pointer hover:bg-secondary transition-colors duration-100 ease-in-out"
          role="button" // Make the row accessible as a button
          tabIndex={0} // Allow the row to be focusable via keyboard
          aria-label={`View details for ${contact.baseInfo?.type === "person" ? contact.baseInfo.firstName : contact.baseInfo?.companyName}`}
        >
          <TableCell>{getContactName(contact)}</TableCell>
          <TableCell>{id}</TableCell>
          <TableCell>{getContactCities(contact)}</TableCell>
        </TableRow>
      ))}
    </>
  );
}
