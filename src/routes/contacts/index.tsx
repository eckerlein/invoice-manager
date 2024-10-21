import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { emailSchema } from "@/features/contacts/contactSchema";
import { ContactForm } from "@/features/contacts/contactForm";

export const Route = createFileRoute("/contacts/")({
  component: () => (
    <div>
      <h1>Contacts</h1>
      <p>Here are your contacts</p>
      <h2>Create new</h2>
      <ContactForm />

      <p>hellow orl</p>
    </div>
  ),
});
