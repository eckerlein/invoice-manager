import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "../../features/contacts/contactForm";
import { FormHelper } from "../../features/forms/formService";
import { z } from "zod";

export const Route = createFileRoute("/contacts/")({
  component: () => (
    <div>
      <h1>Contacts</h1>
      <p>Here are your contacts</p>
      <h2>Create new</h2>
      <ContactForm />
      {/* <FormHelper schema={z.object({ text: z.string() })} onSubmit={() => {}} /> */}
      <p>hellow orl</p>
    </div>
  ),
});
