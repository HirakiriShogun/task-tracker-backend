import type { PropsWithChildren } from 'react';

type ModalProps = PropsWithChildren<{
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  mode?: 'center' | 'side';
}>;

export function Modal({
  open,
  title,
  description,
  onClose,
  mode = 'center',
  children,
}: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="ui-modal-root" onClick={onClose}>
      <div
        className={`ui-modal ui-modal--${mode}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="ui-modal__header">
          <div>
            <h3 className="ui-modal__title">{title}</h3>
            {description ? (
              <p className="ui-modal__description">{description}</p>
            ) : null}
          </div>
          <button className="ui-icon-button" onClick={onClose} type="button">
            ✕
          </button>
        </div>
        <div className="ui-modal__content">{children}</div>
      </div>
    </div>
  );
}
