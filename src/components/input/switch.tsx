import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { Switch } from '../ui/switch';
import { cn } from '@/lib/utils';

interface InputSwitchProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  disabled?: boolean;
}

export function InputSwitch<T extends FieldValues>({
  name,
  control,
  label,
  disabled,
}: InputSwitchProps<T>) {
  const { field } = useController({
    name,
    control,
  });

  const { value, onChange } = field;

  return (
    <div className="space-y-2.5">
      <span className="block text-sm text-zinc-700">{label}</span>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'text-xs font-medium text-zinc-400',
            !value && 'text-zinc-700',
          )}
        >
          Inativo
        </span>
        <Switch
          checked={value}
          onCheckedChange={onChange}
          disabled={disabled}
        />
        <span
          className={cn(
            'text-xs font-medium text-zinc-400',
            value && 'text-zinc-700',
          )}
        >
          Ativo
        </span>
      </div>
    </div>
  );
}
