import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type DrawerProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
};

export function Drawer({
  open,
  title,
  description,
  onClose,
  children,
}: DrawerProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="overlay overlay--drawer" onMouseDown={onClose}>
      <aside
        className="ui-drawer"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="ui-drawer__header">
          <div>
            <h3>{title}</h3>
            {description ? <p>{description}</p> : null}
          </div>
          <button className="ui-icon-button" type="button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="ui-drawer__body">{children}</div>
      </aside>
    </div>,
    document.body,
  );
}
