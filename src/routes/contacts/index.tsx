import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/features/contacts/contactForm";
import { db } from "@/features/database/db";

export const Route = createFileRoute("/contacts/")({
  component: () => {
    function stuff() {
      // db.run("Drop table if exists users");
    }

    return (
      <div>
        <h1>Contacts</h1>
        <p>Here are your contacts</p>
        <h2>Create new</h2>

        <button onClick={stuff}>drop</button>

        {/* <button onClick={setupDatabase}>Setup database</button> */}
        <ContactForm />
      </div>
    );
  },
});
