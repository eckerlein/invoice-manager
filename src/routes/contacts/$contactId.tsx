import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/button";
import { ContactForm, ContactFormRef } from "@/features/contacts/contactForm";
import { Contact } from "@/features/contacts/contactSchema";
import contactStore from "@/features/contacts/contactStore";
import { getContactName } from "@/features/contacts/contactUtils";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/contacts/$contactId")({
  component: () => {
    const { contactId } = useParams({ from: "/contacts/$contactId" });

    const [data, setData] = useState<Contact>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const navigate = useNavigate();
    const formRef = useRef<ContactFormRef>(null);

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
    }, [contactId]);

    if (loading) {
      return <div></div>;
    }

    if (error) {
      return <div>{error.message}</div>;
    }

    if (!data) {
      return <div>Keine Daten gefunden</div>;
    }

    return (
      <main>
        <PageHeader
          title={
            <>
              <span className="font-bold">{getContactName(data)}</span>{" "}
              anpassen:
            </>
          }
          actionBar={
            <>
              <Button
                variant="destuctiveOutline"
                onClick={() => {
                  contactStore.delete(contactId);
                  navigate({ to: "/contacts" });
                }}
              >
                Löschen
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  formRef.current?.submit();
                }}
              >
                Speichern
              </Button>
            </>
          }
        />
        <ContactForm
          className="px-4 pt-4 pb-12"
          defaultValues={data}
          ref={formRef}
          showButton={false}
        />
      </main>
    );
  },
});
