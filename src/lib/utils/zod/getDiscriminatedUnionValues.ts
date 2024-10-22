import { ZodDiscriminatedUnion, ZodLiteral, ZodObject } from "zod";

export default function getDiscriminatedUnionValues<
  Key extends string,
  Schema extends ZodDiscriminatedUnion<Key, any>,
>(schema: Schema): Array<string> {
  return schema.options.map((option: ZodObject<any>) => {
    return (option.shape as Record<Key, ZodLiteral<string>>)[
      schema.discriminator
    ].value;
  });
}
