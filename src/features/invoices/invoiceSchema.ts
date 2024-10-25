import { z } from "zod";

export type OrderItem = z.infer<typeof orderItemSchema>;
export const orderItemSchema = z.object({
  description: z.string(),
  unit: z.string(),
  quantity: z.number(),
  price: z.number(),
});

export type OutgoingInvoice = z.infer<typeof outgoingInvoiceSchema>;
export const outgoingInvoiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  documentDate: z.date(),
  amount: z.number(),
  contact: z.string().optional(),
  lineItems: z.array(orderItemSchema),
  createdDate: z.date(),
  editDate: z.date().optional(),
  deleteDate: z.date().optional(),
});

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
