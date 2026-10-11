import React, { useState } from 'react';
import { History, Search, Filter, Calendar, Download, Eye } from 'lucide-react';
import { useBillar } from '../context/BillarContext';

export default function HistoryView() {
  const { transactions } = useBillar();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredTrx = transactions.filter(t => {
    const matchesType = typeFilter === 'all' || t.type.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesSearch = t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.method.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

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
            Historial de Operaciones
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Registro cronológico y trazabilidad de partidas cobradas y ventas realizadas.
          </p>
        </div>

        <button 
          className="btn btn-secondary"
          onClick={() => alert('Exportación CSV simulada para demostración')}
        >
          <Download size={16} />
          <span>Exportar Datos</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="card" style={{ padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-bar" style={{ flex: 1, minWidth: '240px' }}>
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Buscar por ID, detalle o método de pago..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'all', label: 'Todas las Operaciones' },
              { id: 'Mesa', label: 'Mesas' },
              { id: 'POS', label: 'Ventas POS' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setTypeFilter(f.id)}
                style={{
                  border: 'none',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: typeFilter === f.id ? 'var(--color-terracotta)' : 'var(--bg-canvas)',
                  color: typeFilter === f.id ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-container">
        <table className="table-custom">
          <thead>
            <tr>
              <th>ID Transacción</th>
              <th>Momento</th>
              <th>Tipo de Operación</th>
              <th>Detalle de la Operación</th>
              <th>Método de Pago</th>
              <th>Monto Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrx.map(trx => (
              <tr key={trx.id}>
                <td style={{ fontWeight: 800, color: 'var(--color-charcoal)' }}>
                  {trx.id}
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  {trx.time}
                </td>
                <td>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: trx.type.includes('Mesa') ? 'var(--terracotta-subtle)' : 'var(--surface-hover)',
                    color: trx.type.includes('Mesa') ? 'var(--color-terracotta)' : 'var(--text-primary)'
                  }}>
                    {trx.type}
                  </span>
                </td>
                <td style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', maxWidth: '300px' }}>
                  {trx.description}
                </td>
                <td>
                  <span style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--color-charcoal)' }}>
                    {trx.method}
                  </span>
                </td>
                <td className="font-display tabular-nums" style={{ fontWeight: 800, color: 'var(--color-terracotta)', fontSize: '0.98rem' }}>
                  S/ {trx.amount.toFixed(2)}
                </td>
                <td>
                  <span className="badge badge-available">
                    <span className="badge-dot" />
                    {trx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
