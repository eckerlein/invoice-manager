import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormSelect } from "../forms/components/FormSelect";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { contactSchema } from "./contactSchema";

export function ContactForm() {
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
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
    onSubmit(data);
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
        <h2>Addresse</h2>

        <FormSelect
          name="address.type"
          className="w-[180px]"
          label="Art der Adresse"
          options={["billing", "shipping"]}
        />

        <FormField
          name="address.additionalInfo"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  label="Addresszusatz"
                  placeholder="Addresszusatz"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="address.street"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input label="Straße" placeholder="Straße" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="address.postalCode"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  label="Postleitzahl"
                  placeholder="Postleitzahl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="address.city"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input label="Stadt" placeholder="Stadt" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="address.country"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input label="Land" placeholder="Land" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
