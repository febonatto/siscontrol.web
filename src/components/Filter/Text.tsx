import { SearchIcon } from 'lucide-react';
import { ChangeEvent } from 'react';

interface FilterTextProps {
  placeholder?: string;
  handleChange: (value: string) => void;
}

export function FilterText({
  placeholder = 'Filtrar por texto ...',
  handleChange,
}: FilterTextProps) {
  function changeEvent(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    handleChange(value);
  }

  return (
    <div className="relative h-9 w-full rounded-md border border-zinc-100 shadow-sm transition-all">
      <input
        className="peer h-full w-full px-4 pr-10 text-sm outline-none placeholder:opacity-0"
        type="text"
        placeholder={placeholder}
        onChange={changeEvent}
        required
      />

      <SearchIcon
        size={16}
        className="absolute top-1/2 right-4 -translate-y-1/2"
      />

      <span className="pointer-events-none absolute top-1/2 left-1 -translate-y-1/2 bg-white px-2 text-sm text-zinc-700 transition-all peer-valid:-top-0.5 peer-valid:left-2 peer-valid:text-xs peer-focus:-top-0.5 peer-focus:left-2 peer-focus:text-xs">
        {placeholder}
      </span>
    </div>
  );
}
