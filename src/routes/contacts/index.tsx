import { Link, createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/features/contacts/contactSchema";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Suspense } from "react";
import contactStore from "@/features/contacts/contactStore";
import { usePromise } from "@/lib/utils/usePromise";

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
        <TableCaption>Kontakte</TableCaption>
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
  const contacts = usePromise("contact", contactStore.store.entries<Contact>());
  console.log("contacts", contacts);
  return (
    <>
      {contacts.map(([id, contact], index) => (
        <TableRow key={index}>
          <TableCell>
            {contact.baseInfo?.type === "person"
              ? `${contact.baseInfo.firstName} ${contact.baseInfo.lastName}`
              : contact.baseInfo?.companyName}
          </TableCell>
          <TableCell>{id}</TableCell>
          <TableCell>{contact.address?.[0]?.city || "Unknown"}</TableCell>
        </TableRow>
      ))}
    </>
  );
}
