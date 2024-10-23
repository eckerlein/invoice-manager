import { load } from "@tauri-apps/plugin-store";
import { Contact, contactSchema } from "./contactSchema";

const contactStore = await load("store/contact.json");

async function saveContact(contact: Contact) {
  const { error, data } = contactSchema.safeParse(contact);
  if (error) return error;

  const { id, ...rest } = data;
  if (await contactStore.get(id))
    return new Error("Contact with this ID already exists");

  await contactStore.set(id, rest);
}

async function getContact(id: string): Promise<Contact | undefined> {
  const data = await contactStore.get<Omit<Contact, "id">>(id);
  if (!data) return;
  return { id, ...data };
}

export default {
	...contactStore,
	saveContact,
	getContact,
}
