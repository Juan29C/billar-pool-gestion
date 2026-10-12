import React, { useState } from 'react';
import { 
  Play, 
  X, 
  Plus, 
  Check, 
  Coffee, 
  CircleDollarSign, 
  Filter, 
  Clock, 
  Sparkles,
  Receipt
} from 'lucide-react';
import { useBillar } from '../context/BillarContext';
import TableCard from '../components/TableCard';

export default function TablesView() {
  const { 
    tables, 
    rates, 
    products, 
    startTable, 
    addOrderToTable, 
    checkoutTable,
    getTableElapsedSeconds,
    getTableTimeCost,
    getTableOrdersCost,
    getTableTotalCost,
    formatTime
  } = useBillar();

  const [filter, setFilter] = useState('all'); // 'all' | 'available' | 'occupied' | 'pending'

  // Modales
  const [selectedTable, setSelectedTable] = useState(null);
  const [modalType, setModalType] = useState(null); // 'start' | 'order' | 'checkout'

  // Form states
  const [selectedRateId, setSelectedRateId] = useState(rates[0]?.id || '');
  const [playersName, setPlayersName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || '');
  const [orderQty, setOrderQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');

  const filteredTables = tables.filter(t => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  const poolTables = filteredTables.filter(t => t.tableType === 'pool' || t.type?.toLowerCase().includes('pool'));
  const caromTables = filteredTables.filter(t => t.tableType === 'carom' || t.type?.toLowerCase().includes('bandas'));

  const handleOpenStart = (table) => {
    setSelectedTable(table);
    setSelectedRateId(table.rateId || rates[0]?.id);
    setPlayersName('');
    setModalType('start');
  };

  const handleOpenOrder = (table) => {
    setSelectedTable(table);
    setSelectedProduct(products[0]?.id || '');
    setOrderQty(1);
    setModalType('order');
  };

  const handleOpenCheckout = (table) => {
    setSelectedTable(table);
    setPaymentMethod('Efectivo');
    setModalType('checkout');
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedTable(null);
  };

  const confirmStart = (e) => {
    e.preventDefault();
    if (!selectedTable) return;
    startTable(selectedTable.id, selectedRateId, playersName);
    closeModal();
  };

  const confirmAddOrder = (e) => {
    e.preventDefault();
    if (!selectedTable) return;
    const prod = products.find(p => p.id === selectedProduct);
    if (prod) {
      addOrderToTable(selectedTable.id, prod, Number(orderQty));
    }
    closeModal();
  };

  const confirmCheckout = () => {
    if (!selectedTable) return;
    checkoutTable(selectedTable.id, paymentMethod);
    closeModal();
  };

  return (
    <div className="animate-fade-in" style={{ padding: '24px 28px' }}>
      {/* Header and Filter Controls */}
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
            Mesas de Billar en Sala
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Distribuido en 6 mesas oficiales: 4 de Pool Americano y 2 de Billar Francés (Tres Bandas).
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--surface-card)',
          padding: '4px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)'
        }}>
          {[
            { id: 'all', label: 'Todas las Mesas', count: tables.length },
            { id: 'available', label: 'Disponibles', count: tables.filter(t => t.status === 'available').length },
            { id: 'occupied', label: 'En Juego', count: tables.filter(t => t.status === 'occupied').length },
            { id: 'pending', label: 'Por Cobrar', count: tables.filter(t => t.status === 'pending').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                border: 'none',
                padding: '7px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: filter === tab.id ? 'var(--color-terracotta)' : 'transparent',
                color: filter === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* --- SECCIÓN 1: ZONA POOL (4 MESAS) --- */}
      {poolTables.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '8px'
          }}>
            <span style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: '#1E1B19',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 900
            }}>
              8
            </span>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-charcoal)', margin: 0 }}>
                Zona de Pool (4 Mesas con Troneras)
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Mesas oficiales de bola 8 / 9 • Tarifa: S/ 15.00/hora
              </span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '20px'
          }}>
            {poolTables.map(table => (
              <TableCard
                key={table.id}
                table={table}
                onOpenStartModal={handleOpenStart}
                onOpenOrderModal={handleOpenOrder}
                onOpenCheckoutModal={handleOpenCheckout}
              />
            ))}
          </div>
        </div>
      )}

      {/* --- SECCIÓN 2: ZONA BILLAR TRES BANDAS (2 MESAS) --- */}
      {caromTables.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '8px'
          }}>
            <div style={{ display: 'flex', gap: '3px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: '1px solid #777' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FFD166' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#E63946' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-charcoal)', margin: 0 }}>
                Zona de Billar Francés (2 Mesas Tres Bandas)
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Mesas de carambola sin troneras con diamantes de guía • Tarifa: S/ 20.00/hora
              </span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '20px'
          }}>
            {caromTables.map(table => (
              <TableCard
                key={table.id}
                table={table}
                onOpenStartModal={handleOpenStart}
                onOpenOrderModal={handleOpenOrder}
                onOpenCheckoutModal={handleOpenCheckout}
              />
            ))}
          </div>
        </div>
      )}

      {/* --- MODAL INICIAR PARTIDA --- */}
      {modalType === 'start' && selectedTable && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Iniciar Partida en {selectedTable.name}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Apertura y activación de cronómetro de mesa
                </span>
              </div>
              <button className="btn-ghost" onClick={closeModal} style={{ border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={confirmStart}>
              <div className="modal-body">
                <div className="input-group">
                  <label className="input-label">Tarifa por Hora</label>
                  <select 
                    className="input-field"
                    value={selectedRateId}
                    onChange={e => setSelectedRateId(e.target.value)}
                  >
                    {rates.map(rate => (
                      <option key={rate.id} value={rate.id}>
                        {rate.name} — S/ {rate.pricePerHour.toFixed(2)}/hora
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Nombre del Cliente / Grupo (Opcional)</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Ej. Grupo Carlos / Amigos"
                    value={playersName}
                    onChange={e => setPlayersName(e.target.value)}
                    autoFocus
                  />
                </div>

                <div style={{
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-canvas)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.84rem',
                  color: 'var(--text-secondary)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-charcoal)', fontWeight: 700, marginBottom: '4px' }}>
                    <Clock size={16} color="var(--color-terracotta)" />
                    <span>Control en Tiempo Real</span>
                  </div>
                  El cronómetro comenzará a contar inmediatamente con la tarifa seleccionada. Podrás agregar bebidas o piqueos en cualquier momento.
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Play size={16} fill="currentColor" />
                  <span>Comenzar Partida</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL AGREGAR CONSUMO --- */}
      {modalType === 'order' && selectedTable && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Añadir Consumo — {selectedTable.name}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Asociar bebidas o snacks a la cuenta de la mesa
                </span>
              </div>
              <button className="btn-ghost" onClick={closeModal} style={{ border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={confirmAddOrder}>
              <div className="modal-body">
                <div className="input-group">
                  <label className="input-label">Seleccionar Producto</label>
                  <select 
                    className="input-field"
                    value={selectedProduct}
                    onChange={e => setSelectedProduct(e.target.value)}
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                        {p.name} — S/ {p.price.toFixed(2)} (Stock: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Cantidad</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setOrderQty(Math.max(1, orderQty - 1))}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      className="input-field" 
                      style={{ textAlign: 'center', width: '80px' }}
                      min="1"
                      value={orderQty}
                      onChange={e => setOrderQty(Math.max(1, parseInt(e.target.value) || 1))}
                    />
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setOrderQty(orderQty + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Pedidos actuales de la mesa */}
                {selectedTable.orders.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      Consumos Ya Registrados:
                    </span>
                    <div style={{
                      marginTop: '8px',
                      backgroundColor: 'var(--bg-canvas)',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px 14px',
                      fontSize: '0.82rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      {selectedTable.orders.map((o, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{o.qty}x {o.name}</span>
                          <span className="tabular-nums" style={{ fontWeight: 600 }}>S/ {(o.price * o.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} />
                  <span>Añadir a la Cuenta</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL FINALIZAR Y COBRAR MESA --- */}
      {modalType === 'checkout' && selectedTable && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Liquidación y Cobro — {selectedTable.name}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Resumen de tiempo y consumos para cierre de partida
                </span>
              </div>
              <button className="btn-ghost" onClick={closeModal} style={{ border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Resumen Ticket */}
              <div style={{
                backgroundColor: 'var(--bg-canvas)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                padding: '18px',
                marginBottom: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px dashed var(--border-medium)',
                  paddingBottom: '10px',
                  marginBottom: '10px'
                }}>
                  <div>
                    <strong style={{ color: 'var(--color-charcoal)' }}>{selectedTable.name}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {selectedTable.type} ({selectedTable.players || 'Cliente General'})
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="tabular-nums font-display" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                      {formatTime(getTableElapsedSeconds(selectedTable))}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tiempo Jugado</span>
                  </div>
                </div>

                {/* Desglose */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Costo de Tiempo (S/ {selectedTable.pricePerHour.toFixed(2)}/h):</span>
                    <span className="tabular-nums font-display" style={{ fontWeight: 600 }}>
                      S/ {getTableTimeCost(selectedTable).toFixed(2)}
                    </span>
                  </div>

                  {selectedTable.orders.map((ord, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span>{ord.qty}x {ord.name}:</span>
                      <span className="tabular-nums font-display" style={{ fontWeight: 600 }}>
                        S/ {(ord.price * ord.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '2px solid var(--border-subtle)',
                    paddingTop: '10px',
                    marginTop: '6px',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--color-charcoal)'
                  }}>
                    <span>TOTAL A PAGAR:</span>
                    <span className="tabular-nums font-display" style={{ color: 'var(--color-terracotta)', fontSize: '1.45rem' }}>
                      S/ {getTableTotalCost(selectedTable).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Selector de Método de Pago */}
              <div className="input-group">
                <label className="input-label">Seleccionar Método de Pago</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {['Efectivo', 'Yape', 'Plin', 'Tarjeta'].map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      style={{
                        padding: '10px 8px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid',
                        borderColor: paymentMethod === method ? 'var(--color-terracotta)' : 'var(--border-subtle)',
                        backgroundColor: paymentMethod === method ? 'var(--terracotta-subtle)' : 'var(--surface-card)',
                        color: paymentMethod === method ? 'var(--color-terracotta)' : 'var(--text-secondary)',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={confirmCheckout}
              >
                <Check size={16} />
                <span>Confirmar Cobro y Liberar Mesa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
