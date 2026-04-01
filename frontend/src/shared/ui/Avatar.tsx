import { cn } from '@/shared/lib/cn';

type AvatarProps = {
  name: string;
  size?: 'sm' | 'md';
  accent?: 'violet' | 'cyan' | 'rose';
};

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

export function Avatar({
  name,
  size = 'md',
  accent = 'violet',
}: AvatarProps) {
  return (
    <span
      className={cn(
        'ui-avatar',
        `ui-avatar--${size}`,
        `ui-avatar--${accent}`,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
