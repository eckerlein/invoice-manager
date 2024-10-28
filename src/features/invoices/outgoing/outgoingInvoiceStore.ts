import { load } from "@tauri-apps/plugin-store";
import {
  OutgoingInvoice,
  outgoingInvoiceSchema,
} from "./outgoingInvoiceSchema";

class OutgoingInvoiceStore {
  private static instance: OutgoingInvoiceStore | null = null;
  private store: Awaited<ReturnType<typeof load>> | undefined;
  private static isInitialized = false;

  private constructor() {}

  public static async getInstance(): Promise<OutgoingInvoiceStore> {
    if (!OutgoingInvoiceStore.instance) {
      OutgoingInvoiceStore.instance = new OutgoingInvoiceStore();
      await OutgoingInvoiceStore.instance.initializeStore();
      OutgoingInvoiceStore.isInitialized = true;
    }
    return OutgoingInvoiceStore.instance;
  }

  private async initializeStore() {
    if (!OutgoingInvoiceStore.isInitialized) {
      this.store = await load("store/outgoingInvoices.json");
    }
  }

  private async ensureStoreInitialized() {
    if (!this.store) {
      await this.initializeStore();
    }
  }

  private parseDates<T extends OutgoingInvoice | Omit<OutgoingInvoice, "id">>(
    invoice: T
  ): T {
    return {
      ...invoice,
      documentDate: new Date(invoice.documentDate),
      createdDate: new Date(invoice.createdDate),
      editDate: invoice.editDate ? new Date(invoice.editDate) : undefined,
      deleteDate: invoice.deleteDate ? new Date(invoice.deleteDate) : undefined,
    };
  }

  public async set(invoice: OutgoingInvoice) {
    await this.ensureStoreInitialized();
    const { error, data } = outgoingInvoiceSchema.safeParse(invoice);
    if (error) return error;
    const { id, ...rest } = data;
    await this.store!.set(id, rest);
  }

  public async get(id: string): Promise<OutgoingInvoice | undefined> {
    await this.ensureStoreInitialized();
    const data = await this.store!.get<Omit<OutgoingInvoice, "id">>(id);
    if (!data) return;
    return this.parseDates({ id, ...data });
  }

  public async delete(id: string): Promise<void> {
    await this.ensureStoreInitialized();
    await this.store!.delete(id);
  }

  public async entries(): Promise<[string, Omit<OutgoingInvoice, "id">][]> {
    await this.ensureStoreInitialized();
    const entries = await this.store!.entries<Omit<OutgoingInvoice, "id">>();
    return entries.map(([id, invoice]) => [id, this.parseDates(invoice)]);
  }
}

export default OutgoingInvoiceStore;
