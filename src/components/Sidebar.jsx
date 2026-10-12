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
  PanelLeftOpen
} from 'lucide-react';
import { useBillar } from '../context/BillarContext';

export default function Sidebar({ onNavClick }) {
  const { currentView, setCurrentView, shift, tables } = useBillar();

  // Estado colapsado / comprimido
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

  const sidebarWidth = isCollapsed ? '74px' : '260px';

  return (
    <aside style={{
      width: sidebarWidth,
      backgroundColor: 'var(--surface-dark)',
      borderRight: '1px solid var(--border-dark)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      color: 'var(--text-on-dark)',
      transition: 'width 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
      overflowX: 'hidden'
    }}>
      {/* Brand Header */}
      <div style={{
        padding: isCollapsed ? '20px 0' : '22px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        gap: '12px',
        borderBottom: '1px solid var(--surface-dark-soft)',
        minHeight: '74px'
      }}>
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

        {!isCollapsed && (
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

      {/* Navigation List — Enlaces <a> nativos con soporte de scroll-click */}
      <nav style={{
        padding: isCollapsed ? '16px 8px' : '16px 12px',
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
                // Si es clic normal (no con Ctrl ni rueda del mouse), prevenir recarga y usar navegación instantánea
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  setCurrentView(item.id);
                  if (onNavClick) onNavClick();
                }
              }}
              title={isCollapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'space-between',
                padding: isCollapsed ? '12px 0' : '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'var(--color-terracotta)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-on-dark-muted)',
                textDecoration: 'none',
                cursor: 'pointer',
                width: '100%',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                transition: 'all var(--transition-fast)',
                boxShadow: isActive ? '0 4px 12px rgba(156, 86, 75, 0.35)' : 'none',
                position: 'relative'
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
                {!isCollapsed && <span>{item.label}</span>}
              </div>

              {/* Badge */}
              {item.badge && (
                isCollapsed ? (
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
        padding: isCollapsed ? '12px 6px' : '14px 18px',
        backgroundColor: 'var(--surface-dark-soft)',
        borderTop: '1px solid var(--border-dark)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {!isCollapsed && (
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

        {/* Botón Toggle Comprimir/Expandir */}
        <button
          type="button"
          onClick={toggleCollapse}
          aria-label={isCollapsed ? 'Expandir barra lateral' : 'Comprimir barra lateral'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
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
          {!isCollapsed && <span>Comprimir menú</span>}
          {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={16} />}
        </button>
      </div>
    </aside>
  );
}
