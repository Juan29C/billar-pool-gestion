import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import Modal from './Modal';

/**
 * Modal de Confirmación Estilizado y Reutilizable
 */
export default function ConfirmModal({
  isOpen = true,
  onClose,
  onConfirm,
  title = '¿Confirmar Acción?',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'warning', // 'warning' | 'danger' | 'info' | 'success'
  loading = false
}) {
  const iconConfig = {
    warning: { icon: AlertTriangle, color: 'var(--status-occupied)', danger: false },
    danger: { icon: AlertCircle, color: 'var(--status-danger)', danger: true },
    info: { icon: HelpCircle, color: 'var(--color-charcoal)', danger: false },
    success: { icon: CheckCircle2, color: 'var(--status-available)', danger: false }
  };

  const currentConfig = iconConfig[variant] || iconConfig.warning;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={currentConfig.icon}
      iconColor={currentConfig.color}
      danger={currentConfig.danger}
      maxWidth="460px"
      footer={
        <>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
            style={{ minHeight: '42px', padding: '0 20px' }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={currentConfig.danger ? 'btn btn-danger' : 'btn btn-primary'}
            onClick={onConfirm}
            disabled={loading}
            style={{ minHeight: '42px', padding: '0 22px' }}
          >
            {loading ? 'Procesando...' : confirmText}
          </button>
        </>
      }
    >
      <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        {message}
      </div>
    </Modal>
  );
}
