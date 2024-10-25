import { load } from "@tauri-apps/plugin-store";
import { Contact, contactSchema } from "./contactSchema";
import { getContactName } from "./contactUtils";

class ContactStore {
  private static instance: ContactStore;
  private store: Awaited<ReturnType<typeof load>> | undefined;

  private constructor() {}

  public static async getInstance(): Promise<ContactStore> {
    if (!ContactStore.instance) {
      ContactStore.instance = new ContactStore();
      await ContactStore.instance.initializeStore();
    }
    return ContactStore.instance;
  }

  private async initializeStore() {
    this.store = await load("store/contact.json");
  }

  // Ensure store is initialized before usage
  private ensureStoreInitialized() {
    if (!this.store) {
      throw new Error(
        "Store is not initialized. Make sure to call getInstance()."
      );
    }
  }

  public async set(contact: Contact) {
    this.ensureStoreInitialized(); // Check if store is initialized
    const { error, data } = contactSchema.safeParse(contact);
    if (error) return error;
    const { id, ...rest } = data;
    await this.store!.set(id, rest); // Non-null assertion, since we know it's initialized
  }

  public async get(id: string): Promise<Contact | undefined> {
    this.ensureStoreInitialized();
    const data = await this.store!.get<Omit<Contact, "id">>(id);
    if (!data) return;
    return { id, ...data };
  }

  public async delete(id: string) {
    this.ensureStoreInitialized();
    await this.store!.delete(id);
  }

  public async entries(): Promise<[string, Omit<Contact, "id">][]> {
    this.ensureStoreInitialized();
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
