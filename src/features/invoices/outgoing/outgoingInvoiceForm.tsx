import { z } from "zod";
import { DefaultValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { uid } from "uid";
import TextField from "../../forms/components/TextField";
import React, { forwardRef, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  outgoingInvoiceSchema,
  orderItemSchema,
} from "./outgoingInvoiceSchema";
import { Form } from "@/components/ui/form";
import FormDatePicker from "../../forms/components/FormDatePicker";
import { Button } from "@/components/ui/button";
import FormComboBox from "../../forms/components/FormComboBox";
import ContactStore from "../../contacts/contactStore";
import { ComboBoxOption } from "@/components/ui/ComboBox";
import OutgoingInvoiceStore from "@/features/invoices/outgoing/outgoingInvoiceStore";
import { useComposedRef } from "@/lib/utils/useComposedRef";
import { createFormSubmit } from "@/features/forms/createFormSubmit";
import FormSectionAdder from "@/features/forms/components/FormSectionAdder";
import FormSectionArray from "@/features/forms/components/FormSectionArray";

export type OutgoingInvoiceFormRef = {
  submit: () => Promise<boolean>;
};

type OutgoingInvoiceFormProps = {
  defaultValues?: DefaultValues<z.infer<typeof outgoingInvoiceSchema>>;
  formType: "create" | "update";
  showButton?: boolean;
  className?: string;
};

export const OutgoingInvoiceForm = forwardRef(function OutgoingInvoiceForm(
  {
    defaultValues,
    formType,
    showButton = true,
    className,
  }: OutgoingInvoiceFormProps,
  ref: React.Ref<OutgoingInvoiceFormRef>
) {
  defaultValues ??= {
    id: uid(),
    documentDate: new Date(),
    createdDate: new Date(),
    items: [],
  };

  const form = useForm<z.infer<typeof outgoingInvoiceSchema>>({
    resolver: zodResolver(outgoingInvoiceSchema),
    defaultValues,
  });

  async function onSubmit(data: z.infer<typeof outgoingInvoiceSchema>) {
    try {
      const invoiceStore = await OutgoingInvoiceStore.getInstance();
      const err = await invoiceStore.set(data);
      if (err) throw err;

      toast({
        title: `Rechnung ${formType === "create" ? "erstellt" : "aktualisiert"}`,
      });
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast({
        title: "Fehler",
        description: "Das Speichern der Rechnung ist fehlgeschlagen.",
        variant: "destructive",
      });
    }
  }

  const [contactOptions, setContactOptions] = useState<ComboBoxOption[]>([]);
  useEffect(() => {
    async function fetchContacts() {
      const store = await ContactStore.getInstance();
      const contacts = await store.getContactOptions();
      setContactOptions(contacts);
    }
    fetchContacts();
  }, []);

  useComposedRef(ref, {
    submit: createFormSubmit(form, onSubmit),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createFormSubmit(form, onSubmit)();
        }}
        className={twMerge("flex flex-col gap-4", className)}
      >
        <TextField name="id" label="Belegnummer" disabled={true} />
        <TextField name="name" label="Titel" />
        <div className="grid grid-cols-2 gap-4">
          <FormDatePicker label="Rechnungsdatum" name="documentDate" />
          <FormDatePicker label="Erstellungsdatum" name="createdDate" />
        </div>
        <TextField name="amount" label="Betrag" type="currency" />
        <FormComboBox
          name="contact"
          label="Kontakt"
          options={contactOptions}
          placeholder="Select contact..."
        />

        <FormSectionArray
          name="items"
          label="Rechnungsposten"
          form={form}
          render={(index) => (
            <div className="grid grid-cols-4 gap-4 w-full">
              <TextField
                name={`items.${index}.description`}
                label="Beschreibung"
              />
              <TextField name={`items.${index}.unit`} label="Einheit" />
              <TextField
                name={`items.${index}.quantity`}
                label="Menge"
                type="number"
              />
              <TextField
                name={`items.${index}.price`}
                label="Preis"
                type="currency"
              />
            </div>
          )}
        />

        <FormSectionAdder
          form={form}
          sections={[
            { type: "array", name: "items", label: "Rechnungsposten" },
          ]}
          schemaMap={{
            items: orderItemSchema,
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
