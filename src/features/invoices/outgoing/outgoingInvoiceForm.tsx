import { z } from "zod";
import { DefaultValues, useForm, useWatch } from "react-hook-form";
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
import FormSectionSingle from "@/features/forms/components/FormSectionSingle";
import { FileUploadField } from "@/components/ui/fileDrop";
import { Directories } from "@/lib/utils/tauri/diskUtils";

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

  // Watch for changes in items to recalculate the total amount
  const items = useWatch({ control: form.control, name: "items" });
  const itemsTotalPrices = items.map(
    (item) => (item.price || 0) * (item.quantity || 1)
  );
  const totalAmount = itemsTotalPrices.reduce((sum, item) => sum + item, 0);

  useEffect(() => {
    form.setValue("amount", totalAmount);
  }, [totalAmount, form]);

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

        <FormComboBox
          name="contact"
          label="Kontakt"
          options={contactOptions}
          placeholder="Select contact..."
        />

        <TextField
          name="amount"
          label="Betrag"
          type="currency"
          disabled={true}
        />

        <FormSectionArray
          name="items"
          label="Rechnungsposten"
          form={form}
          render={(index) => (
            <div className="grid grid-cols-10 gap-4 w-full">
              <TextField
                name={`items.${index}.description`}
                label="Beschreibung"
                className="col-span-4"
              />
              <TextField
                name={`items.${index}.quantity`}
                label="Menge"
                type="number"
              />
              <TextField name={`items.${index}.unit`} label="Einheit" />
              <TextField
                name={`items.${index}.price`}
                label="Preis"
                className="col-span-2"
                type="currency"
              />
              <TextField
                name={`items.${index}.total`}
                label="Gesamt"
                type="currency"
                className="col-span-2"
                disabled={true}
                value={itemsTotalPrices[index]}
              />
            </div>
          )}
        />

        <FormSectionSingle
          form={form}
          name="uploadedDocuments"
          label="Dokumente"
        >
          <FileUploadField
            name="uploadedDocuments"
            nestedPath={[Directories.INVOICES_DIR, form.getValues("id")]}
          />
        </FormSectionSingle>
        <FormSectionAdder
          form={form}
          sections={[
            { type: "array", name: "items", label: "Rechnungsposten" },
            { type: "single", name: "uploadedDocuments", label: "Dokumente" },
          ]}
          schemaMap={{
            items: z.array(orderItemSchema),
            uploadedDocuments: z.array(z.string()),
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
