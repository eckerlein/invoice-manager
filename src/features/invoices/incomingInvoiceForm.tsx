import { z } from "zod";

import { DefaultValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { uid } from "uid";
import TextField from "../forms/components/TextField";
import React, { forwardRef, useImperativeHandle } from "react";
import { twMerge } from "tailwind-merge";
import { incomingInvoiceSchema } from "./invoiceSchema";
import { Form } from "@/components/ui/form";
import FormDatePicker from "../forms/components/FormDatePicker";
import { FileUploadField } from "@/components/ui/fileDrop";
import { Directories } from "@/lib/utils/tauri/diskUtils";

export type IncomingInvoiceFormRef = {
  submit: () => Promise<void>;
};

type IncomingInvoiceFormProps = {
  defaultValues?: DefaultValues<z.infer<typeof incomingInvoiceSchema>>;
  formType?: "create" | "update";
  showButton?: boolean;
  className?: string;
  invoiceId?: string;
};

export const IncomingInvoiceForm = forwardRef(function IncomingInvoiceForm(
  {
    defaultValues,
    formType,
    showButton = true,
    className,
    invoiceId,
  }: IncomingInvoiceFormProps,
  ref: React.Ref<IncomingInvoiceFormRef>
) {
  defaultValues ??= {
    id: uid(),
  };

  const form = useForm<z.infer<typeof incomingInvoiceSchema>>({
    resolver: zodResolver(incomingInvoiceSchema),
    defaultValues,
  });

  async function onSubmit(data: z.infer<typeof incomingInvoiceSchema>) {
    // const err = await contactStore.set(data);
    // if (err) {
    // 	toast.error(err.message);
    // } else {
    // 	toast.success("Kontakt erfolgreich gespeichert");
    // }
    console.log(data);
    toast({
      title: "Invoice saved",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  useImperativeHandle<IncomingInvoiceFormRef, any>(ref, () => ({
    submit: () => form.handleSubmit(onSubmit, (e) => console.error(e))(),
  }));

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (e) => console.error(e))}
        className={twMerge("flex flex-col gap-4", className)}
      >
        <TextField name="id" label="Belegnummer" disabled={true} />
        <TextField name="name" label="Titel" />
        <div className="grid grid-cols-2 gap-4">
          <FormDatePicker label="Rechnungsdatum" name="documentDate" />
          <FormDatePicker label="Erhalten am" name="receivedDate" />
        </div>
        <FileUploadField
          name="uploadedDocuments"
          label="Test"
          nestedPath={[Directories.INVOICES_DIR, form.getValues("id")]}
        />

        <TextField name="amount" label="Betrag" type="number" />
        <TextField name="contact" label="Kontakt" />
      </form>
    </Form>
  );
});
