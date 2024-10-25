import { load } from "@tauri-apps/plugin-store";
import { Contact, contactSchema } from "./contactSchema";
import { getContactName } from "./contactUtils";

class ContactStore {
  private static instance: ContactStore | null = null;
  private store: Awaited<ReturnType<typeof load>> | undefined;
  private static isInitialized = false;

  private constructor() {}

  public static async getInstance(): Promise<ContactStore> {
    if (!ContactStore.instance) {
      ContactStore.instance = new ContactStore();
      await ContactStore.instance.initializeStore();
      ContactStore.isInitialized = true;
    }
    return ContactStore.instance;
  }

  private async initializeStore() {
    if (!ContactStore.isInitialized) {
      this.store = await load("store/contact.json");
    }
  }

  private async ensureStoreInitialized() {
    if (!this.store) {
      await this.initializeStore();
    }
  }

  public async set(contact: Contact) {
    await this.ensureStoreInitialized();
    const { error, data } = contactSchema.safeParse(contact);
    if (error) return error;
    const { id, ...rest } = data;
    await this.store!.set(id, rest);
  }

  public async get(id: string): Promise<Contact | undefined> {
    await this.ensureStoreInitialized();
    const data = await this.store!.get<Omit<Contact, "id">>(id);
    if (!data) return;
    return { id, ...data };
  }

  public async delete(id: string) {
    await this.ensureStoreInitialized();
    await this.store!.delete(id);
  }

  public async entries(): Promise<[string, Omit<Contact, "id">][]> {
    await this.ensureStoreInitialized();
    return await this.store!.entries<Omit<Contact, "id">>();
  }

  public async getContactOptions(): Promise<
    { value: string; label: string }[]
  > {
    const entries = await this.entries();
    return entries.map(([id, contact]) => ({
      value: id,
      label: getContactName(contact),
    }));
  }
}

export default ContactStore;
