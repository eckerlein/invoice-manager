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
import { Suspense, useEffect, useState } from "react";
import contactStore from "@/features/contacts/contactStore";

export const Route = createFileRoute("/contacts/")({
  component: () => (
    <div>
      <Link
        to="/contacts/create"
        className={buttonVariants({ variant: "default" })}
      >
        Erstelle einen neuen Kontakt
      </Link>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Kundennummer</TableHead>
            <TableHead>stadt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Suspense fallback={<div>Loading...</div>}>
            <ContactRows />
          </Suspense>
        </TableBody>
      </Table>
    </div>
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
          className="cursor-pointer hover:bg-foreground hover:text-background transition-colors duration-100 ease-in-out"
          role="button" // Make the row accessible as a button
          tabIndex={0} // Allow the row to be focusable via keyboard
          aria-label={`View details for ${contact.baseInfo?.type === "person" ? contact.baseInfo.firstName : contact.baseInfo?.companyName}`}
        >
          <TableCell>
            {contact.baseInfo?.type === "person"
              ? `${contact.baseInfo.firstName} ${contact.baseInfo.lastName}`
              : contact.baseInfo?.companyName}
          </TableCell>
          <TableCell>{id}</TableCell>
          <TableCell>
            {contact.address?.reduce(
              (acc, address) => `${acc}, ${address.city}`,
              ""
            )}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
