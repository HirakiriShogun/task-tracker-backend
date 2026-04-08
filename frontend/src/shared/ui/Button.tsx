import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'md' | 'sm';
    block?: boolean;
  }
>;

export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  block = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`ui-button ui-button--${variant} ui-button--${size} ${
        block ? 'ui-button--block' : ''
      } ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
