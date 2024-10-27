import { z } from "zod";
import { DefaultValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { uid } from "uid";
import TextField from "../../forms/components/TextField";
import React, { forwardRef, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { incomingInvoiceSchema } from "./incomingInvoiceSchema";
import { Form } from "@/components/ui/form";
import FormDatePicker from "../../forms/components/FormDatePicker";
import { FileUploadField } from "@/components/ui/fileDrop";
import { Directories } from "@/lib/utils/tauri/diskUtils";
import { Button } from "@/components/ui/button";
import FormComboBox from "../../forms/components/FormComboBox";
import ContactStore from "../../contacts/contactStore";
import { ComboBoxOption } from "@/components/ui/ComboBox";
import IncomingInvoiceStore from "@/features/invoices/incoming/incomingInvoiceStore";
import { useComposedRef } from "@/lib/utils/useComposedRef";
import { createFormSubmit } from "@/features/forms/createFormSubmit";

export type IncomingInvoiceFormRef = {
  submit: () => Promise<boolean>;
};

type IncomingInvoiceFormProps = {
  defaultValues?: DefaultValues<z.infer<typeof incomingInvoiceSchema>>;
  formType: "create" | "update";
  showButton?: boolean;
  className?: string;
};

export const IncomingInvoiceForm = forwardRef(function IncomingInvoiceForm(
  {
    defaultValues,
    formType,
    showButton = true,
    className,
  }: IncomingInvoiceFormProps,
  ref: React.Ref<IncomingInvoiceFormRef>
) {
  defaultValues ??= {
    id: uid(),
    documentDate: new Date(),
    receivedDate: new Date(),
  };

  const form = useForm<z.infer<typeof incomingInvoiceSchema>>({
    resolver: zodResolver(incomingInvoiceSchema),
    defaultValues,
  });

  async function onSubmit(data: z.infer<typeof incomingInvoiceSchema>) {
    try {
      const invoiceStore = await IncomingInvoiceStore.getInstance();
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
      const store = await ContactStore.getInstance(); // Get the singleton instance
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
          <FormDatePicker label="Erhalten am" name="receivedDate" />
        </div>
        <TextField name="amount" label="Betrag" type="number" />
        <FormComboBox
          name="contact"
          label="Kontakt"
          options={contactOptions}
          placeholder="Select contact..."
        />

        <FileUploadField
          name="uploadedDocuments"
          nestedPath={[Directories.INVOICES_DIR, form.getValues("id")]}
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
