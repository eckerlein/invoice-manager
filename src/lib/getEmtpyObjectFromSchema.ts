import { z } from "zod";

export function getEmptyObjectFromSchema<T extends z.ZodTypeAny>(
  schema: T
): z.infer<T> {
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;

    return Object.keys(shape).reduce(
      (acc, key) => {
        const field = shape[key];
        acc[key] = getEmptyObjectFromSchema(field); // Recursively handle nested objects
        return acc;
      },
      {} as z.infer<typeof schema>
    );
  } else if (schema instanceof z.ZodArray) {
    return [] as z.infer<T>; // Return an empty array for arrays
  } else if (
    schema instanceof z.ZodOptional ||
    schema instanceof z.ZodNullable
  ) {
    return undefined as z.infer<T>; // Return undefined for optional or nullable fields
  } else if (schema instanceof z.ZodString) {
    return "" as z.infer<T>; // Return empty string for strings
  } else if (schema instanceof z.ZodNumber) {
    return 0 as z.infer<T>; // Return 0 for numbers
  } else if (schema instanceof z.ZodBoolean) {
    return false as z.infer<T>; // Return false for booleans
  } else if (schema instanceof z.ZodEnum) {
    const firstEnumValue = schema.options[0];
    return firstEnumValue as z.infer<T>; // Return the first enum value as a default
  } else {
    return undefined as z.infer<T>; // Fallback to undefined for other types
  }
}
