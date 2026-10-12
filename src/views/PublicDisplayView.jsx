import React from 'react';
import { CircleDot, Clock, ArrowLeft, Maximize2 } from 'lucide-react';
import { useBillar } from '../context/BillarContext';

export default function PublicDisplayView() {
  const { tables, getTableElapsedSeconds, formatTime, setCurrentView } = useBillar();

  const availableCount = tables.filter(t => t.status === 'available').length;
  const occupiedCount = tables.filter(t => t.status === 'occupied').length;

  const poolTables = tables.filter(t => t.tableType === 'pool' || t.type?.toLowerCase().includes('pool'));
  const caromTables = tables.filter(t => t.tableType === 'carom' || t.type?.toLowerCase().includes('bandas'));

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
      backgroundColor: '#231F1D',
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
            background: 'rgba(255, 255, 255, 0.12)',
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
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: 'rgba(156, 86, 75, 0.25)',
          padding: '6px 18px',
          borderRadius: 'var(--radius-full)',
          marginBottom: '10px'
        }}>
          <CircleDot size={18} color="var(--color-terracotta)" />
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          }}>
            BILLAR CLUB & LOUNGE
          </span>
        </div>

        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: 800,
          color: '#FFFFFF',
          marginBottom: '6px',
          letterSpacing: '0.02em'
        }}>
          ESTADO DE MESAS EN SALA
        </h1>

        {/* Semáforo Global */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '20px',
          fontSize: '0.96rem',
          fontWeight: 700
        }}>
          <span style={{ color: '#54D18C', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2E7D52' }} />
            {availableCount} MESAS LIBRES
          </span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
          <span style={{ color: '#F5B041', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#C87A18' }} className="pulse-indicator" />
            {occupiedCount} EN JUEGO
          </span>
        </div>
      </div>

      {/* Grid de las 6 Mesas con Aspecto de Mesa Física Real */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
        alignContent: 'start'
      }}>
        {tables.map(table => {
          const isFree = table.status === 'available';
          const isPlay = table.status === 'occupied';
          const isPool = table.tableType === 'pool' || table.type?.toLowerCase().includes('pool');
          const elapsed = getTableElapsedSeconds(table);

          // Paño de fondo
          const clothBg = isFree
            ? 'linear-gradient(145deg, #1A2E22 0%, #112017 100%)' // Paño verde en reposo
            : 'linear-gradient(145deg, #183C2C 0%, #0E261C 100%)'; // Paño verde iluminado

          return (
            <div 
              key={table.id}
              style={{
                // Mueble / Banda de mesa de billar
                backgroundColor: '#2A2421',
                backgroundImage: 'linear-gradient(180deg, #38302C 0%, #201B19 100%)',
                border: '3px solid #483E38',
                borderRadius: '18px',
                padding: '12px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '220px',
                boxShadow: isPlay ? '0 10px 24px rgba(0,0,0,0.5), 0 0 0 2px #C87A18' : '0 6px 16px rgba(0,0,0,0.35)'
              }}
            >
              {/* Banda Superior con Nombre de Mesa */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 6px 8px',
                borderBottom: '1px solid rgba(255,255,255,0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isPool ? (
                    <span style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#111',
                      border: '1px solid #555',
                      color: '#fff',
                      fontSize: '9px',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      8
                    </span>
                  ) : (
                    <div style={{ display: 'flex', gap: '2px' }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#FFF' }} />
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#FFD166' }} />
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#E63946' }} />
                    </div>
                  )}

                  <h2 style={{
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    margin: 0
                  }}>
                    {table.name}
                  </h2>
                </div>

                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#C4B7AF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em'
                }}>
                  {isPool ? 'Pool (6 Troneras)' : 'Tres Bandas'}
                </span>
              </div>

              {/* El Paño Interior de la Mesa */}
              <div style={{
                margin: '8px 0',
                borderRadius: '10px',
                background: clothBg,
                border: '2px solid #141110',
                position: 'relative',
                padding: '20px 14px',
                textAlign: 'center',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                boxShadow: 'inset 0 3px 12px rgba(0,0,0,0.6)'
              }}>
                {/* Troneras en esquinas para Pool */}
                {isPool && (
                  <>
                    <div style={{ position: 'absolute', top: -3, left: -3, width: 14, height: 14, borderRadius: '50%', backgroundColor: '#090807' }} />
                    <div style={{ position: 'absolute', top: -3, right: -3, width: 14, height: 14, borderRadius: '50%', backgroundColor: '#090807' }} />
                    <div style={{ position: 'absolute', bottom: -3, left: -3, width: 14, height: 14, borderRadius: '50%', backgroundColor: '#090807' }} />
                    <div style={{ position: 'absolute', bottom: -3, right: -3, width: 14, height: 14, borderRadius: '50%', backgroundColor: '#090807' }} />
                  </>
                )}

                {/* Diamantes para Tres Bandas */}
                {!isPool && (
                  <div style={{ position: 'absolute', top: 3, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '24px' }}>
                    <span style={{ width: 4, height: 4, transform: 'rotate(45deg)', backgroundColor: '#EADBC8', display: 'inline-block', opacity: 0.8 }} />
                    <span style={{ width: 4, height: 4, transform: 'rotate(45deg)', backgroundColor: '#EADBC8', display: 'inline-block', opacity: 0.8 }} />
                  </div>
                )}

                {isFree ? (
                  <div>
                    <div style={{
                      display: 'inline-block',
                      padding: '8px 24px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(46, 125, 82, 0.35)',
                      border: '1.5px solid #2E7D52',
                      color: '#54D18C',
                      fontWeight: 800,
                      fontSize: '1.25rem',
                      letterSpacing: '0.06em'
                    }}>
                      DISPONIBLE
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#97AEA1', marginTop: '6px' }}>
                      Tarifa: S/ {table.pricePerHour.toFixed(2)}/h
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: '#F5B041',
                      fontWeight: 800,
                      marginBottom: '4px'
                    }}>
                      PARTIDA EN CURSO
                    </div>
                    <div 
                      className="tabular-nums font-display"
                      style={{
                        fontSize: '2.4rem',
                        fontWeight: 800,
                        color: '#FFFFFF',
                        letterSpacing: '0.04em'
                      }}
                    >
                      {formatTime(elapsed)}
                    </div>
                  </div>
                )}
              </div>

              {/* Pie de Banda */}
              <div style={{
                textAlign: 'center',
                fontSize: '0.75rem',
                color: '#9E928A',
                paddingTop: '4px'
              }}>
                {isPlay ? `Inició a las ${new Date(table.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Acércate a barra para abrir mesa'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Público */}
      <div style={{
        textAlign: 'center',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#9E928A',
        fontSize: '0.85rem',
        marginTop: '20px'
      }}>
        Ambiente climatizado • Servicio de piqueos, cervezas y bebidas a la mesa • Billar Club
      </div>
    </div>
  );
}
