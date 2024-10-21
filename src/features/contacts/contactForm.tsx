import { z } from "zod";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormSelect } from "../forms/components/FormSelect";
import FormHelper from "../forms/FormHelper";
import { contactSchema } from "./contactSchema";

const defaultValues = {
  baseInfo: {
    type: "company",
  },
} as const;

export function ContactForm() {
  const { FormComponent, form } = FormHelper({
    schema: contactSchema,
    onSubmit: (data) => console.log(data),
    defaultValues: defaultValues,
  });

  return (
    <FormComponent>
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
              <FormLabel>Name der Firma</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
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
                <FormLabel>Titel</FormLabel>
                <FormControl>
                  <Input placeholder="dr." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="baseInfo.firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vorname</FormLabel>
                <FormControl>
                  <Input placeholder="Vorname" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="baseInfo.lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nachname</FormLabel>
                <FormControl>
                  <Input placeholder="Nachname" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
      <h2>Addresse</h2>
      {/* export const addressSchema = z.object({
				type: z.enum(["billing", "shipping"]),
				additionalInfo: z.string().optional(),
				street: z.string(),
				postalCode: z.string(),
				city: z.string(),
				country: z.string(),
			}); */}

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
            <FormLabel>Addresszusatz</FormLabel>
            <FormControl>
              <Input placeholder="Addresszusatz" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="address.street"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Straße</FormLabel>
            <FormControl>
              <Input placeholder="Straße" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="address.postalCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Postleitzahl</FormLabel>
            <FormControl>
              <Input placeholder="Postleitzahl" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="address.city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stadt</FormLabel>
            <FormControl>
              <Input placeholder="Stadt" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="address.country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Land</FormLabel>
            <FormControl>
              <Input placeholder="Land" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormComponent>
  );
}
