import React from 'react';
import { CircleDot, Clock, ArrowLeft, Maximize2 } from 'lucide-react';
import { useBillar } from '../context/BillarContext';

export default function PublicDisplayView() {
  const { tables, getTableElapsedSeconds, formatTime, setCurrentView } = useBillar();

  const availableCount = tables.filter(t => t.status === 'available').length;
  const occupiedCount = tables.filter(t => t.status === 'occupied').length;

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-charcoal)',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 32px',
      position: 'relative'
    }}>
      {/* Botón flotante para regresar al admin */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '10px',
        zIndex: 50
      }}>
        <button 
          onClick={toggleFullScreen}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            backdropFilter: 'blur(4px)'
          }}
        >
          <Maximize2 size={14} />
          <span>Pantalla Completa</span>
        </button>

        <button 
          onClick={() => setCurrentView('tables')}
          style={{
            background: 'var(--color-terracotta)',
            border: 'none',
            color: '#FFFFFF',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            fontWeight: 700
          }}
        >
          <ArrowLeft size={14} />
          <span>Volver al Panel</span>
        </button>
      </div>

      {/* Header Público */}
      <div style={{
        textAlign: 'center',
        paddingBottom: '24px',
        borderBottom: '1px solid var(--surface-dark-soft)',
        marginBottom: '28px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: 'rgba(156, 86, 75, 0.2)',
          padding: '8px 20px',
          borderRadius: 'var(--radius-full)',
          marginBottom: '12px'
        }}>
          <CircleDot size={20} color="var(--color-terracotta)" />
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          }}>
            BILLAR CLUB & LOUNGE
          </span>
        </div>

        <h1 style={{
          fontSize: '2.4rem',
          fontWeight: 800,
          color: '#FFFFFF',
          marginBottom: '8px'
        }}>
          DISPONIBILIDAD DE MESAS
        </h1>

        {/* Semáforo Global */}
        <div style={{
          display: 'inline-flex',
          gap: '24px',
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--text-on-dark-muted)'
        }}>
          <span style={{ color: 'var(--status-available)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--status-available)' }} />
            {availableCount} MESAS DISPONIBLES
          </span>
          <span>•</span>
          <span style={{ color: 'var(--status-occupied)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--status-occupied)' }} className="pulse-indicator" />
            {occupiedCount} EN JUEGO
          </span>
        </div>
      </div>

      {/* Grid de Mesas para Pantalla Vertical (Grandes y Legibles) */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        alignContent: 'start'
      }}>
        {tables.map(table => {
          const isFree = table.status === 'available';
          const isPlay = table.status === 'occupied';
          const isMaint = table.status === 'maintenance';
          const elapsed = getTableElapsedSeconds(table);

          return (
            <div 
              key={table.id}
              style={{
                backgroundColor: isFree ? 'rgba(46, 125, 82, 0.12)' : isPlay ? 'rgba(200, 122, 24, 0.12)' : 'var(--surface-dark-soft)',
                border: `2px solid ${isFree ? 'var(--status-available)' : isPlay ? 'var(--status-occupied)' : 'var(--border-dark)'}`,
                borderRadius: 'var(--radius-xl)',
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '190px',
                textAlign: 'center',
                boxShadow: isPlay ? '0 8px 24px rgba(200, 122, 24, 0.15)' : 'none'
              }}
            >
              <div>
                <div style={{
                  fontSize: '0.82rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--text-on-dark-muted)',
                  fontWeight: 700,
                  marginBottom: '4px'
                }}>
                  {table.type}
                </div>
                <h2 style={{
                  fontSize: '2.1rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  margin: 0
                }}>
                  {table.name}
                </h2>
              </div>

              {/* Estado y Cronómetro */}
              <div style={{ margin: '14px 0' }}>
                {isFree && (
                  <div style={{
                    display: 'inline-block',
                    padding: '8px 24px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--status-available)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    letterSpacing: '0.04em'
                  }}>
                    DISPONIBLE
                  </div>
                )}

                {isPlay && (
                  <div>
                    <div style={{
                      display: 'inline-block',
                      padding: '4px 16px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--status-occupied)',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      letterSpacing: '0.04em',
                      marginBottom: '6px'
                    }}>
                      EN JUEGO
                    </div>
                    <div 
                      className="tabular-nums font-display"
                      style={{
                        fontSize: '2.2rem',
                        fontWeight: 800,
                        color: '#FFFFFF',
                        letterSpacing: '0.04em'
                      }}
                    >
                      {formatTime(elapsed)}
                    </div>
                  </div>
                )}

                {isMaint && (
                  <div style={{
                    display: 'inline-block',
                    padding: '6px 18px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--surface-dark-card)',
                    color: 'var(--text-on-dark-muted)',
                    fontWeight: 700,
                    fontSize: '1rem'
                  }}>
                    MANTENIMIENTO
                  </div>
                )}
              </div>

              <div style={{
                fontSize: '0.78rem',
                color: 'var(--text-on-dark-subtle)',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '8px'
              }}>
                Tarifa oficial: S/ {table.pricePerHour.toFixed(2)} / hora
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Público */}
      <div style={{
        textAlign: 'center',
        paddingTop: '20px',
        borderTop: '1px solid var(--surface-dark-soft)',
        color: 'var(--text-on-dark-subtle)',
        fontSize: '0.85rem',
        marginTop: '24px'
      }}>
        Solicita tu mesa en recepción o barra • Consumos y piqueos disponibles
      </div>
    </div>
  );
}
