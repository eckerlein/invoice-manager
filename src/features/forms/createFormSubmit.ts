import { toast } from "@/hooks/use-toast";
import { UseFormReturn, FieldValues } from "react-hook-form";

export function createFormSubmit<T extends FieldValues>(
  form: UseFormReturn<T>, // Typed with `T` extending `FieldValues`
  onSubmit: (data: T) => Promise<void>
): () => Promise<boolean> {
  return () =>
    new Promise<boolean>((resolve) => {
      form.handleSubmit(
        async (data) => {
          await onSubmit(data);
          resolve(true); // Resolve true on success
        },
        (error) => {
          console.error(error);
          toast({
            title: "Fehler",
            description:
              "Das Speichern des Formulars ist fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.",
            variant: "destructive",
          });
          resolve(false); // Resolve false on error
        }
      )();
    });
}
