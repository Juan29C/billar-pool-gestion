import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/**
 * Componente Modal Reutilizable y Estandarizado — Billar Club & Lounge
 * Implementado con createPortal para renderizarse directamente en document.body,
 * garantizando centrado absoluto en viewport sin verse afectado por transforms o scroll de vistas.
 */
export default function Modal({
  isOpen = true,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  footer,
  maxWidth = '560px',
  maxHeight = 'min(92vh, 840px)',
  danger = false
}) {
  // Manejo de tecla Escape y bloqueo de scroll de fondo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalNode = (
    <div 
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--surface-card)',
          borderRadius: '16px',
          border: '1px solid #3E3531',
          boxShadow: '0 24px 60px rgba(10, 8, 7, 0.55), 0 4px 16px rgba(0, 0, 0, 0.3)',
          width: '100%',
          maxWidth,
          display: 'flex',
          flexDirection: 'column',
          maxHeight,
          overflow: 'hidden',
          animation: 'modalSlideUp 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* --- CABECERA NOCTURNA ESTILO BILLAR CLUB (#2B2725) --- */}
        <div style={{
          padding: '14px 22px',
          backgroundColor: 'var(--surface-dark)',
          borderBottom: '2px solid rgba(156, 86, 75, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#FFFFFF',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            {Icon && (
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: danger ? 'rgba(185, 56, 56, 0.25)' : 'rgba(156, 86, 75, 0.25)',
                color: danger ? '#FF6B6B' : 'var(--color-terracotta)',
                border: `1px solid ${danger ? '#B93838' : 'var(--color-terracotta)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={18} strokeWidth={2.2} />
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <h3 style={{
                margin: 0,
                fontSize: '1.1rem',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.2,
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.01em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {title}
              </h3>
              {subtitle && (
                <p style={{
                  margin: '2px 0 0',
                  fontSize: '0.76rem',
                  color: 'var(--text-on-dark-muted)',
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Botón de Cierre Centrado Verticalmente */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--text-on-dark-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                flexShrink: 0,
                marginLeft: '12px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = 'var(--text-on-dark-muted)';
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* --- CUERPO DEL MODAL (CON SCROLL FLUIDO INTERNO) --- */}
        <div style={{
          padding: '18px 22px',
          overflowY: 'auto',
          flex: 1
        }}>
          {children}
        </div>

        {/* --- PIE DEL MODAL (BOTONERA SIMÉTRICA DE 44PX) --- */}
        {footer && (
          <div style={{
            padding: '12px 22px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-canvas)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            flexShrink: 0
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Renderizar vía createPortal en document.body para desacoplarlo de cualquier transform o scroll de la app
  return createPortal(modalNode, document.body);
}
