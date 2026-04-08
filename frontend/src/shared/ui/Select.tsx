import type { SelectHTMLAttributes } from 'react';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export function Select({
  className = '',
  label,
  children,
  ...props
}: SelectProps) {
  return (
    <label className="ui-field">
      {label ? <span className="ui-field__label">{label}</span> : null}
      <select className={`ui-select ${className}`.trim()} {...props}>
        {children}
      </select>
    </label>
  );
}
