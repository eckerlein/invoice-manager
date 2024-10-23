import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/features/contacts/contactForm";
import { setupDatabase } from "@/features/database/db";

export const Route = createFileRoute("/contacts/")({
  component: () => {
    setupDatabase();
    return (
      <div>
        <h1>Contacts</h1>
        <p>Here are your contacts</p>
        <h2>Create new</h2>

        <ContactForm />
      </div>
    );
  },
});
