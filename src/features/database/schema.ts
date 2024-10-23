import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { z } from "zod";

export const emails = sqliteTable("emails", {
  emailAddress: text("email_address").notNull(),
  type: text("type").notNull(),
});

export const emailSchema = createInsertSchema(emails, {
  emailAddress: z.string().email(),
  type: z.enum(["business", "personal", "office", "other"]),
});

export const addresses = sqliteTable("addresses", {
  type: text("type").notNull(),
  additionalInfo: text("additional_info"),
  street: text("street").notNull(),
  streetNumber: integer("street_number").notNull(),
  postalCode: integer("postal_code").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
});

export const addressSchema = createInsertSchema(addresses, {
  type: z.enum(["billing", "shipping"]),
});

export const phoneNumbers = sqliteTable("phone_numbers", {
  number: text("number").notNull(),
  type: text("type").notNull(),
});

export const phoneNumberSchema = createInsertSchema(phoneNumbers, {
  type: z.enum(["business", "mobile", "fax", "personal", "office", "other"]),
});

export const taxInfos = sqliteTable("tax_infos", {
  taxNumber: text("tax_number"),
  vatId: text("vat_id"),
});

export const taxInfoSchema = createInsertSchema(taxInfos);

export const representatives = sqliteTable("representatives", {
  title: text("title"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  showOnInvoice: text("show_on_invoice"),
  phoneNumber: text("phone_number"),
  email: text("email"),
});

export const representativeSchema = createInsertSchema(representatives);

export const bankAccounts = sqliteTable("bank_accounts", {
  id: text("id").primaryKey().notNull(),
  iban: text("iban").notNull(),
  bic: text("bic").notNull(),
  bankName: text("bank_name").notNull(),
  accountHolder: text("account_holder").notNull(),
});

export const bankAccountSchema = createInsertSchema(bankAccounts);

export const contacts = sqliteTable("contacts", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  companyName: text("company_name"),
  title: text("title"),
  firstName: text("first_name"),
  lastName: text("last_name"),
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
  taxInfo: taxInfoSchema.optional(),
  bankAccount: z.array(bankAccountSchema).optional(),
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
