import { z } from "zod";

export type IncomingInvoice = z.infer<typeof incomingInvoiceSchema>;
export const incomingInvoiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  documentDate: z.date(),
  receivedDate: z.date(),
  amount: z.number(),
  contact: z.string().optional(),
  uploadedDocuments: z.array(z.string()),
});
