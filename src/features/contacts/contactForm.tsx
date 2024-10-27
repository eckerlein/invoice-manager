import React, { forwardRef } from "react";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import FormSelect from "../forms/components/FormSelect";
import { DefaultValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import {
  Contact,
  addressSchema,
  bankAccountSchema,
  baseContactInformationSchema,
  contactSchema,
  emailSchema,
  phoneNumberSchema,
  taxInfoSchema,
} from "./contactSchema";
import { Button } from "@/components/ui/button";
import { uid } from "uid";
import TextField from "../forms/components/TextField";
import FormSectionAdder from "../forms/components/FormSectionAdder";
import FormSectionArray from "../forms/components/FormSectionArray";
import getDiscriminatedUnionValues from "@/lib/utils/zod/getDiscriminatedUnionValues";
import FormSectionSingle from "../forms/components/FormSectionSingle";
import ContactStore from "./contactStore";
import { twMerge } from "tailwind-merge";
import { useComposedRef } from "@/lib/utils/useComposedRef";
import { formSubmitRef } from "../forms/formSubmitRef";

export type ContactFormRef = {
  submit: () => Promise<boolean>;
};

export const ContactForm = forwardRef(function ContactForm(
  {
    defaultValues,
    formType,
    showButton = true,
    className,
  }: {
    defaultValues?: DefaultValues<Contact>;
    formType?: "create" | "update";
    showButton?: boolean;
    className?: string;
  },
  ref: React.Ref<ContactFormRef>
) {
  defaultValues ??= {
    id: uid(),
    baseInfo: {
      type: "company",
    },
  };

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues,
  });

  async function onSubmit(data: z.infer<typeof contactSchema>) {
    try {
      const store = await ContactStore.getInstance();
      const err = await store.set(data);
      if (err) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      }
      toast({
        title: `Kontakt ${formType === "create" ? "erstellt" : "aktualisiert"}`,
      });
    } catch (error) {
      console.error("Error saving contact:", error);
      toast({
        title: "Error",
        description: "Failed to save contact.",
        variant: "destructive",
      });
    }
  }

  useComposedRef(ref, {
    submit: formSubmitRef(form, onSubmit),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={twMerge("flex flex-col gap-4", className)}
      >
        <FormSelect
          name="baseInfo.type"
          className="w-[180px]"
          label="Art des Kontaktes"
          options={getDiscriminatedUnionValues(baseContactInformationSchema)}
        />
        <TextField name="id" label="Kundennummer" disabled={true} />

        {form.watch("baseInfo.type") === "company" ? (
          <TextField name="baseInfo.companyName" label="Name der Firma" />
        ) : (
          <div className="grid grid-cols-3 gap-4 w-full">
            <TextField
              name="baseInfo.title"
              label="Titel"
              placeholder="Herr/Frau"
            />
            <TextField name="baseInfo.firstName" label="Vorname" />
            <TextField name="baseInfo.lastName" label="Nachname" />
          </div>
        )}

        <FormSectionArray
          name="address"
          label="Addresse"
          form={form}
          render={(index) => (
            <>
              <FormSelect
                name={`address.${index}.type`}
                className="w-[180px]"
                label="Art der Addresse"
                options={addressSchema.shape.type._def.values}
                defaultValue="billing"
              />

              <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                <TextField
                  name={`address.${index}.street`}
                  className="col-span-2"
                  label="Straße"
                />
                <TextField
                  name={`address.${index}.streetNumber`}
                  label="Nr."
                  type="number"
                />
                <TextField
                  name={`address.${index}.postalCode`}
                  label="Postleitzahl"
                  type="stringNumber"
                />
                <TextField
                  name={`address.${index}.city`}
                  className="col-span-2"
                  label="Stadt"
                />
              </div>

              <TextField
                name={`address.${index}.additionalInfo`}
                label="Addresszusatz"
              />

              <TextField name={`address.${index}.country`} label="Land" />
            </>
          )}
        />

        <FormSectionArray
          name="email"
          label="Email"
          form={form}
          render={(index) => (
            <div className="flex gap-4">
              <TextField
                name={`email.${index}.emailAddress`}
                label="Email Addresse"
                className="w-full"
              />

              <FormSelect
                name={`email.${index}.type`}
                label="Typ"
                options={emailSchema.shape.type._def.values}
                defaultValue="businses"
              />
            </div>
          )}
        />

        <FormSectionArray
          name="phoneNumber"
          label="Telefonnummer"
          form={form}
          render={(index) => (
            <div className="flex gap-4">
              <TextField
                name={`phoneNumber.${index}.number`}
                label="Telefonnummer"
                className="w-full"
              />

              <FormSelect
                name={`phoneNumber.${index}.type`}
                label="Typ"
                defaultValue="business"
                options={phoneNumberSchema.shape.type._def.values}
              />
            </div>
          )}
        />

        <FormSectionArray
          name="bankAccount"
          label="Bankkonto"
          form={form}
          render={(index) => (
            <>
              <TextField
                name={`bankAccount.${index}.accountHolder`}
                label="Kontoinhaber"
              />
              <div className="grid grid-cols-3 gap-x-4">
                <TextField
                  name={`bankAccount.${index}.iban`}
                  label="IBAN"
                  className="col-span-2"
                />
                <TextField name={`bankAccount.${index}.bic`} label="BIC" />
              </div>
              <TextField name={`bankAccount.${index}.bankName`} label="Bank" />
            </>
          )}
        />

        <FormSectionSingle
          form={form}
          name="taxInfo"
          label="Steuerinformationen"
        >
          <TextField name="taxInfo.taxNumber" label="Steuernummer" />
          <TextField name="taxInfo.vatId" label="Umsatzsteuer-ID" />
        </FormSectionSingle>

        <FormSectionAdder
          form={form}
          sections={[
            { type: "array", name: "address", label: "Addresse" },
            { type: "array", name: "email", label: "Email" },
            { type: "array", name: "phoneNumber", label: "Telefonnummer" },
            { type: "array", name: "bankAccount", label: "Bankkonto" },
            { type: "single", name: "taxInfo", label: "Steuerinformationen" },
          ]}
          schemaMap={{
            address: addressSchema,
            email: emailSchema,
            phoneNumber: phoneNumberSchema,
            bankAccount: bankAccountSchema,
            taxInfo: taxInfoSchema,
          }}
        />
        {showButton && (
          <Button className="" type="submit">
            Speichern
          </Button>
        )}
      </form>
    </Form>
  );
});
