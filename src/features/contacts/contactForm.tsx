import { z } from "zod";

import { Form } from "@/components/ui/form";
import FormSelect from "../forms/components/FormSelect";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import {
  addressSchema,
  baseContactInformationSchema,
  contactSchema,
  emailSchema,
  phoneNumberSchema,
} from "./contactSchema";
import { Button } from "@/components/ui/button";
import { uid } from "uid";
import TextField from "../forms/components/TextField";
import FormSectionAdder from "../forms/components/FormSectionAdder";
import { Label } from "@/components/ui/label";
import FormSection from "../forms/components/FormSection";
import getDiscriminatedUnionValues from "@/lib/utils/zod/getDiscriminatedUnionValues";

export function ContactForm() {
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      id: uid(),
      baseInfo: {
        type: "company",
      },
    },
  });
  function onSubmit(data: z.infer<typeof contactSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4"
      >
        <Label className="text-lg">Kontakt</Label>
        <FormSelect
          name="baseInfo.type"
          className="w-[180px]"
          label="Art des Kontaktes"
          // options={baseContactInformationSchema.shape.type._def.values}
          options={getDiscriminatedUnionValues(baseContactInformationSchema)}
        />

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

        <FormSection
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
                  type="number"
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

        <FormSection
          name="email"
          label="Email"
          form={form}
          render={(index) => (
            <>
              <TextField
                name={`email.${index}.emailAddress`}
                label="Email Addresse"
              />

              <FormSelect
                name={`email.${index}.type`}
                label="Art der Email"
                options={emailSchema.shape.type._def.values}
              />
            </>
          )}
        />

        <FormSection
          name="phoneNumber"
          label="Telefonnummer"
          form={form}
          render={(index) => (
            <>
              <TextField
                name={`phoneNumber.${index}.number`}
                label="Telefonnummer"
              />

              <FormSelect
                name={`phoneNumber.${index}.type`}
                label="Art der Telefonnummer"
                options={phoneNumberSchema.shape.type._def.values}
              />
            </>
          )}
        />

        <FormSectionAdder
          form={form}
          sections={[
            { name: "address", label: "Addresse" },
            { name: "email", label: "Email" },
            { name: "phoneNumber", label: "Telefonnummer" },
          ]}
          schemaMap={{ address: addressSchema }}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
