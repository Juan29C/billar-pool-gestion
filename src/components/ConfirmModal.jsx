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
    warning: { icon: AlertTriangle, danger: false, confirmBtnClass: 'btn btn-primary' },
    danger: { icon: AlertCircle, danger: true, confirmBtnClass: 'btn btn-danger' },
    info: { icon: HelpCircle, danger: false, confirmBtnClass: 'btn btn-primary' },
    success: { icon: CheckCircle2, danger: false, confirmBtnClass: 'btn btn-primary' }
  };

  const currentConfig = iconConfig[variant] || iconConfig.warning;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={currentConfig.icon}
      danger={currentConfig.danger}
      maxWidth="480px"
      footer={
        <>
          <button
            type="button"
            className="btn btn-secondary modal-btn"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`${currentConfig.confirmBtnClass} modal-btn`}
            onClick={onConfirm}
            disabled={loading}
            style={currentConfig.danger ? { backgroundColor: '#B93838', borderColor: '#B93838', color: '#FFFFFF' } : {}}
          >
            {loading ? 'Procesando...' : confirmText}
          </button>
        </>
      }
    >
      <div style={{
        fontSize: '0.94rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.55,
        padding: '4px 0'
      }}>
        {message}
      </div>
    </Modal>
  );
}
