import { Control, FieldValues, Path, useController } from 'react-hook-form';
import InputCurrencyPrimitive from 'react-currency-input-field';
import { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type InputCurrencyProps<T extends FieldValues> = ComponentProps<'input'> & {
  control: Control<T>;
  name: Path<T>;
  label: string;
};

export function InputCurrency<T extends FieldValues>({
  name,
  control,
  label,
  className,
  disabled = false,
}: InputCurrencyProps<T>) {
  const { field, fieldState } = useController({
    name,
    control,
  });

  const { onChange, ...fieldProps } = field;

  return (
    <div>
      <div className="relative">
        <InputCurrencyPrimitive
          {...fieldProps}
          className={cn(
            'peer placeholder:text-muted-foreground flex h-9 w-full min-w-0 rounded-md border border-zinc-50 bg-white px-3 py-1 text-base shadow-sm transition-[color,box-shadow] outline-none disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:ring-[1px] focus-visible:ring-zinc-300',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
            fieldState.error && 'border-destructive',
            className,
          )}
          prefix="R$ "
          maxLength={10}
          disableAbbreviations
          onValueChange={(value) => onChange(value)}
          required
        />
        <span
          className={cn(
            'pointer-events-none absolute top-1/2 left-1 -translate-y-1/2 bg-white px-2 text-sm text-zinc-700 transition-all peer-valid:top-0 peer-valid:left-1.5 peer-valid:text-xs peer-focus:top-0 peer-focus:left-1.5 peer-focus:text-xs',
            fieldState.error && 'text-destructive',
            field.value && disabled && 'top-0 left-1.5 text-xs',
            disabled && 'opacity-70',
          )}
        >
          {label}
        </span>
      </div>

      {fieldState.error && (
        <span className="text-destructive relative left-1 inline-block text-xs leading-tight italic">
          {fieldState.error.message}
        </span>
      )}
    </div>
  );
}
