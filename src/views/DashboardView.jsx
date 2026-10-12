import React from 'react';
import { 
  Grid2X2, 
  CircleDollarSign, 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  ArrowUpRight, 
  ShoppingBag,
  Users,
  Plus,
  Play,
  Receipt,
  MinusCircle,
  CheckCircle2,
  Package,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useBillar } from '../context/BillarContext';

export default function DashboardView() {
  const { 
    tables, 
    shift, 
    transactions, 
    products, 
    setCurrentView,
    formatTime,
    getTableElapsedSeconds
  } = useBillar();

  const occupiedTables = tables.filter(t => t.status === 'occupied');
  const availableTables = tables.filter(t => t.status === 'available');
  const lowStockProducts = products.filter(p => Number(p.stock) <= Number(p.minStock));

  const totalSales = (shift.cashSales || 0) + (shift.yapeSales || 0) + (shift.plinSales || 0) + (shift.cardSales || 0);

  // Porcentaje de Ocupación
  const occupancyRate = Math.round((occupiedTables.length / tables.length) * 100);

  return (
    <div className="animate-fade-in" style={{ padding: '20px 24px' }}>
      {/* Saludo y Resumen */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-charcoal)', margin: 0 }}>
            Panel de Control y Operaciones en Vivo
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Visión ejecutiva de la sala, ocupación de mesas de billar y flujo financiero en tiempo real.
          </p>
        </div>

        {/* Acciones Rápidas */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            type="button"
            className="btn btn-secondary modal-btn"
            onClick={() => setCurrentView('pos')}
            style={{ gap: '6px' }}
          >
            <ShoppingBag size={16} />
            <span>Venta Rápida POS</span>
          </button>
          <button 
            type="button"
            className="btn btn-primary modal-btn"
            onClick={() => setCurrentView('tables')}
            style={{ gap: '6px' }}
          >
            <Play size={16} fill="currentColor" />
            <span>Gestionar Mesas ({occupiedTables.length} Activas)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {/* KPI 1: Mesas Activas */}
        <div 
          className="card" 
          onClick={() => setCurrentView('tables')}
          style={{ cursor: 'pointer', transition: 'all 0.18s ease' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
              OCUPACIÓN DE SALA
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--status-occupied-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--status-occupied)'
            }}>
              <Grid2X2 size={16} />
            </div>
          </div>
          <div className="font-display tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
            {occupiedTables.length} / {tables.length} Mesas
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--status-available)', fontWeight: 700 }}>
              {availableTables.length} libres ({occupancyRate}% uso)
            </span>
            <ChevronRight size={14} color="var(--text-muted)" />
          </div>
        </div>

        {/* KPI 2: Ingresos del Turno */}
        <div 
          className="card" 
          onClick={() => setCurrentView('cash')}
          style={{ cursor: 'pointer', transition: 'all 0.18s ease' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
              INGRESOS DEL TURNO
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(156, 86, 75, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-terracotta)'
            }}>
              <CircleDollarSign size={16} />
            </div>
          </div>
          <div className="font-display tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-terracotta)' }}>
            S/ {totalSales.toFixed(2)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Caja: {shift.cashierName}
            </span>
            <ChevronRight size={14} color="var(--text-muted)" />
          </div>
        </div>

        {/* KPI 3: Transacciones */}
        <div 
          className="card" 
          onClick={() => setCurrentView('history')}
          style={{ cursor: 'pointer', transition: 'all 0.18s ease' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
              OPERACIONES TOTALES
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-canvas)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-charcoal)'
            }}>
              <ShoppingBag size={16} />
            </div>
          </div>
          <div className="font-display tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
            {transactions.length}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Partidas + Ventas barra
            </span>
            <ChevronRight size={14} color="var(--text-muted)" />
          </div>
        </div>

        {/* KPI 4: Alertas de Stock */}
        <div 
          className="card" 
          onClick={() => setCurrentView('inventory')}
          style={{
            cursor: 'pointer',
            transition: 'all 0.18s ease',
            backgroundColor: lowStockProducts.length ? 'rgba(185, 56, 56, 0.04)' : 'var(--surface-card)',
            borderColor: lowStockProducts.length ? 'var(--status-danger)' : 'var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{
              fontSize: '0.78rem',
              color: lowStockProducts.length ? 'var(--status-danger)' : 'var(--text-muted)',
              fontWeight: 800,
              textTransform: 'uppercase'
            }}>
              ALERTAS DE STOCK
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: lowStockProducts.length ? 'rgba(185, 56, 56, 0.15)' : 'var(--status-available-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: lowStockProducts.length ? 'var(--status-danger)' : 'var(--status-available)'
            }}>
              <AlertCircle size={16} />
            </div>
          </div>
          <div className="font-display tabular-nums" style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: lowStockProducts.length ? 'var(--status-danger)' : 'var(--status-available)'
          }}>
            {lowStockProducts.length}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <span style={{ fontSize: '0.76rem', color: lowStockProducts.length ? 'var(--status-danger)' : 'var(--status-available)', fontWeight: 700 }}>
              {lowStockProducts.length ? 'Productos por reabastecer' : 'Stock en niveles óptimos'}
            </span>
            <ChevronRight size={14} color="var(--text-muted)" />
          </div>
        </div>
      </div>

      {/* Grid 2 Columnas: Estado de Mesas & Transacciones */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {/* Mesas Activas en Vivo */}
        <div className="card">
          <div className="card-header" style={{ marginBottom: '16px' }}>
            <div>
              <h3 className="card-title">Distribución de Mesas en Sala (6 Mesas)</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                4 Mesas Pool + 2 Mesas de Billar Francés
              </span>
            </div>
            <button 
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentView('tables')}
              style={{ gap: '4px' }}
            >
              <span>Ver Sala</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
            {tables.map(table => {
              const isOccupied = table.status === 'occupied';
              const isPending = table.status === 'pending';
              const isAvailable = table.status === 'available';

              return (
                <div
                  key={table.id}
                  onClick={() => setCurrentView('tables')}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-canvas)',
                    border: '1px solid',
                    borderColor: isOccupied ? 'var(--status-occupied-border)' : 'var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--color-charcoal)' }}>{table.name}</strong>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: isOccupied ? 'var(--status-occupied)' : isPending ? 'var(--status-pending)' : 'var(--status-available)'
                    }} />
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    {table.type}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                    <span style={{
                      fontWeight: 700,
                      color: isOccupied ? 'var(--status-occupied)' : 'var(--status-available)'
                    }}>
                      {isOccupied ? 'Ocupada' : 'Disponible'}
                    </span>
                    <span className="tabular-nums font-mono" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {isOccupied ? formatTime(getTableElapsedSeconds(table)) : `S/ ${table.pricePerHour}/h`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Últimas Transacciones */}
        <div className="card">
          <div className="card-header" style={{ marginBottom: '16px' }}>
            <div>
              <h3 className="card-title">Últimos Movimientos del Turno</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Cobros de mesas, comandas POS y egresos
              </span>
            </div>
            <button 
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentView('history')}
              style={{ gap: '4px' }}
            >
              <span>Historial</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '290px', overflowY: 'auto' }}>
            {transactions.slice(0, 5).map(trx => {
              const isNegative = trx.amount < 0;

              return (
                <div 
                  key={trx.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-canvas)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1, paddingRight: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '0.84rem', color: 'var(--color-charcoal)' }}>{trx.id}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{trx.time}</span>
                    </div>
                    <div style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {trx.description}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div className="tabular-nums font-display" style={{
                      fontWeight: 800,
                      fontSize: '0.94rem',
                      color: isNegative ? 'var(--status-danger)' : 'var(--color-charcoal)'
                    }}>
                      {isNegative ? `-S/ ${Math.abs(trx.amount).toFixed(2)}` : `S/ ${trx.amount.toFixed(2)}`}
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      color: isNegative ? 'var(--status-danger)' : 'var(--color-terracotta)',
                      fontWeight: 700
                    }}>
                      {trx.method}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
