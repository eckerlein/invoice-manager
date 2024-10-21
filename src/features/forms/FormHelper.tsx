import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export default function FormHelper<Schema extends Zod.Schema>({
  onSubmit,
  className,
  schema,
  defaultValues,
  children,
}: {
  onSubmit: (data: z.infer<Schema>) => void;
  className?: string;
  schema: Schema;
  defaultValues?: DefaultValues<z.infer<Schema>>;
  children: React.ReactNode;
}) {
  const form = useForm<z.infer<Schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  function thisOnSubmit(data: z.infer<Schema>) {
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
        onSubmit={form.handleSubmit(thisOnSubmit)}
        className={twMerge("flex flex-col gap-4 p-4", className)}
      >
        {children}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
