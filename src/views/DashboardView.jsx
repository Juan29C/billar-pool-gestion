import React from 'react';
import { 
  Grid2X2, 
  CircleDollarSign, 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  ArrowUpRight, 
  ShoppingBag,
  Users
} from 'lucide-react';
import { useBillar } from '../context/BillarContext';

export default function DashboardView() {
  const { tables, shift, transactions, products, setCurrentView } = useBillar();

  const occupiedTables = tables.filter(t => t.status === 'occupied');
  const availableTables = tables.filter(t => t.status === 'available');
  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  const totalSales = shift.cashSales + shift.yapeSales + shift.plinSales + shift.cardSales;

  return (
    <div className="animate-fade-in" style={{ padding: '24px 28px' }}>
      {/* Saludo y Resumen */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
          Panel de Control y Operaciones
        </h2>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          Bienvenido al centro de operaciones. Resumen ejecutivo de la sala y flujo en tiempo real.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* KPI 1: Mesas Activas */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--status-occupied-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--status-occupied)'
          }}>
            <Grid2X2 size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              MESAS EN JUEGO
            </span>
            <div className="font-display tabular-nums" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
              {occupiedTables.length} / {tables.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--status-available)', fontWeight: 600 }}>
              {availableTables.length} mesas libres ahora
            </span>
          </div>
        </div>

        {/* KPI 2: Ingresos del Turno */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--terracotta-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-terracotta)'
          }}>
            <CircleDollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              INGRESOS DEL TURNO
            </span>
            <div className="font-display tabular-nums" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
              S/ {totalSales.toFixed(2)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-terracotta)', fontWeight: 600 }}>
              Efectivo + Billeteras + Tarjetas
            </span>
          </div>
        </div>

        {/* KPI 3: Transacciones */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--surface-hover)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-charcoal)'
          }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              VENTAS REALIZADAS
            </span>
            <div className="font-display tabular-nums" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
              {transactions.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Turno de {shift.cashierName}
            </span>
          </div>
        </div>

        {/* KPI 4: Alertas de Stock */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: lowStockProducts.length ? 'var(--status-danger-bg)' : 'var(--status-available-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: lowStockProducts.length ? 'var(--status-danger)' : 'var(--status-available)'
          }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              ALERTAS DE STOCK
            </span>
            <div className="font-display tabular-nums" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
              {lowStockProducts.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: lowStockProducts.length ? 'var(--status-danger)' : 'var(--status-available)', fontWeight: 600 }}>
              {lowStockProducts.length ? 'Productos por reabastecer' : 'Stock en niveles óptimos'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid 2 Columnas: Estado de Mesas & Actividad Reciente */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px'
      }}>
        {/* Mesas Activas en Vivo */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Partidas Activas en Sala</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Mesas que están acumulando tiempo en este instante
              </span>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentView('tables')}
            >
              <span>Ver Sala Completa</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {occupiedTables.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                No hay partidas activas en este momento.
              </div>
            ) : (
              occupiedTables.map(t => (
                <div 
                  key={t.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-canvas)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div>
                    <strong style={{ color: 'var(--color-charcoal)' }}>{t.name}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {t.type} • {t.players || 'Cliente'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-occupied">
                      <span className="badge-dot" />
                      En Juego
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-terracotta)', fontWeight: 700, marginTop: '2px' }}>
                      S/ {t.pricePerHour.toFixed(2)}/h
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actividad Reciente / Ventas */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Últimas Transacciones</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Cobros y movimientos registrados en el turno
              </span>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentView('history')}
            >
              <span>Ver Historial</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {transactions.slice(0, 4).map(trx => (
              <div 
                key={trx.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-canvas)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--color-charcoal)' }}>{trx.id}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{trx.time}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {trx.description}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="tabular-nums font-display" style={{ fontWeight: 700, color: 'var(--color-charcoal)' }}>
                    S/ {trx.amount.toFixed(2)}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-terracotta)', fontWeight: 600 }}>
                    {trx.method}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
