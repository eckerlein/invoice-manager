import React, { ReactNode } from "react";
import { createTsForm } from "@ts-react/form";
import {
  addressSchema,
  bankAccountSchema,
  baseContactInformationSchema,
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
import Button from "../../baseComponents/Button.tsx";

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

function FormContainer({
  onSubmit,
  children,
  loading,
}: {
  onSubmit: () => void;
  children: ReactNode;
  loading?: boolean;
  className?: string;
}) {
  return (
    <form className="flex flex-col gap-4 p-4" onSubmit={onSubmit}>
      {children}
      <Button type="submit" loading={loading}>
        Submit
      </Button>
    </form>
  );
}

// Make sure to pass it to `createTsForm`
export const FormHelper = createTsForm(mapping, {
  FormComponent: FormContainer,
});
