import { ContactForm } from "@/features/contacts/contactForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contacts/create")({
  component: () => (
    <div>
      <ContactForm />
    </div>
  ),
});
