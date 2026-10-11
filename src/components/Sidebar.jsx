import React from 'react';
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
  LogOut
} from 'lucide-react';
import { useBillar } from '../context/BillarContext';

export default function Sidebar() {
  const { currentView, setCurrentView, shift, tables } = useBillar();

  const occupiedCount = tables.filter(t => t.status === 'occupied').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tables', label: 'Mesas de Billar', icon: Grid2X2, badge: occupiedCount ? `${occupiedCount} activas` : null },
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
      width: 'var(--sidebar-width)',
      backgroundColor: 'var(--surface-dark)',
      borderRight: '1px solid var(--border-dark)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      color: 'var(--text-on-dark)'
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '24px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid var(--surface-dark-soft)'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          backgroundColor: 'var(--color-terracotta)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 4px 12px rgba(156, 86, 75, 0.4)'
        }}>
          <CircleDot size={22} strokeWidth={2.5} />
        </div>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.15rem',
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1.2,
            letterSpacing: '0.02em'
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
      </div>

      {/* Navigation List */}
      <nav style={{
        padding: '16px 12px',
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'var(--color-terracotta)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-on-dark-muted)',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                transition: 'all var(--transition-fast)',
                boxShadow: isActive ? '0 4px 12px rgba(156, 86, 75, 0.35)' : 'none'
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
                <Icon size={19} color={isActive ? '#FFFFFF' : (item.isSpecial ? 'var(--color-terracotta)' : 'currentColor')} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'var(--status-occupied-bg)',
                  color: isActive ? '#FFFFFF' : 'var(--status-occupied)',
                  fontWeight: 700
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Shift & User Footer */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: 'var(--surface-dark-soft)',
        borderTop: '1px solid var(--border-dark)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: shift.isOpen ? 'var(--status-available)' : 'var(--status-danger)',
              display: 'inline-block'
            }} className="pulse-indicator" />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-on-dark-muted)', fontWeight: 600 }}>
              Turno Abierto
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-terracotta)', fontWeight: 700 }}>
            {shift.cashierName}
          </span>
        </div>
        <div style={{
          fontSize: '0.72rem',
          color: 'var(--text-on-dark-subtle)',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>Caja Inicial:</span>
          <span className="tabular-nums" style={{ color: '#FFFFFF', fontWeight: 600 }}>S/ {shift.initialCash.toFixed(2)}</span>
        </div>
      </div>
    </aside>
  );
}
