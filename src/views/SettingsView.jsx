import React, { useState } from 'react';
import { Settings, Save, Check, ShieldCheck, DollarSign, Clock, Store } from 'lucide-react';
import { useBillar } from '../context/BillarContext';

export default function SettingsView() {
  const { rates } = useBillar();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [localSettings, setLocalSettings] = useState({
    businessName: 'Club de Billar & Lounge Master 8',
    ruc: '20601234567',
    address: 'Av. Las Palmeras 1420, Lima',
    currency: 'Soles (PEN)',
    minFracMinutes: 15,
    roundRules: 'Redondeo a 50 céntimos más cercano'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '24px 28px', maxWidth: '900px' }}>
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
            Configuración del Sistema
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Tarifas de juego, parámetros de negocio y datos del establecimiento.
          </p>
        </div>

        {savedSuccess && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--status-available-bg)',
            color: 'var(--status-available)',
            fontWeight: 700,
            fontSize: '0.84rem'
          }}>
            <Check size={16} />
            <span>Configuración guardada</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Bloque 1: Datos del Local */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Datos del Establecimiento</h3>
            <Store size={18} color="var(--color-terracotta)" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="input-group">
              <label className="input-label">Nombre Comercial</label>
              <input 
                type="text" 
                className="input-field"
                value={localSettings.businessName}
                onChange={e => setLocalSettings({ ...localSettings, businessName: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label className="input-label">RUC / Identificación Fiscal</label>
              <input 
                type="text" 
                className="input-field"
                value={localSettings.ruc}
                onChange={e => setLocalSettings({ ...localSettings, ruc: e.target.value })}
              />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Dirección del Local</label>
            <input 
              type="text" 
              className="input-field"
              value={localSettings.address}
              onChange={e => setLocalSettings({ ...localSettings, address: e.target.value })}
            />
          </div>
        </div>

        {/* Bloque 2: Tarifas de Mesas */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Tarifas por Hora de Juego</h3>
            <DollarSign size={18} color="var(--color-terracotta)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {rates.map(rate => (
              <div 
                key={rate.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-canvas)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <strong style={{ color: 'var(--color-charcoal)' }}>{rate.name}</strong>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Tiempo mínimo de cobro: {rate.minMinutes} minutos
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Precio/Hora:</span>
                  <div className="font-display tabular-nums" style={{
                    padding: '6px 12px',
                    backgroundColor: 'var(--surface-card)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    fontWeight: 800,
                    color: 'var(--color-terracotta)'
                  }}>
                    S/ {rate.pricePerHour.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bloque 3: Fraccionamiento y Redondeo */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Reglas de Fraccionamiento y Redondeo</h3>
            <Clock size={18} color="var(--color-terracotta)" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="input-group">
              <label className="input-label">Tolerancia Inicial (minutos de cortesía)</label>
              <input 
                type="number" 
                className="input-field" 
                defaultValue="5"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Regla de Redondeo en Moneda</label>
              <select className="input-field" defaultValue="nearest50">
                <option value="nearest50">Al múltiplo de S/ 0.50 más cercano</option>
                <option value="nearest10">Al múltiplo de S/ 0.10 exacto</option>
                <option value="exact">Exacto al céntimo</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary btn-lg">
            <Save size={18} />
            <span>Guardar Preferencias</span>
          </button>
        </div>
      </form>
    </div>
  );
}
