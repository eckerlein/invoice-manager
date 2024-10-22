import { z } from "zod";

// Address schema
export const addressSchema = z.object({
  type: z.enum(["billing", "shipping"]),
  additionalInfo: z.string().optional(),
  street: z.string(),
  streetNumber: z.number(),
  postalCode: z.number(),
  city: z.string(),
  country: z.string(),
});

// Email schema
export const emailSchema = z.object({
  emailAddress: z.string().email(),
  type: z.enum(["business", "personal", "office", "other"]),
});

// Phone number schema
export const phoneNumberSchema = z.object({
  number: z.string(),
  type: z.enum(["business", "mobile", "fax", "personal", "office", "other"]),
});

// Tax info schema
export const taxInfoSchema = z.object({
  taxNumber: z.string().optional(),
  vatId: z.string().optional(),
  allowTaxFreeInvoices: z.boolean().optional(),
});

// Representative schema
export const representativeSchema = z.object({
  title: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  showOnInvoice: z.boolean().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().optional(),
});

// Bank account schema
export const bankAccountSchema = z.object({
  iban: z.string(),
  bic: z.string(),
  bankName: z.string(),
  accountHolder: z.string(),
});

// Use Zod Discriminated Union to differentiate between company and person
export const baseContactInformationSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("company"),
    companyName: z.string(),
  }),
  z.object({
    type: z.literal("person"),
    title: z.string().optional(),
    firstName: z.string(),
    lastName: z.string(),
  }),
]);

// Full contact schema
export const contactSchema = z.object({
  id: z.string(),
  baseInfo: baseContactInformationSchema,
  address: z.array(addressSchema).optional(),
  email: z.array(emailSchema).optional(),
  phoneNumber: z.array(phoneNumberSchema).optional(),
  // taxInfo: taxInfoSchema,
  // bankAccount: bankAccountSchema,
});

// Export types
export type BaseInfo = z.infer<typeof baseContactInformationSchema>;
export type Address = z.infer<typeof addressSchema>;
export type Email = z.infer<typeof emailSchema>;
export type PhoneNumber = z.infer<typeof phoneNumberSchema>;
export type TaxInfo = z.infer<typeof taxInfoSchema>;
export type Representative = z.infer<typeof representativeSchema>;
export type BankAccount = z.infer<typeof bankAccountSchema>;
export type Contact = z.infer<typeof contactSchema>;
