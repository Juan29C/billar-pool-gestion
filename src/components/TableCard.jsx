import React from 'react';
import { Play, Coffee, CheckCircle2, AlertTriangle, Wrench, Clock, Users } from 'lucide-react';
import { useBillar } from '../context/BillarContext';

export default function TableCard({ table, onOpenStartModal, onOpenOrderModal, onOpenCheckoutModal }) {
  const { 
    getTableElapsedSeconds, 
    getTableTimeCost, 
    getTableOrdersCost, 
    getTableTotalCost, 
    formatTime 
  } = useBillar();

  const elapsedSeconds = getTableElapsedSeconds(table);
  const timeFormatted = formatTime(elapsedSeconds);
  const timeCost = getTableTimeCost(table);
  const ordersCost = getTableOrdersCost(table);
  const totalCost = getTableTotalCost(table);

  // Estados visuales
  const statusConfig = {
    available: {
      label: 'Disponible',
      badgeClass: 'badge-available',
      borderStyle: 'var(--border-subtle)'
    },
    occupied: {
      label: 'En Juego',
      badgeClass: 'badge-occupied',
      borderStyle: 'var(--status-occupied-border)'
    },
    pending: {
      label: 'Por Cobrar',
      badgeClass: 'badge-pending',
      borderStyle: 'var(--status-pending-border)'
    },
    maintenance: {
      label: 'Mantenimiento',
      badgeClass: 'badge-maintenance',
      borderStyle: 'var(--border-subtle)'
    }
  };

  const currentStatus = statusConfig[table.status] || statusConfig.available;
  const isOccupied = table.status === 'occupied';
  const isPending = table.status === 'pending';

  return (
    <div 
      className="card animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        borderColor: currentStatus.borderStyle,
        backgroundColor: isOccupied ? '#FFFFFF' : 'var(--surface-card)',
        boxShadow: isOccupied ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        minHeight: '340px'
      }}
    >
      {/* Top Header: Name, Type & Status */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--color-charcoal)'
              }}>
                {table.name}
              </h3>
              {isOccupied && (
                <span 
                  className="pulse-indicator" 
                  style={{
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--status-occupied)' 
                  }} 
                />
              )}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {table.type} • <strong style={{ color: 'var(--color-charcoal)' }}>S/ {table.pricePerHour.toFixed(2)}/h</strong>
            </span>
          </div>

          <span className={`badge ${currentStatus.badgeClass}`}>
            <span className="badge-dot" />
            {currentStatus.label}
          </span>
        </div>

        {/* Players Name if occupied */}
        {(isOccupied || isPending) && table.players && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            marginBottom: '12px',
            padding: '4px 8px',
            backgroundColor: 'var(--bg-canvas)',
            borderRadius: 'var(--radius-sm)'
          }}>
            <Users size={14} color="var(--color-terracotta)" />
            <span>Cliente: <strong>{table.players}</strong></span>
          </div>
        )}

        {/* Timer Box (Elemento Central de Alto Impacto) */}
        <div style={{
          backgroundColor: isOccupied ? 'var(--surface-dark)' : 'var(--bg-canvas)',
          color: isOccupied ? '#FFFFFF' : 'var(--text-muted)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 14px',
          textAlign: 'center',
          marginBottom: '16px',
          border: isOccupied ? 'none' : '1px dashed var(--border-subtle)',
          boxShadow: isOccupied ? '0 4px 16px rgba(43, 39, 37, 0.2)' : 'none',
          transition: 'all var(--transition-fast)'
        }}>
          <div style={{
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 700,
            color: isOccupied ? 'var(--color-terracotta)' : 'var(--text-muted)',
            marginBottom: '4px'
          }}>
            {isOccupied ? 'Tiempo de Juego Transcurrido' : isPending ? 'Tiempo Finalizado' : 'Mesa Libre'}
          </div>

          <div 
            className="tabular-nums font-display"
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              color: isOccupied ? '#FFFFFF' : 'var(--text-disabled)'
            }}
          >
            {(isOccupied || isPending) ? timeFormatted : '00:00:00'}
          </div>

          {(isOccupied || isPending) && (
            <div style={{
              fontSize: '0.75rem',
              color: isOccupied ? 'var(--text-on-dark-muted)' : 'var(--text-muted)',
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}>
              <Clock size={13} />
              <span>Inició: {new Date(table.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}
        </div>

        {/* Cost Breakdown */}
        {(isOccupied || isPending) && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            marginBottom: '16px',
            fontSize: '0.84rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Uso de Mesa:</span>
              <span className="tabular-nums font-display" style={{ fontWeight: 600 }}>S/ {timeCost.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>
                Consumos ({table.orders.reduce((acc, o) => acc + o.qty, 0)} items):
              </span>
              <span className="tabular-nums font-display" style={{ fontWeight: 600 }}>S/ {ordersCost.toFixed(2)}</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '6px',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '1rem',
              fontWeight: 800,
              color: 'var(--color-charcoal)'
            }}>
              <span>Total Estimado:</span>
              <span className="tabular-nums font-display" style={{ color: 'var(--color-terracotta)', fontSize: '1.25rem' }}>
                S/ {totalCost.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div style={{
        paddingTop: '12px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        gap: '8px'
      }}>
        {table.status === 'available' && (
          <button 
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={() => onOpenStartModal(table)}
          >
            <Play size={16} fill="currentColor" />
            <span>Iniciar Partida</span>
          </button>
        )}

        {isOccupied && (
          <>
            <button 
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
              onClick={() => onOpenOrderModal(table)}
              title="Añadir bebidas o snacks a la cuenta"
            >
              <Coffee size={15} color="var(--color-terracotta)" />
              <span>+ Consumo</span>
            </button>
            <button 
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
              onClick={() => onOpenCheckoutModal(table)}
            >
              <CheckCircle2 size={15} />
              <span>Cobrar</span>
            </button>
          </>
        )}

        {isPending && (
          <button 
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={() => onOpenCheckoutModal(table)}
          >
            <CheckCircle2 size={16} />
            <span>Confirmar Cobro (S/ {totalCost.toFixed(2)})</span>
          </button>
        )}

        {table.status === 'maintenance' && (
          <div style={{
            width: '100%',
            textAlign: 'center',
            padding: '8px',
            color: 'var(--text-muted)',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <Wrench size={15} />
            <span>Mantenimiento de paño</span>
          </div>
        )}
      </div>
    </div>
  );
}
