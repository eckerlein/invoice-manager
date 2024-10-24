import { z } from "zod";

export const orderItemSchema = z.object({
  description: z.string(),
  unit: z.string(),
  quantity: z.number(),
  price: z.number(),
});

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

export const incomingInvoiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  documentDate: z.date(),
  receivedDate: z.date(),
  amount: z.number(),
  contact: z.string().optional(),
  uploadedDocuments: z.array(z.string()),
});
