import React from 'react';
import { Clock, PlusCircle, ShoppingBag, Menu } from 'lucide-react';
import { useBillar } from '../context/BillarContext';

export default function Topbar({ onToggleMobileSidebar }) {
  const { currentView, setCurrentView, tables, shift } = useBillar();

  const occupiedCount = tables.filter(t => t.status === 'occupied').length;
  const availableCount = tables.filter(t => t.status === 'available').length;
  const totalSales = shift.cashSales + shift.yapeSales + shift.plinSales + shift.cardSales;

  const titles = {
    dashboard: 'Dashboard Operativo',
    tables: 'Gestión de Mesas y Cronómetros',
    pos: 'Punto de Venta (POS)',
    inventory: 'Control de Inventario y Almacén',
    cash: 'Caja, Turnos y Arqueo',
    history: 'Historial de Operaciones',
    reports: 'Reportes y Métricas Comerciales',
    settings: 'Configuración y Tarifas',
    public: 'Vista Pública de Pantalla'
  };

  const currentDateStr = new Intl.DateTimeFormat('es-PE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date());

  return (
    <header className="topbar-header" style={{
      minHeight: 'var(--topbar-height)',
      backgroundColor: 'var(--surface-card)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      {/* Title & Mobile Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Botón Hamburguesa Móvil */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          aria-label="Abrir menú de navegación"
          className="mobile-menu-btn"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'var(--color-charcoal)',
            margin: 0,
            lineHeight: 1.2
          }}>
            {titles[currentView] || 'Club LIVERPOOL'}
          </h1>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Club LIVERPOOL — Billiards & Lounge
          </span>
        </div>
      </div>

      {/* Quick Indicators & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        {/* Live Counters */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--bg-canvas)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.82rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-available)'
            }} />
            <span style={{ color: 'var(--text-secondary)' }}>
              <strong>{availableCount}</strong> Libres
            </span>
          </div>

          <span style={{ color: 'var(--border-medium)' }}>|</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-occupied)'
            }} />
            <span style={{ color: 'var(--text-secondary)' }}>
              <strong>{occupiedCount}</strong> En Juego
            </span>
          </div>

          <span style={{ color: 'var(--border-medium)' }}>|</span>

          <div style={{ color: 'var(--color-terracotta)', fontWeight: 700 }}>
            Ventas: S/ {totalSales.toFixed(2)}
          </div>
        </div>

        {/* Date / Time (Ocultable en pantallas muy pequeñas) */}
        <div className="topbar-date" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-muted)',
          fontSize: '0.82rem',
          fontWeight: 500
        }}>
          <Clock size={15} />
          <span style={{ textTransform: 'capitalize' }}>{currentDateStr}</span>
        </div>

        {/* Action Button */}
        {currentView !== 'tables' && (
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setCurrentView('tables')}
          >
            <PlusCircle size={15} />
            <span>Mesas</span>
          </button>
        )}

        {currentView !== 'pos' && (
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setCurrentView('pos')}
          >
            <ShoppingBag size={15} />
            <span>Nueva Venta</span>
          </button>
        )}
      </div>
    </header>
  );
}
