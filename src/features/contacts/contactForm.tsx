import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormSelect } from "../forms/components/FormSelect";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { addressSchema, contactSchema } from "./contactSchema";
import { Button } from "@/components/ui/button";
import { uid } from "uid";
import TextField from "../forms/components/TextField";
import FormGroupHeader from "../forms/components/FormGroupHeader";
import FormSectionAdder from "../forms/components/FormSectionAdder";

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
        <h2>Kontakt</h2>
        <FormSelect
          name="baseInfo.type"
          className="w-[180px]"
          label="Art des Kontaktes"
          options={["company", "person"]}
        />

        {form.watch("baseInfo.type") === "company" ? (
          <FormField
            name="baseInfo.companyName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input label="Name der Firma" placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <div className="grid grid-cols-3 gap-4 w-full">
            <FormField
              name="baseInfo.title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input label="Titel" placeholder="dr." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="baseInfo.firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input label="Vorname" placeholder="Vorname" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="baseInfo.lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input label="Nachname" placeholder="Nachname" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {form.getValues("address")?.map((_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <FormGroupHeader
              name="address"
              label="Addresse"
              index={index}
              form={form}
            />

            <FormSelect
              name={`address.${index}.type`}
              className="w-[180px]"
              label="Art der Addresse"
              options={["billing", "shipping"]}
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
          </div>
        ))}

        <FormSectionAdder
          form={form}
          sections={[{ name: "address", label: "Addresse" }]}
          schemaMap={{ address: addressSchema }}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
