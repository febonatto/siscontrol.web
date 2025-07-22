import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { useState } from 'react';

interface InputDateProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  viewMode?: boolean;
  disabled?: boolean;
}

export function InputDate<T extends FieldValues>({
  name,
  control,
  label,
  viewMode = false,
  disabled = false,
}: InputDateProps<T>) {
  const { field, fieldState } = useController({
    name,
    control,
  });

  const [isSelecting, setIsSelecting] = useState(false);

  const { value, onChange } = field;
  const { error } = fieldState;
  const shouldShowDate = !!value;
  const hasValue = !!value;
  const hasError = !!error;
  const shouldDisplayError = !!(hasError && error.message);

  function handleChange(date: Date | undefined) {
    if (viewMode) {
      return;
    }

    onChange(date);
  }

  function handleOpenPopover() {
    if (viewMode) {
      return;
    }

    setIsSelecting(true);
  }

  return (
    <div className="relative space-y-1.5">
      <span
        className={cn(
          'pointer-events-none absolute top-4.5 left-1 z-10 -translate-y-1/2 bg-white px-2 text-sm text-zinc-700 transition-all peer-valid:top-0 peer-valid:left-1.5 peer-valid:text-xs',
          hasError && 'text-destructive',
          hasValue && 'top-0 left-1.5 text-xs',
          isSelecting && 'top-0 left-1.5 text-xs',
          disabled && 'opacity-70',
        )}
      >
        {label}
      </span>

      <Popover onOpenChange={setIsSelecting}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start border-zinc-50 pl-3 text-left font-normal shadow-sm hover:bg-white',
              !value && 'text-muted-foreground',
              error && 'text-destructive border-destructive',
              viewMode && 'pointer-events-none !opacity-100',
            )}
            onClick={handleOpenPopover}
            disabled={disabled}
          >
            <CalendarIcon
              size={12}
              strokeWidth={2}
              className={cn(
                'absolute right-3.5 text-zinc-600',
                disabled && 'opacity-0',
              )}
            />

            {shouldShowDate && <span>{format(value, 'dd/MM/yyyy')}</span>}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={value} onSelect={handleChange} />
        </PopoverContent>
      </Popover>

      {shouldDisplayError && (
        <span className="text-destructive inline-block text-xs leading-snug">
          {error.message}
        </span>
      )}
    </div>
  );
}
