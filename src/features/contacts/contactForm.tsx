import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormSelect } from "../forms/components/FormSelect";
import FormHelper from "../forms/FormHelper";
import { useFormContext, useFormState } from "react-hook-form";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  type: z.enum(["company", "person"]),
});

const defaultValues = {
  username: "",
  type: "company",
} as const;

export function ContactForm() {
  // const form = useForm<z.infer<typeof FormSchema>>({
  //   resolver: zodResolver(FormSchema),
  //   defaultValues: {
  //     username: "",
  //   },
  // });

  // function onSubmit(data: z.infer<typeof FormSchema>) {
  //   toast({
  //     title: "You submitted the following values:",
  //     description: (
  //       <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
  //         <code className="text-white">{JSON.stringify(data, null, 2)}</code>
  //       </pre>
  //     ),
  //   });
  // }

  const { FormComponent, form } = FormHelper({
    schema: FormSchema,
    onSubmit: (data) => console.log(data),
    defaultValues: defaultValues,
  });

	const selectedType = form.watch("type");

  return (
    <FormComponent>
      <FormField
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="shadcn" {...field} />
            </FormControl>
            <FormDescription>This is your public display name.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedType === "company" && (
        <h1>hello world</h1>
      )}

      <FormSelect
        name="type"
        label="Art des Kontaktes"
        options={["company", "person"]}
      />
    </FormComponent>
  );
}
