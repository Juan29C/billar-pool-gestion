import React from 'react';
import { Play, Coffee, CheckCircle2, Clock, Users, Wrench } from 'lucide-react';
import { useBillar } from '../context/BillarContext';

export default function TableCard({ table, onOpenStartModal, onOpenOrderModal, onOpenCheckoutModal, onOpenAdjustTimeModal }) {
  const { 
    getTableElapsedSeconds,
    getTableTimingInfo,
    getTableTimeCost, 
    getTableOrdersCost, 
    getTableTotalCost, 
    formatTime 
  } = useBillar();

  const timing = getTableTimingInfo(table);
  const timeCost = getTableTimeCost(table);
  const ordersCost = getTableOrdersCost(table);
  const totalCost = getTableTotalCost(table);

  const isOccupied = table.status === 'occupied';
  const isPending = table.status === 'pending';
  const isAvailable = table.status === 'available';
  const isPool = table.tableType === 'pool' || table.type?.toLowerCase().includes('pool');

  // Colores oficiales del paño Club LIVERPOOL (Azul Eléctrico Tournament)
  const clothBg = isPending
    ? 'linear-gradient(145deg, #4A221C 0%, #2E1511 100%)' // Alerta cálida
    : isOccupied
    ? timing.isTimeOver
      ? 'linear-gradient(145deg, #3D1210 0%, #1A0706 100%)' // Paño con alerta de tiempo cumplido
      : 'linear-gradient(145deg, #005487 0%, #003657 100%)' // Azul Torneo en juego (iluminación nocturna focalizada)
    : 'linear-gradient(145deg, #008ED6 0%, #006AA3 100%)'; // Azul Torneo LIVERPOOL disponible

  const neonBarColor = timing.isTimeOver ? '#E63946' : '#F5A623';

  return (
    <div 
      className="animate-fade-in"
      style={{
        // Marco exterior de la mesa de billar (Mueble en Carbón Profundo)
        backgroundColor: '#1E1B19',
        backgroundImage: 'linear-gradient(180deg, #272320 0%, #171513 100%)',
        border: isOccupied 
          ? timing.isTimeOver 
            ? '2px solid #E63946' 
            : '2px solid #F5A623' 
          : '2px solid #38322F',
        borderRadius: '20px',
        padding: '12px',
        boxShadow: isOccupied 
          ? timing.isTimeOver
            ? '0 0 26px rgba(230, 57, 70, 0.45), 0 10px 28px rgba(0, 0, 0, 0.6)'
            : '0 0 24px rgba(245, 166, 35, 0.35), 0 10px 28px rgba(0, 0, 0, 0.6)' 
          : '0 6px 18px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '380px',
        transition: 'all var(--transition-fast)',
        overflow: 'hidden'
      }}
    >
      {/* --- INDICADOR NEÓN SUPERIOR LIVERPOOL (Efecto letrero iluminado de la entrada) --- */}
      {isOccupied && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '12%',
          right: '12%',
          height: '3px',
          backgroundColor: neonBarColor,
          borderRadius: '0 0 4px 4px',
          boxShadow: `0 0 10px ${neonBarColor}, 0 0 20px ${neonBarColor}`,
          zIndex: 10
        }} />
      )}

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
          padding: '3px 10px',
          borderRadius: '9999px',
          letterSpacing: '0.06em',
          backgroundColor: isAvailable ? 'rgba(0, 142, 214, 0.22)' : isOccupied ? 'rgba(245, 166, 35, 0.22)' : 'rgba(200, 90, 75, 0.25)',
          color: isAvailable ? '#38B6FF' : isOccupied ? '#F5A623' : '#FFA194',
          border: `1px solid ${isAvailable ? '#008ED6' : isOccupied ? '#F5A623' : '#C85A4B'}`,
          boxShadow: isOccupied ? '0 0 8px rgba(245, 166, 35, 0.35)' : 'none'
        }}>
          {isAvailable ? 'DISPONIBLE' : isOccupied ? 'EN JUEGO' : 'POR COBRAR'}
        </span>
      </div>

      {/* --- EL PAÑO DE BILLAR (Cuerpo Central de la Mesa) --- */}
      <div style={{
        margin: '8px 0',
        borderRadius: '12px',
        background: clothBg,
        border: '3px solid #141110',
        boxShadow: 'inset 0 4px 18px rgba(0, 0, 0, 0.75)',
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
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.16) 0%, transparent 80%)',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#F0ECE8' }}>
              <Users size={13} color="#F5A623" />
              <span>Cliente: <strong>{table.players}</strong></span>
            </div>
          ) : (
            <span style={{ fontSize: '0.78rem', color: '#BDE3FB' }}>
              Tarifa: S/ {table.pricePerHour.toFixed(2)}/h
            </span>
          )}

          <span style={{ fontSize: '0.75rem', color: '#BDE3FB', fontWeight: 600 }}>
            {table.type}
          </span>
        </div>

        {/* Display del Cronómetro (Marcador de Paño) */}
        <div style={{
          textAlign: 'center',
          padding: '12px 6px',
          backgroundColor: 'rgba(4, 15, 26, 0.65)',
          borderRadius: '10px',
          border: isOccupied 
            ? timing.isTimeOver
              ? '1px solid rgba(230, 57, 70, 0.6)'
              : timing.isNearEnd
              ? '1px solid rgba(245, 166, 35, 0.7)'
              : '1px solid rgba(245, 166, 35, 0.35)'
            : '1px solid rgba(0, 142, 214, 0.22)',
          backdropFilter: 'blur(3px)',
          zIndex: 2,
          margin: 'auto 0'
        }}>
          {/* Header del tipo de cronómetro */}
          <div style={{
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 800,
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}>
            {isPending ? (
              <span style={{ color: '#FFA194' }}>Tiempo Finalizado</span>
            ) : isOccupied ? (
              timing.playMode === 'countdown' ? (
                timing.isTimeOver ? (
                  <span style={{ color: '#FF6B6B', backgroundColor: 'rgba(230, 57, 70, 0.2)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(230, 57, 70, 0.5)' }}>
                    🚨 TIEMPO CUMPLIDO (SOBRETIEMPO)
                  </span>
                ) : timing.isNearEnd ? (
                  <span style={{ color: '#F5A623', backgroundColor: 'rgba(245, 166, 35, 0.2)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(245, 166, 35, 0.5)' }}>
                    ⚠️ QUEDAN &lt; 5 MIN ({timing.targetMinutes}m)
                  </span>
                ) : (
                  <span style={{ color: '#38B6FF' }}>
                    ⏳ CUENTA REGRESIVA ({timing.targetMinutes} MIN)
                  </span>
                )
              ) : (
                <span style={{ color: '#F5A623' }}>
                  ⏱ TIEMPO LIBRE (ASCENDENTE)
                </span>
              )
            ) : (
              <span style={{ color: '#7EC3EE' }}>Mesa en Espera</span>
            )}
          </div>

          <div 
            className="tabular-nums font-display"
            style={{
              fontSize: '2.1rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              color: isOccupied 
                ? timing.isTimeOver
                  ? '#FF6B6B'
                  : timing.isNearEnd
                  ? '#F5A623'
                  : '#FFFFFF' 
                : isPending
                ? '#FFA194'
                : '#8EC5E8',
              textShadow: isOccupied 
                ? timing.isTimeOver
                  ? '0 0 18px rgba(230, 57, 70, 0.65)'
                  : timing.isNearEnd
                  ? '0 0 16px rgba(245, 166, 35, 0.65)'
                  : '0 0 16px rgba(245, 166, 35, 0.35)' 
                : 'none'
            }}
          >
            {(isOccupied || isPending) ? timing.displayTime : '00:00:00'}
          </div>

          {(isOccupied || isPending) && (
            <div style={{
              fontSize: '0.72rem',
              color: timing.isTimeOver ? '#FFB4B4' : '#A8D4F0',
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              flexWrap: 'wrap'
            }}>
              <Clock size={12} />
              <span>Inició: {new Date(table.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              {timing.playMode === 'countdown' && (
                <span>• Pactado: {timing.targetMinutes}m</span>
              )}
              {timing.isTimeOver && (
                <span style={{ color: '#FF6B6B', fontWeight: 700 }}>
                  • Extra: +{formatTime(timing.overtimeSeconds)}
                </span>
              )}
              {onOpenAdjustTimeModal && (isOccupied || isPending) && (
                <button
                  type="button"
                  title="Gestionar cronómetro, tiempos y modalidad de la partida"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenAdjustTimeModal(table);
                  }}
                  style={{
                    background: timing.isTimeOver ? 'rgba(230, 57, 70, 0.25)' : 'rgba(245, 166, 35, 0.2)',
                    border: timing.isTimeOver ? '1px solid rgba(230, 57, 70, 0.5)' : '1px solid rgba(245, 166, 35, 0.4)',
                    color: timing.isTimeOver ? '#FF8A8A' : '#F5A623',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '0.68rem',
                    cursor: 'pointer',
                    fontWeight: 800,
                    lineHeight: 1.2
                  }}
                >
                  ⚙️ Ajustar
                </button>
              )}
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
            <div style={{ fontSize: '0.75rem', color: '#A8D4F0' }}>
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
                color: '#F5A623',
                lineHeight: 1,
                textShadow: '0 0 10px rgba(245, 166, 35, 0.3)'
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
            type="button"
            className="btn btn-primary"
            style={{ 
              width: '100%', 
              fontSize: '0.88rem', 
              padding: '9px',
              backgroundColor: '#F5A623',
              color: '#161413',
              fontWeight: 800,
              border: 'none',
              boxShadow: '0 0 14px rgba(245, 166, 35, 0.35)'
            }}
            onClick={() => onOpenStartModal(table)}
          >
            <Play size={15} fill="currentColor" />
            <span>Abrir Mesa</span>
          </button>
        )}

        {isOccupied && (
          <>
            <button 
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, backgroundColor: '#282320', color: '#FFFFFF', borderColor: '#423934' }}
              onClick={() => onOpenOrderModal(table)}
            >
              <Coffee size={14} color="#F5A623" />
              <span>+ Consumo</span>
            </button>
            <button 
              type="button"
              className="btn btn-primary btn-sm"
              style={{ 
                flex: 1,
                backgroundColor: '#F5A623',
                color: '#161413',
                fontWeight: 800,
                border: 'none',
                boxShadow: '0 0 12px rgba(245, 166, 35, 0.3)'
              }}
              onClick={() => onOpenCheckoutModal(table)}
            >
              <CheckCircle2 size={14} />
              <span>Cobrar</span>
            </button>
          </>
        )}

        {isPending && (
          <button 
            type="button"
            className="btn btn-primary"
            style={{ 
              width: '100%', 
              fontSize: '0.88rem', 
              padding: '9px',
              backgroundColor: '#F5A623',
              color: '#161413',
              fontWeight: 800,
              border: 'none',
              boxShadow: '0 0 14px rgba(245, 166, 35, 0.35)'
            }}
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
