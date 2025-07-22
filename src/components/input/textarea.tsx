import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { ChangeEvent } from 'react';

interface InputTextAreaProps<T extends FieldValues>
  extends Omit<React.ComponentProps<'textarea'>, 'name'> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  maxLength?: number;
  viewMode?: boolean;
}

export function InputTextArea<T extends FieldValues>({
  name,
  control,
  label,
  maxLength,
  viewMode = false,
  disabled = false,
  className,
  ...props
}: InputTextAreaProps<T>) {
  const { field, fieldState } = useController({
    name,
    control,
  });

  const { value, onChange } = field;
  const { error } = fieldState;
  const hasValue = !!value;
  const hasError = !!error;
  const shouldDisplayError = !!(hasError && error.message);

  function handleTextAreaChange(event: ChangeEvent<HTMLTextAreaElement>) {
    let { value } = event.target;

    if (viewMode) {
      return;
    }

    if (maxLength) {
      value = value.slice(0, maxLength);
    }

    onChange(value);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <textarea
          id={name}
          value={value}
          disabled={disabled}
          aria-invalid={hasError}
          className={cn(
            'peer h-30 max-h-50 min-h-10 w-full rounded-lg border border-zinc-100 px-3.5 py-1.5 shadow-md outline-none disabled:pointer-events-auto disabled:cursor-not-allowed',
            !hasValue && 'h-10',
            hasError && 'border-destructive',
            viewMode && 'pointer-events-none',
            className,
          )}
          onChange={handleTextAreaChange}
          required
          {...props}
        />

        <span
          className={cn(
            'pointer-events-none absolute top-5 left-1 -translate-y-1/2 bg-white px-2 text-sm text-zinc-700 transition-all peer-valid:top-0 peer-valid:left-1.5 peer-valid:text-xs peer-focus:top-0 peer-focus:left-1.5 peer-focus:text-xs',
            hasError && 'text-destructive',
            hasValue && disabled && 'top-0 left-1.5 text-xs',
            disabled && 'opacity-70',
          )}
        >
          {label}
        </span>
      </div>

      {shouldDisplayError && (
        <span className="text-destructive relative left-1 inline-block text-xs leading-tight italic">
          {error.message}
        </span>
      )}
    </div>
  );
}
