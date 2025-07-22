import { Control, FieldValues, Path, useController } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';

interface SelectItem {
  label: string;
  value?: string;
}

interface InputSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  items: SelectItem[];
  filterable?: boolean;
  disabled?: boolean;
}

export function InputSelect<T extends FieldValues>({
  name,
  control,
  label,
  items,
  filterable,
  disabled,
}: InputSelectProps<T>) {
  const Component = filterable ? FilterableSelect : DefaultSelect;

  return (
    <Component
      name={name}
      control={control}
      label={label}
      items={items}
      disabled={disabled}
    />
  );
}

function DefaultSelect<T extends FieldValues>({
  name,
  control,
  label,
  items,
  disabled = false,
}: InputSelectProps<T>) {
  const { field, fieldState } = useController({
    name,
    control,
  });

  const [isSelecting, setIsSelecting] = useState(false);

  const { value, onChange } = field;
  const { error } = fieldState;

  const hasValue = !!value;
  const hasError = !!error;
  const shouldDisplayError = !!(hasError && error.message);

  function clearSelection() {
    onChange('');
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

      <Select
        value={value ?? ''}
        onValueChange={onChange}
        onOpenChange={setIsSelecting}
      >
        <SelectTrigger
          aria-invalid={hasError}
          className="relative w-full border-zinc-50 shadow-sm"
          disabled={disabled}
        >
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {items.map(({ label, value }) => (
            <SelectItem key={label} value={value ?? label}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {value && (
        <Button
          variant="custom"
          className="absolute top-3 right-10 h-fit"
          onClick={clearSelection}
          disabled={disabled}
        >
          <XIcon className="size-3 text-zinc-500/80" strokeWidth={3} />
        </Button>
      )}

      {shouldDisplayError && (
        <span className="text-destructive inline-block text-xs leading-snug">
          {error.message}
        </span>
      )}
    </div>
  );
}

function FilterableSelect<T extends FieldValues>({
  name,
  control,
  label,
  items,
  disabled = false,
}: InputSelectProps<T>) {
  const { field, fieldState } = useController({
    name,
    control,
  });
  const [query, setQuery] = useState('');
  const [isSelecting, setIsSelecting] = useState(false);

  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()),
      ),
    [items, query],
  );

  const { value, onChange } = field;
  const { error } = fieldState;

  const hasValue = !!value;
  const hasError = !!error;
  const shouldDisplayError = !!(hasError && error.message);

  function clearSelection() {
    onChange('');
  }

  return (
    <div className="relative">
      <span
        className={cn(
          'pointer-events-none absolute top-4.5 left-1 z-10 -translate-y-1/2 bg-white px-2 text-sm text-zinc-700 transition-all peer-valid:top-0 peer-valid:left-1.5 peer-valid:text-xs',
          (isSelecting || hasValue) && 'top-0 left-1.5 text-xs',
          hasError && 'text-destructive',
          disabled && 'opacity-70',
        )}
      >
        {label}
      </span>

      <Popover open={isSelecting} onOpenChange={setIsSelecting}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isSelecting}
            className={cn(
              'relative flex w-full items-center justify-start border-zinc-100 font-normal shadow-sm hover:bg-transparent',
              hasError && 'border-destructive',
            )}
            disabled={disabled}
          >
            {value && items.find((item) => item.value === value)?.label}
            <ChevronsUpDownIcon className="absolute right-3 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="p-0">
          <Command shouldFilter={false}>
            <CommandInput
              value={query}
              placeholder="Filtrar por nome ..."
              className="h-9"
              onValueChange={setQuery}
            />

            <CommandList>
              <CommandEmpty>Sem correspondência</CommandEmpty>

              <CommandGroup>
                {filteredItems.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      onChange(
                        currentValue === value ? undefined : currentValue,
                      );
                      setIsSelecting(false);
                      setQuery('');
                    }}
                  >
                    {item.label}
                    <CheckIcon
                      className={cn(
                        'ml-auto',
                        value === item.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {value && (
        <Button
          variant="custom"
          className="absolute top-3 right-10 h-fit"
          onClick={clearSelection}
          disabled={disabled}
        >
          <XIcon className="size-3 text-zinc-500/80" strokeWidth={3} />
        </Button>
      )}

      {shouldDisplayError && (
        <span className="text-destructive inline-block text-xs leading-snug">
          {error.message}
        </span>
      )}
    </div>
  );
}
