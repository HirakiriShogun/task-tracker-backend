import type { ReactNode } from 'react';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
}: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div className="section-header__copy">
        {eyebrow ? <span className="section-header__eyebrow">{eyebrow}</span> : null}
        <h2 className="section-header__title">{title}</h2>
        {description ? (
          <p className="section-header__description">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="section-header__actions">{actions}</div> : null}
    </div>
  );
}
