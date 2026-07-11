import './ConfirmModal.css';

const icons = {
  danger: (
    <>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </>
  ),
  success: <path d="M20 6 9 17l-5-5" />,
  warning: (
    <>
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    </>
  ),
};

function ConfirmModal({
  variant = 'danger',
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  singleAction = false,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className={`confirm-modal confirm-${variant}`} onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {icons[variant]}
          </svg>
        </div>

        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>

        <div className="confirm-actions">
          {!singleAction && (
            <button type="button" className="confirm-btn confirm-btn-ghost" onClick={onCancel}>
              {cancelLabel}
            </button>
          )}
          <button type="button" className={`confirm-btn confirm-btn-${variant}`} onClick={onConfirm} autoFocus>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
