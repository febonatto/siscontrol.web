import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { ChangeEvent } from 'react';

interface InputTextProps<T extends FieldValues>
  extends Omit<React.ComponentProps<'input'>, 'name'> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  maxLength?: number;
  onlyNumbers?: boolean;
  viewMode?: boolean;
  applyMask?: (value: string) => string;
}

export function InputText<T extends FieldValues>({
  name,
  control,
  label,
  maxLength,
  onlyNumbers = false,
  viewMode = false,
  applyMask,
  type = 'text',
  disabled = false,
  className,
  ...props
}: InputTextProps<T>) {
  const { field, fieldState } = useController({
    name,
    control,
  });

  const { value, onChange } = field;
  const { error } = fieldState;
  const hasValue = !!value;
  const hasError = !!error;
  const shouldDisplayError = !!(hasError && error.message);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (viewMode) {
      return;
    }

    let { value } = event.target;
    if (onlyNumbers) {
      value = value.replace(/(?!^)-|[^\d-.]/g, '');
    }
    if (applyMask) {
      value = applyMask(value);
    }
    if (maxLength) {
      value = value.slice(0, maxLength);
    }

    onChange(value);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <Input
          id={name}
          value={value}
          type={type}
          disabled={disabled}
          aria-invalid={hasError}
          className={cn(
            'peer disabled:pointer-events-auto disabled:cursor-not-allowed',
            hasError && 'border-destructive',
            viewMode && 'pointer-events-none',
            className,
          )}
          onChange={handleInputChange}
          required
          {...props}
        />

        <span
          className={cn(
            'pointer-events-none absolute top-1/2 left-1 -translate-y-1/2 bg-white px-2 text-sm text-zinc-700 transition-all peer-valid:top-0 peer-valid:left-1.5 peer-valid:text-xs peer-focus:top-0 peer-focus:left-1.5 peer-focus:text-xs',
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
