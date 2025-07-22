import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { useState } from 'react';

interface FilterDateProps {
  placeholder: string;
  value: Date | undefined;
  handleChange: (value: Date | undefined) => void;
}

export function FilterDate({
  placeholder,
  value,
  handleChange,
}: FilterDateProps) {
  const [isSelecting, setIsSelecting] = useState(false);

  const shouldShowDate = !!value;

  return (
    <div className="relative space-y-1.5">
      <span
        className={cn(
          'pointer-events-none absolute top-4.5 left-1 z-10 -translate-y-1/2 bg-white px-2 text-sm text-zinc-700 transition-all peer-valid:top-0 peer-valid:left-1.5 peer-valid:text-xs',
          (isSelecting || value) && 'top-0 left-1.5 text-xs',
        )}
      >
        {placeholder}
      </span>

      <Popover onOpenChange={setIsSelecting}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start border-zinc-50 pl-3 text-left font-normal shadow-sm hover:bg-white',
            )}
          >
            <CalendarIcon
              size={12}
              strokeWidth={2}
              className="absolute right-3.5 text-zinc-600"
            />

            {shouldShowDate && <span>{format(value, 'dd/MM/yyyy')}</span>}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleChange}
            disabled={(date) => date > new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
