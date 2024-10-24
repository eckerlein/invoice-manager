import { Button } from "@/components/ui/button";
import { ContactForm } from "@/features/contacts/contactForm";
import { Contact } from "@/features/contacts/contactSchema";
import contactStore from "@/features/contacts/contactStore";
import { getContactName } from "@/features/contacts/contactUtils";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/contacts/$contactId")({
  component: () => {
    const { contactId } = useParams({ from: "/contacts/$contactId" });

    const [data, setData] = useState<Contact>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
      contactStore
        .get(contactId)
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError(err);
          setLoading(false);
        });
    });

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>{error.message}</div>;
    }

    return (
      <>
        <header className="flex justify-between items center">
          <h1 className="text-xl">
            <span className="font-bold">{getContactName(data)}</span> anpassen:
          </h1>
          <Button
            variant="destuctiveOutline"
            onClick={() => {
              contactStore.delete(contactId);
              navigate({ to: "/contacts" });
            }}
          >
            Löschen
          </Button>
        </header>
        <ContactForm defaultValues={data} />
      </>
    );
  },
});
