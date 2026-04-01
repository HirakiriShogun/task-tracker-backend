import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: SelectOption[];
  placeholder?: string;
};

export function Select({
  className,
  options,
  placeholder,
  ...props
}: SelectProps) {
  return (
    <select className={cn('ui-select', className)} {...props}>
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
