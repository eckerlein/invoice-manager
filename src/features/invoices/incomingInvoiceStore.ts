import { load } from "@tauri-apps/plugin-store";
import { incomingInvoiceSchema, type IncomingInvoice } from "./invoiceSchema";

const incomingInvoiceStore = await load("store/incomingInvoice.json");

export default {
  store: incomingInvoiceStore,

  set: async (invoice: IncomingInvoice) => {
    const { error, data } = incomingInvoiceSchema.safeParse(invoice);
    if (error) return error;

    const { id, ...rest } = data;
    await incomingInvoiceStore.set(id, rest);
  },

  get: async (id: string): Promise<IncomingInvoice | undefined> => {
    const data =
      await incomingInvoiceStore.get<Omit<IncomingInvoice, "id">>(id);
    if (!data) return;
    return { id, ...data };
  },

  delete: async (id: string) => {
    await incomingInvoiceStore.delete(id);
  },

  entries: async (): Promise<[string, Omit<IncomingInvoice, "id">][]> => {
    return await incomingInvoiceStore.entries<Omit<IncomingInvoice, "id">>();
  },
};
