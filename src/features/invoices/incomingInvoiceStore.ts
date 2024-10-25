import { load } from "@tauri-apps/plugin-store";
import { IncomingInvoice, incomingInvoiceSchema } from "./invoiceSchema";

class IncomingInvoiceStore {
  private static instance: IncomingInvoiceStore | null = null;
  private store: Awaited<ReturnType<typeof load>> | undefined;
  private static isInitialized = false;

  private constructor() {}

  public static async getInstance(): Promise<IncomingInvoiceStore> {
    if (!IncomingInvoiceStore.instance) {
      IncomingInvoiceStore.instance = new IncomingInvoiceStore();
      await IncomingInvoiceStore.instance.initializeStore();
      IncomingInvoiceStore.isInitialized = true;
    }
    return IncomingInvoiceStore.instance;
  }

  private async initializeStore() {
    if (!IncomingInvoiceStore.isInitialized) {
      this.store = await load("store/incomingInvoices.json");
    }
  }

  private async ensureStoreInitialized() {
    if (!this.store) {
      await this.initializeStore();
    }
  }

  private parseDates<T extends IncomingInvoice | Omit<IncomingInvoice, "id">>(
    invoice: T
  ): T {
    return {
      ...invoice,
      documentDate: new Date(invoice.documentDate),
      receivedDate: new Date(invoice.receivedDate),
    };
  }

  public async set(invoice: IncomingInvoice) {
    await this.ensureStoreInitialized();
    const { error, data } = incomingInvoiceSchema.safeParse(invoice);
    if (error) return error;
    const { id, ...rest } = data;
    await this.store!.set(id, rest);
  }

  public async get(id: string): Promise<IncomingInvoice | undefined> {
    await this.ensureStoreInitialized();
    const data = await this.store!.get<Omit<IncomingInvoice, "id">>(id);
    if (!data) return;
    return this.parseDates({ id, ...data });
  }

  public async delete(id: string): Promise<void> {
    await this.ensureStoreInitialized();
    await this.store!.delete(id);
  }

  public async entries(): Promise<[string, Omit<IncomingInvoice, "id">][]> {
    await this.ensureStoreInitialized();
    const entries = await this.store!.entries<Omit<IncomingInvoice, "id">>();
    return entries.map(([id, invoice]) => [id, this.parseDates(invoice)]);
  }
}

export default IncomingInvoiceStore;
