import { z } from 'zod';

type CurrencyOptions = {
  allowNegative?: boolean;
  optional?: boolean;
};

export function currency({
  allowNegative = false,
  optional = false,
}: CurrencyOptions): z.ZodType<string | undefined> {
  let schema: z.ZodType<string | undefined> = z
    .string()
    .refine(
      (value) => !value || !isNaN(parseFloat(value)),
      'Este campo deve conter apenas números',
    );

  if (!allowNegative) {
    schema = schema.refine(
      (value) => !value || (value && parseFloat(value) >= 0),
      'Este campo deve conter um número positivo',
    );
  }

  if (optional) {
    schema = schema.optional();
  }

  return schema;
}
