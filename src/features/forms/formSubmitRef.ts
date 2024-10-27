import { UseFormReturn, FieldValues } from "react-hook-form";

export function formSubmitRef<T extends FieldValues>(
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
          resolve(false); // Resolve false on error
        }
      )();
    });
}
