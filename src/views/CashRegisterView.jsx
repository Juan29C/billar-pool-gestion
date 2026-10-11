import React, { useState } from 'react';
import { 
  Wallet, 
  CircleDollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Receipt
} from 'lucide-react';
import { useBillar } from '../context/BillarContext';

export default function CashRegisterView() {
  const { shift, transactions } = useBillar();

  const [countedCash, setCountedCash] = useState('');
  const [showCloseModal, setShowCloseModal] = useState(false);

  const totalSales = shift.cashSales + shift.yapeSales + shift.plinSales + shift.cardSales;
  const expectedCashInDrawer = shift.initialCash + shift.cashSales - shift.expenses;

  return (
    <div className="animate-fade-in" style={{ padding: '24px 28px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
            Caja, Turnos y Control de Efectivo
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Supervisión del turno activo, desglose por canal de pago y arqueo de caja.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setShowCloseModal(true)}
        >
          <Receipt size={16} />
          <span>Realizar Cierre de Turno</span>
        </button>
      </div>

      {/* Tarjeta de Estado del Turno */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, var(--surface-dark) 0%, var(--surface-dark-soft) 100%)',
        color: '#FFFFFF',
        padding: '24px',
        marginBottom: '24px',
        border: 'none',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: 'var(--status-available)'
              }} className="pulse-indicator" />
              <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: 'var(--color-terracotta)' }}>
                Turno en Curso
              </span>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>
              Responsable: {shift.cashierName}
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-on-dark-muted)' }}>
              Apertura: {new Date(shift.openedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Fondo inicial: S/ {shift.initialCash.toFixed(2)}
            </span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-on-dark-muted)' }}>Total Recaudado en Turno</span>
            <div className="font-display tabular-nums" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF' }}>
              S/ {totalSales.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Desglose por Método de Pago */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div className="card" style={{ padding: '18px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>
            EFECTIVO EN CAJA
          </span>
          <div className="font-display tabular-nums" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-charcoal)', marginTop: '4px' }}>
            S/ {shift.cashSales.toFixed(2)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            + S/ {shift.initialCash.toFixed(2)} fondo inicial
          </span>
        </div>

        <div className="card" style={{ padding: '18px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>
            YAPE
          </span>
          <div className="font-display tabular-nums" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7B2CBF', marginTop: '4px' }}>
            S/ {shift.yapeSales.toFixed(2)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Billetera digital directa
          </span>
        </div>

        <div className="card" style={{ padding: '18px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>
            PLIN
          </span>
          <div className="font-display tabular-nums" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0077B6', marginTop: '4px' }}>
            S/ {shift.plinSales.toFixed(2)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Billetera digital BBVA/Interbank
          </span>
        </div>

        <div className="card" style={{ padding: '18px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>
            TARJETAS (POS)
          </span>
          <div className="font-display tabular-nums" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-terracotta)', marginTop: '4px' }}>
            S/ {shift.cardSales.toFixed(2)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Débito y crédito
          </span>
        </div>
      </div>

      {/* Arqueo y Movimientos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px'
      }}>
        {/* Estimación de Arqueo */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '14px' }}>Balance Teórico del Cajón</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Fondo Inicial Registrado:</span>
              <span className="tabular-nums font-display" style={{ fontWeight: 600 }}>S/ {shift.initialCash.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--status-available)' }}>
              <span>+ Ventas Cobradas en Efectivo:</span>
              <span className="tabular-nums font-display" style={{ fontWeight: 600 }}>S/ {shift.cashSales.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--status-danger)' }}>
              <span>- Salidas / Egresos Autorizados (Hielo):</span>
              <span className="tabular-nums font-display" style={{ fontWeight: 600 }}>S/ {shift.expenses.toFixed(2)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '2px solid var(--border-subtle)',
              paddingTop: '12px',
              marginTop: '4px',
              fontSize: '1.15rem',
              fontWeight: 800,
              color: 'var(--color-charcoal)'
            }}>
              <span>EFECTIVO ESPERADO EN CAJA:</span>
              <span className="tabular-nums font-display" style={{ color: 'var(--color-terracotta)', fontSize: '1.35rem' }}>
                S/ {expectedCashInDrawer.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Cierres Anteriores */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '14px' }}>Cierres Anteriores de Demostración</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { date: 'Ayer — Turno Noche', cashier: 'Luis Ramos', total: 680.50, diff: 'Sin diferencia' },
              { date: 'Ayer — Turno Tarde', cashier: 'Carlos Mendoza', total: 420.00, diff: '+S/ 2.00 sobrante' }
            ].map((c, i) => (
              <div 
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-canvas)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.86rem', color: 'var(--color-charcoal)' }}>{c.date}</strong>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Cajero: {c.cashier}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="tabular-nums font-display" style={{ fontWeight: 700, color: 'var(--color-charcoal)' }}>
                    S/ {c.total.toFixed(2)}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--status-available)', fontWeight: 600 }}>{c.diff}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL CIERRE DE TURNO */}
      {showCloseModal && (
        <div className="modal-overlay" onClick={() => setShowCloseModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Cierre de Turno y Arqueo Físico</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Ingreso de efectivo contado en cajón
                </span>
              </div>
            </div>

            <div className="modal-body">
              <div className="input-group">
                <label className="input-label">Efectivo Contado en Gaveta (S/)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder={expectedCashInDrawer.toFixed(2)}
                  value={countedCash}
                  onChange={e => setCountedCash(e.target.value)}
                  autoFocus
                />
              </div>

              <div style={{
                padding: '14px',
                backgroundColor: 'var(--bg-canvas)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.84rem',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>Efectivo esperado:</span>
                  <strong>S/ {expectedCashInDrawer.toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Diferencia calculada:</span>
                  <span style={{ color: 'var(--status-available)', fontWeight: 700 }}>
                    S/ {(Number(countedCash || expectedCashInDrawer) - expectedCashInDrawer).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCloseModal(false)}>
                Cancelar
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  alert('Turno cerrado en modo demostración. Reporte generado.');
                  setShowCloseModal(false);
                }}
              >
                Confirmar y Cerrar Turno
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
