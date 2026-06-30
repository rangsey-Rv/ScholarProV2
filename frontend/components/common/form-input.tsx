
import type { Control, FieldValues, Path } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { PasswordInput } from './password-input';

type Props<T extends FieldValues> = {
  control?: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  type?: 'password' | 'text' | 'decimal';
  disabled?: boolean;
};

export default function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  disabled
}: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label === undefined ? null : label === '' ? (
            <div className="h-3.5" />
          ) : (
            <FormLabel>{label}</FormLabel>
          )}
          <FormControl>
            {type === 'password' ? (
              <PasswordInput placeholder={placeholder} {...field} />
            ) : (
              <Input placeholder={placeholder} disabled={disabled} {...field} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
