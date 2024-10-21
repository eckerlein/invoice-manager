import React from "react";
import { createTsForm } from "@ts-react/form";
import {
  addressSchema,
  bankAccountSchema,
  baseContactInformationSchema,
  contactSchema,
  emailSchema,
  phoneNumberSchema,
  representativeSchema,
  taxInfoSchema,
} from "../contacts/contactSchema.ts";
import TextField from "./components/TextField";
import PhoneNumberComponent from "./components/PhoneNumber";
import EmailComponent from "./components/Email";
import AddressComponent from "./components/Address";
import TaxInfoComponent from "./components/TaxInfo";
import RepresentativeComponent from "./components/Representative";
import BankAccountComponent from "./components/BankAccount";
import { z } from "zod";
import BaseInfoComponent from "./components/BaseInfo.tsx";

// Map Zod fields to components
const mapping = [
  [z.string(), TextField],
  [baseContactInformationSchema, BaseInfoComponent],
  [phoneNumberSchema, PhoneNumberComponent],
  [emailSchema, EmailComponent],
  [addressSchema, AddressComponent],
  [taxInfoSchema, TaxInfoComponent],
  [representativeSchema, RepresentativeComponent],
  [bankAccountSchema, BankAccountComponent],
] as const;

const Form = createTsForm(mapping);

const ContactForm = () => {
  return (
    <div className="p-4">
      <h1>Create Contact</h1>
      <Form
        onSubmit={(data) => {
          console.log("Form data", data);
          // Call your contactService.createContact(data) here
        }}
        schema={contactSchema}
      />
    </div>
  );
};

export default ContactForm;
