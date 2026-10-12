import React from 'react';
import { Play, Coffee, CheckCircle2, Clock, Users, Wrench } from 'lucide-react';
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

  const isOccupied = table.status === 'occupied';
  const isPending = table.status === 'pending';
  const isAvailable = table.status === 'available';
  const isPool = table.tableType === 'pool' || table.type?.toLowerCase().includes('pool');

  // Colores del paño según estado
  const clothBg = isPending
    ? 'linear-gradient(145deg, #42221E 0%, #2E1714 100%)' // Alerta Terracota oscuro
    : isOccupied
    ? 'linear-gradient(145deg, #1C3B2E 0%, #12281F 100%)' // Verde Paño Premium en juego
    : 'linear-gradient(145deg, #242E28 0%, #1A221E 100%)'; // Paño en reposo

  return (
    <div 
      className="animate-fade-in"
      style={{
        // Marco exterior de la mesa de billar (Mueble de madera noble)
        backgroundColor: '#26211E',
        backgroundImage: 'linear-gradient(180deg, #322B28 0%, #201C1A 100%)',
        border: '3px solid #3D3531',
        borderRadius: '20px',
        padding: '12px',
        boxShadow: isOccupied 
          ? '0 12px 28px rgba(0, 0, 0, 0.45), 0 0 0 2px var(--color-terracotta)' 
          : '0 6px 18px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '380px',
        transition: 'all var(--transition-fast)'
      }}
    >
      {/* --- ESQUINEROS METÁLICOS / PROTECTORES DE BANDA --- */}
      <div style={{ position: 'absolute', top: 5, left: 5, width: 14, height: 14, borderTop: '2px solid #8A7B73', borderLeft: '2px solid #8A7B73', borderTopLeftRadius: '10px' }} />
      <div style={{ position: 'absolute', top: 5, right: 5, width: 14, height: 14, borderTop: '2px solid #8A7B73', borderRight: '2px solid #8A7B73', borderTopRightRadius: '10px' }} />
      <div style={{ position: 'absolute', bottom: 5, left: 5, width: 14, height: 14, borderBottom: '2px solid #8A7B73', borderLeft: '2px solid #8A7B73', borderBottomLeftRadius: '10px' }} />
      <div style={{ position: 'absolute', bottom: 5, right: 5, width: 14, height: 14, borderBottom: '2px solid #8A7B73', borderRight: '2px solid #8A7B73', borderBottomRightRadius: '10px' }} />

      {/* --- CABECERA SUPERIOR DE LA MESA (Banda Superior) --- */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '2px 8px 10px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* Identificador y tipo de mesa */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Distintivo de bolas según tipo */}
          {isPool ? (
            // Bola 8 de Pool
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#111111',
              border: '1.5px solid #444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                color: '#111',
                fontSize: '8px',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                8
              </div>
            </div>
          ) : (
            // Tríada de bolas de Carambola (Tres Bandas)
            <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: '1px solid #777' }} />
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#FFD166' }} />
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#E63946' }} />
            </div>
          )}

          <div>
            <h3 style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: 0,
              lineHeight: 1.1
            }}>
              {table.name}
            </h3>
            <span style={{ fontSize: '0.72rem', color: '#B3A69F', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {isPool ? 'Mesa de Pool (6 Troneras)' : 'Mesa de Billar (Tres Bandas)'}
            </span>
          </div>
        </div>

        {/* Badge de Estado */}
        <span style={{
          fontSize: '0.7rem',
          fontWeight: 800,
          padding: '3px 8px',
          borderRadius: '9999px',
          letterSpacing: '0.06em',
          backgroundColor: isAvailable ? 'rgba(46, 125, 82, 0.25)' : isOccupied ? 'rgba(200, 122, 24, 0.25)' : 'rgba(156, 86, 75, 0.35)',
          color: isAvailable ? '#54D18C' : isOccupied ? '#F5B041' : '#E88B7D',
          border: `1px solid ${isAvailable ? '#2E7D52' : isOccupied ? '#C87A18' : '#9C564B'}`
        }}>
          {isAvailable ? 'DISPONIBLE' : isOccupied ? 'EN JUEGO' : 'POR COBRAR'}
        </span>
      </div>

      {/* --- EL PAÑO DE BILLAR (Cuerpo Central de la Mesa) --- */}
      <div style={{
        margin: '8px 0',
        borderRadius: '12px',
        background: clothBg,
        border: '3px solid #1A1614',
        boxShadow: 'inset 0 4px 16px rgba(0, 0, 0, 0.65)',
        position: 'relative',
        padding: '16px 14px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
        overflow: 'hidden'
      }}>
        {/* Efecto de luz cenital (Lámpara colgante de billar) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '60%',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.14) 0%, transparent 80%)',
          pointerEvents: 'none'
        }} />

        {/* --- TRONERAS PARA MESAS DE POOL (6 Buchacas) --- */}
        {isPool && (
          <>
            {/* Troneras superiores */}
            <div style={{ position: 'absolute', top: -3, left: -3, width: 18, height: 18, borderRadius: '50%', backgroundColor: '#0B0908', border: '2px solid #2B2522' }} />
            <div style={{ position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)', width: 16, height: 14, borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', backgroundColor: '#0B0908', border: '2px solid #2B2522' }} />
            <div style={{ position: 'absolute', top: -3, right: -3, width: 18, height: 18, borderRadius: '50%', backgroundColor: '#0B0908', border: '2px solid #2B2522' }} />

            {/* Troneras inferiores */}
            <div style={{ position: 'absolute', bottom: -3, left: -3, width: 18, height: 18, borderRadius: '50%', backgroundColor: '#0B0908', border: '2px solid #2B2522' }} />
            <div style={{ position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)', width: 16, height: 14, borderTopLeftRadius: '8px', borderTopRightRadius: '8px', backgroundColor: '#0B0908', border: '2px solid #2B2522' }} />
            <div style={{ position: 'absolute', bottom: -3, right: -3, width: 18, height: 18, borderRadius: '50%', backgroundColor: '#0B0908', border: '2px solid #2B2522' }} />
          </>
        )}

        {/* --- DIAMANTES DE GUÍA PARA MESAS DE TRES BANDAS --- */}
        {!isPool && (
          <div style={{ position: 'absolute', inset: 3, pointerEvents: 'none', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '30px', margin: '0 auto', opacity: 0.7 }}>
              <span style={{ width: 4, height: 4, transform: 'rotate(45deg)', backgroundColor: '#EADBC8', display: 'inline-block' }} />
              <span style={{ width: 4, height: 4, transform: 'rotate(45deg)', backgroundColor: '#EADBC8', display: 'inline-block' }} />
              <span style={{ width: 4, height: 4, transform: 'rotate(45deg)', backgroundColor: '#EADBC8', display: 'inline-block' }} />
            </div>
          </div>
        )}

        {/* Cliente o Tarifa */}
        <div style={{ zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          {(isOccupied || isPending) && table.players ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#E8E1DC' }}>
              <Users size={13} color="var(--color-terracotta)" />
              <span>Cliente: <strong>{table.players}</strong></span>
            </div>
          ) : (
            <span style={{ fontSize: '0.78rem', color: '#A3B8AC' }}>
              Tarifa: S/ {table.pricePerHour.toFixed(2)}/h
            </span>
          )}

          <span style={{ fontSize: '0.75rem', color: '#A3B8AC', fontWeight: 600 }}>
            {table.type}
          </span>
        </div>

        {/* Display del Cronómetro (Marcador de Paño) */}
        <div style={{
          textAlign: 'center',
          padding: '12px 6px',
          backgroundColor: 'rgba(10, 16, 13, 0.55)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(2px)',
          zIndex: 2,
          margin: 'auto 0'
        }}>
          <div style={{
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: isOccupied ? 'var(--color-terracotta)' : '#8FA498',
            fontWeight: 800,
            marginBottom: '2px'
          }}>
            {isOccupied ? 'Tiempo de Juego' : isPending ? 'Tiempo Final' : 'Mesa en Espera'}
          </div>

          <div 
            className="tabular-nums font-display"
            style={{
              fontSize: '2.1rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              color: isOccupied ? '#FFFFFF' : '#6A8073'
            }}
          >
            {(isOccupied || isPending) ? timeFormatted : '00:00:00'}
          </div>

          {(isOccupied || isPending) && (
            <div style={{
              fontSize: '0.72rem',
              color: '#B2C5BA',
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}>
              <Clock size={12} />
              <span>Inició: {new Date(table.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}
        </div>

        {/* Desglose de Importe Acumulado en el Paño */}
        {(isOccupied || isPending) && (
          <div style={{
            zIndex: 2,
            marginTop: '10px',
            paddingTop: '8px',
            borderTop: '1px dashed rgba(255, 255, 255, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#B2C5BA' }}>
              <div>Mesa: S/ {timeCost.toFixed(2)}</div>
              <div>Consumos ({table.orders.reduce((a, b) => a + b.qty, 0)}): S/ {ordersCost.toFixed(2)}</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.68rem', color: '#E8DED8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Total Acumulado
              </span>
              <div className="tabular-nums font-display" style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: 'var(--color-terracotta)',
                lineHeight: 1
              }}>
                S/ {totalCost.toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- BOTONERA INFERIOR (Banda Inferior de Operación) --- */}
      <div style={{
        paddingTop: '8px',
        display: 'flex',
        gap: '8px'
      }}>
        {isAvailable && (
          <button 
            className="btn btn-primary"
            style={{ width: '100%', fontSize: '0.88rem', padding: '9px' }}
            onClick={() => onOpenStartModal(table)}
          >
            <Play size={15} fill="currentColor" />
            <span>Abrir Mesa</span>
          </button>
        )}

        {isOccupied && (
          <>
            <button 
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, backgroundColor: '#332C28', color: '#FFFFFF', borderColor: '#453C37' }}
              onClick={() => onOpenOrderModal(table)}
            >
              <Coffee size={14} color="var(--color-terracotta)" />
              <span>+ Consumo</span>
            </button>
            <button 
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
              onClick={() => onOpenCheckoutModal(table)}
            >
              <CheckCircle2 size={14} />
              <span>Cobrar</span>
            </button>
          </>
        )}

        {isPending && (
          <button 
            className="btn btn-primary"
            style={{ width: '100%', fontSize: '0.88rem', padding: '9px' }}
            onClick={() => onOpenCheckoutModal(table)}
          >
            <CheckCircle2 size={15} />
            <span>Confirmar Cobro (S/ {totalCost.toFixed(2)})</span>
          </button>
        )}
      </div>
    </div>
  );
}
