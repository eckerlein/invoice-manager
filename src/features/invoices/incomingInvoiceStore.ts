// Update incommingInvoiceStore.ts or similar store file

import { load } from "@tauri-apps/plugin-store";
import { IncomingInvoice, incomingInvoiceSchema } from "./invoiceSchema";

const incomingInvoiceStore = await load("store/incomingInvoices.json");

function parseDates<T extends IncomingInvoice | Omit<IncomingInvoice, "id">>(
  invoice: T
): T {
  return {
    ...invoice,
    documentDate: new Date(invoice.documentDate),
    receivedDate: new Date(invoice.receivedDate),
  };
}

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
    return parseDates({ id, ...data });
  },

  delete: async (id: string): Promise<void> => {
    await incomingInvoiceStore.delete(id);
  },

  entries: async (): Promise<[string, Omit<IncomingInvoice, "id">][]> => {
    const entries =
      await incomingInvoiceStore.entries<Omit<IncomingInvoice, "id">>();
    return entries.map(([id, invoice]) => [id, parseDates(invoice)]);
  },
};
