import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/button";
import { ContactForm, ContactFormRef } from "@/features/contacts/contactForm";
import { Contact } from "@/features/contacts/contactSchema";
import ContactStore from "@/features/contacts/contactStore"; // Import singleton pattern store
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
      async function fetchContactData() {
        try {
          const contactStore = await ContactStore.getInstance();
          const contactData = await contactStore.get(contactId);
          setData(contactData);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching contact data:", err);
          setError(err as Error);
          setLoading(false);
        }
      }

      fetchContactData();
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
          showBackButton={true}
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
                onClick={async () => {
                  const contactStore = await ContactStore.getInstance();
                  await contactStore.delete(contactId);
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
