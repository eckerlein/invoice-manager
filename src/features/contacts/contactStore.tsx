import { load } from "@tauri-apps/plugin-store";
import { Contact, contactSchema } from "./contactSchema";

const contactStore = await load("store/contact.json");

export default {
  store: contactStore,

  set: async (contact: Contact) => {
    const { error, data } = contactSchema.safeParse(contact);
    if (error) return error;

    const { id, ...rest } = data;
    await contactStore.set(id, rest);
  },

  get: async (id: string): Promise<Contact | undefined> => {
    const data = await contactStore.get<Omit<Contact, "id">>(id);
    if (!data) return;
    return { id, ...data };
  },

  entries: async (): Promise<[string, Omit<Contact, "id">][]> => {
    return await contactStore.entries<Omit<Contact, "id">>();
  },
};
