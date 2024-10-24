import PageHeader from "@/components/sections/PageHeader";
import { Button, buttonVariants } from "@/components/ui/button";
import { ContactForm, ContactFormRef } from "@/features/contacts/contactForm";
import { Link } from "@tanstack/react-router";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useRef } from "react";

export const Route = createFileRoute("/contacts/create")({
  component: () => {
    const navigate = useNavigate();
    const formRef = useRef<ContactFormRef>(null);

    return (
      <main>
        <PageHeader
          title="Kontakt erstellen"
          actionBar={
            <>
              <Link
                className={buttonVariants({ variant: "destuctiveOutline" })}
                to="/contacts"
              >
                Abbrechen
              </Link>
              <Button
                variant="default"
                onClick={async () => {
                  await formRef.current?.submit();
                  navigate({ to: "/contacts" });
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
