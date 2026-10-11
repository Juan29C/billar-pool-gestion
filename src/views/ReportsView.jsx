import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Clock, DollarSign, Award } from 'lucide-react';
import { useBillar } from '../context/BillarContext';

export default function ReportsView() {
  const [period, setPeriod] = useState('today');

  // Datos de muestra para gráficos CSS
  const hourlyOccupancy = [
    { hour: '14:00', percent: 25 },
    { hour: '16:00', percent: 45 },
    { hour: '18:00', percent: 70 },
    { hour: '20:00', percent: 95 },
    { hour: '22:00', percent: 100 },
    { hour: '00:00', percent: 80 }
  ];

  const topProducts = [
    { name: 'Cerveza Cusqueña Trigo', sold: 48, revenue: 480.00 },
    { name: 'Porción Tequeños de Queso', sold: 26, revenue: 468.00 },
    { name: 'Cerveza Corona Extra', sold: 32, revenue: 352.00 },
    { name: 'Red Bull Energy 250ml', sold: 18, revenue: 216.00 },
    { name: 'Coca Cola Sin Azúcar', sold: 35, revenue: 157.50 }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '24px 28px' }}>
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
            Reportes y Rendimiento Comercial
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Estadísticas de uso de mesas, horas de mayor afluencia y rotación de productos.
          </p>
        </div>

        {/* Filtro de Periodo */}
        <div style={{
          display: 'flex',
          gap: '6px',
          backgroundColor: 'var(--surface-card)',
          padding: '4px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)'
        }}>
          {[
            { id: 'today', label: 'Hoy' },
            { id: 'week', label: 'Esta Semana' },
            { id: 'month', label: 'Este Mes' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              style={{
                border: 'none',
                padding: '6px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: period === p.id ? 'var(--color-terracotta)' : 'transparent',
                color: period === p.id ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de 2 Columnas para Gráficos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '24px'
      }}>
        {/* Gráfico 1: Horas de Mayor Ocupación */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Curva de Ocupación de Mesas</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Porcentaje de mesas activas por franja horaria
              </span>
            </div>
            <Clock size={18} color="var(--color-terracotta)" />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            height: '200px',
            paddingTop: '20px',
            borderBottom: '1px solid var(--border-subtle)',
            gap: '12px'
          }}>
            {hourlyOccupancy.map((item, idx) => (
              <div 
                key={idx}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end',
                  gap: '8px'
                }}
              >
                <span className="tabular-nums font-display" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {item.percent}%
                </span>
                <div 
                  style={{
                    width: '100%',
                    maxWidth: '42px',
                    height: `${item.percent}%`,
                    backgroundColor: item.percent > 80 ? 'var(--color-terracotta)' : 'var(--surface-dark)',
                    borderRadius: '6px 6px 0 0',
                    transition: 'height 0.4s ease'
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {item.hour}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span>Hora Pico: <strong>20:00 - 23:00 hrs</strong></span>
            <span>Promedio de juego: <strong>1h 45m / mesa</strong></span>
          </div>
        </div>

        {/* Gráfico 2: Productos con Mayor Facturación */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Ranking de Productos (Bar & Snacks)</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Top artículos que generan mayores ingresos
              </span>
            </div>
            <Award size={18} color="var(--color-terracotta)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {topProducts.map((p, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.84rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>
                    {idx + 1}. {p.name} ({p.sold} vendidos)
                  </span>
                  <span className="font-display tabular-nums" style={{ fontWeight: 800, color: 'var(--color-terracotta)' }}>
                    S/ {p.revenue.toFixed(2)}
                  </span>
                </div>
                <div style={{
                  height: '8px',
                  backgroundColor: 'var(--bg-canvas)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(p.revenue / topProducts[0].revenue) * 100}%`,
                    height: '100%',
                    backgroundColor: idx === 0 ? 'var(--color-terracotta)' : 'var(--color-charcoal)',
                    borderRadius: 'var(--radius-full)'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
