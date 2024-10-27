import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/button";
import { ContactForm, ContactFormRef } from "@/features/contacts/contactForm";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef } from "react";

export const Route = createFileRoute("/contacts/create")({
  component: () => {
    const navigate = useNavigate();
    const formRef = useRef<ContactFormRef>(null);

    return (
      <main>
        <PageHeader
          showBackButton={true}
          title="Kontakt erstellen"
          actionBar={
            <>
              <Button
                variant={"destuctiveOutline"}
                onClick={() => window.history.back()}
              >
                Abbrechen
              </Button>
              <Button
                variant="default"
                onClick={async () => {
                  const success = await formRef.current?.submit();
                  if (success) history.back();
                }}
              >
                Speichern
              </Button>
            </>
          }
        />
        <ContactForm
          className="px-4 pt-4 pb-12"
          ref={formRef}
          showButton={false}
        />
      </main>
    );
  },
});
