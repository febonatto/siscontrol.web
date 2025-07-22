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

function SelectComponent({
  placeholder,
  value,
  items,
  handleChange,
  disabled = false,
}: FilterSelectProps) {
  const [isSelecting, setIsSelecting] = useState(false);

  const hasValue = !!value;
  const hasItems = items.length > 0;

  function clearSelection() {
    handleChange(undefined);
  }

  return (
    <div className="relative space-y-1.5">
      <span
        className={cn(
          'pointer-events-none absolute top-4.5 left-1 z-10 -translate-y-1/2 bg-white px-2 text-sm text-zinc-700 transition-all peer-valid:top-0 peer-valid:left-1.5 peer-valid:text-xs',
          (isSelecting || hasValue) && hasItems && 'top-0 left-1.5 text-xs',
        )}
      >
        {placeholder}
      </span>

      <Select
        value={value}
        onValueChange={handleChange}
        onOpenChange={setIsSelecting}
        disabled={disabled}
      >
        <SelectTrigger className="relative w-full border-zinc-50 shadow-sm">
          <SelectValue />
        </SelectTrigger>

        <SelectContent className="relative">
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
        >
          <XIcon className="size-3 text-zinc-500/80" strokeWidth={3} />
        </Button>
      )}
    </div>
  );
}

function FilterableSelectComponent({
  placeholder,
  value,
  items,
  handleChange,
  disabled = false,
}: FilterSelectProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [query, setQuery] = useState('');

  const hasValue = !!value;
  const hasItems = items.length > 0;

  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()),
      ),
    [items, query],
  );

  function clearSelection() {
    handleChange(undefined);
  }

  return (
    <div className="relative">
      <span
        className={cn(
          'pointer-events-none absolute top-4.5 left-1 z-10 -translate-y-1/2 bg-white px-2 text-sm text-zinc-700 transition-all peer-valid:top-0 peer-valid:left-1.5 peer-valid:text-xs',
          (isSelecting || hasValue) && hasItems && 'top-0 left-1.5 text-xs',
        )}
      >
        {placeholder}
      </span>

      <Popover open={isSelecting} onOpenChange={setIsSelecting}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isSelecting}
            className="relative flex w-full items-center justify-start border-zinc-100 font-normal shadow-sm hover:bg-transparent"
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
                      handleChange(
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
        >
          <XIcon className="size-3 text-zinc-500/80" strokeWidth={3} />
        </Button>
      )}
    </div>
  );
}

interface SelectItem {
  label: string;
  value?: string;
}

interface FilterSelectProps {
  value: string | undefined;
  placeholder: string;
  items: SelectItem[];
  filterable?: boolean;
  handleChange: (value: string | undefined) => void;
  disabled?: boolean;
}

export function FilterSelect({
  placeholder,
  value,
  items,
  filterable = false,
  handleChange,
  disabled = false,
}: FilterSelectProps) {
  const Component = filterable ? FilterableSelectComponent : SelectComponent;

  return (
    <Component
      placeholder={placeholder}
      value={value}
      items={items}
      handleChange={handleChange}
      disabled={disabled}
    />
  );
}
