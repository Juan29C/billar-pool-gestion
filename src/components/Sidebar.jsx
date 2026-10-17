import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Grid2X2, 
  ShoppingCart, 
  Package, 
  Wallet, 
  History, 
  BarChart3, 
  Settings, 
  Tv,
  CircleDot,
  PanelLeftClose,
  PanelLeftOpen,
  X
} from 'lucide-react';
import { useBillar } from '../context/BillarContext';

export default function Sidebar({ onNavClick }) {
  const { currentView, setCurrentView, shift, tables } = useBillar();

  // Detección de dispositivo móvil / pantalla menor a 900px
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 900;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Estado colapsado / comprimido para desktop
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('billar_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('billar_sidebar_collapsed', String(next));
      return next;
    });
  };

  // En móvil el drawer nunca debe colapsarse en franja de solo iconos; debe mostrar el menú completo
  const effectiveCollapsed = isMobile ? false : isCollapsed;
  const sidebarWidth = effectiveCollapsed ? '74px' : (isMobile ? '280px' : '260px');

  const occupiedCount = tables.filter(t => t.status === 'occupied').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tables', label: 'Mesas de Billar', icon: Grid2X2, badge: occupiedCount ? `${occupiedCount}` : null },
    { id: 'pos', label: 'Punto de Venta', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventario', icon: Package },
    { id: 'cash', label: 'Caja y Turnos', icon: Wallet },
    { id: 'history', label: 'Historial', icon: History },
    { id: 'reports', label: 'Reportes', icon: BarChart3 },
    { id: 'settings', label: 'Configuración', icon: Settings },
    { id: 'public', label: 'Pantalla Vertical', icon: Tv, isSpecial: true }
  ];

  return (
    <aside style={{
      width: sidebarWidth,
      maxWidth: '85vw',
      backgroundColor: 'var(--surface-dark)',
      borderRight: '1px solid var(--border-dark)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100%',
      minHeight: '100dvh',
      color: 'var(--text-on-dark)',
      transition: 'width 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
      overflowX: 'hidden'
    }}>
      {/* Brand Header */}
      <div style={{
        padding: effectiveCollapsed ? '20px 0' : '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: effectiveCollapsed ? 'center' : 'space-between',
        borderBottom: '1px solid var(--surface-dark-soft)',
        minHeight: '74px',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          {/* Imagotipo: Bola 8 Estilizada */}
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: 'var(--color-terracotta)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(156, 86, 75, 0.4)',
            flexShrink: 0
          }} title="Billar Club & Lounge">
            <CircleDot size={22} strokeWidth={2.5} />
          </div>

          {!effectiveCollapsed && (
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.2,
                letterSpacing: '0.02em',
                margin: 0
              }}>
                BILLAR CLUB
              </h2>
              <span style={{
                fontSize: '0.72rem',
                color: 'var(--text-on-dark-subtle)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 600
              }}>
                Lounge & Management
              </span>
            </div>
          )}
        </div>

        {/* Botón Cerrar visible únicamente en vista móvil */}
        {isMobile && onNavClick && (
          <button
            type="button"
            onClick={onNavClick}
            aria-label="Cerrar menú lateral"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'rgba(255,255,255,0.08)',
              color: 'var(--text-on-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background-color 0.15s ease'
            }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation List — Enlaces <a> nativos con soporte táctil y click */}
      <nav style={{
        padding: effectiveCollapsed ? '16px 8px' : '16px 12px',
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                // Compatible con clic táctil y clicks primarios de mouse
                if (!e.ctrlKey && !e.metaKey && (e.button === 0 || e.button === undefined)) {
                  e.preventDefault();
                  setCurrentView(item.id);
                  if (onNavClick) onNavClick();
                }
              }}
              title={effectiveCollapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: effectiveCollapsed ? 'center' : 'space-between',
                padding: effectiveCollapsed ? '12px 0' : '12px 14px',
                minHeight: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'var(--color-terracotta)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-on-dark-muted)',
                textDecoration: 'none',
                cursor: 'pointer',
                width: '100%',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.92rem',
                transition: 'all var(--transition-fast)',
                boxShadow: isActive ? '0 4px 12px rgba(156, 86, 75, 0.35)' : 'none',
                position: 'relative',
                WebkitTapHighlightColor: 'transparent',
                userSelect: 'none'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--surface-dark-soft)';
                  e.currentTarget.style.color = '#FFFFFF';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-on-dark-muted)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={20} color={isActive ? '#FFFFFF' : (item.isSpecial ? 'var(--color-terracotta)' : 'currentColor')} />
                {!effectiveCollapsed && <span>{item.label}</span>}
              </div>

              {/* Badge */}
              {item.badge && (
                effectiveCollapsed ? (
                  <span style={{
                    position: 'absolute',
                    top: '6px',
                    right: '10px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? '#FFFFFF' : 'var(--status-occupied)',
                    boxShadow: '0 0 0 2px var(--surface-dark)'
                  }} />
                ) : (
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'var(--status-occupied-bg)',
                    color: isActive ? '#FFFFFF' : 'var(--status-occupied)',
                    fontWeight: 800
                  }}>
                    {item.badge} activas
                  </span>
                )
              )}
            </a>
          );
        })}
      </nav>

      {/* Footer: Turno y Botón de Colapsar */}
      <div style={{
        padding: effectiveCollapsed ? '12px 6px' : '14px 18px',
        backgroundColor: 'var(--surface-dark-soft)',
        borderTop: '1px solid var(--border-dark)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {!effectiveCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--status-available)',
                display: 'inline-block'
              }} className="pulse-indicator" />
              <span style={{ color: 'var(--text-on-dark-muted)', fontWeight: 600 }}>Turno Abierto</span>
            </div>
            <span style={{ color: 'var(--color-terracotta)', fontWeight: 700 }}>
              {shift.cashierName}
            </span>
          </div>
        )}

        {/* Botón Toggle Comprimir/Expandir (Solo visible en Desktop) */}
        {!isMobile && (
          <button
            type="button"
            onClick={toggleCollapse}
            aria-label={effectiveCollapsed ? 'Expandir barra lateral' : 'Comprimir barra lateral'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: effectiveCollapsed ? 'center' : 'space-between',
              padding: '8px 10px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: 'none',
              color: 'var(--text-on-dark-muted)',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 600,
              width: '100%',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.color = 'var(--text-on-dark-muted)';
            }}
          >
            {!effectiveCollapsed && <span>Comprimir menú</span>}
            {effectiveCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={16} />}
          </button>
        )}
      </div>
    </aside>
  );
}
