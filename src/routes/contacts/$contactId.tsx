import { ContactForm } from "@/features/contacts/contactForm";
import { Contact } from "@/features/contacts/contactSchema";
import contactStore from "@/features/contacts/contactStore";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contacts/$contactId")({
  component: () => {
    return (
      <h1>hello world</h1>
      // <Suspense>
      //   <ContactDetails />
      // </Suspense>
    );
  },
});

// function ContactDetails() {
//   const { contactId } = Route.useParams();

//   const contact = usePromise(() => contactStore.get(contactId));

//   return <ContactForm defaultValues={contact} />;
// }
