import React, { useState } from 'react';
import {
  Play,
  Plus,
  Check,
  Coffee,
  Clock,
  Receipt,
  CreditCard,
  Banknote,
  Smartphone,
  Info,
  Beer,
  CircleDot,
  Search,
  UtensilsCrossed,
  Package,
  Sparkles
} from 'lucide-react';
import { useBillar } from '../context/BillarContext';
import TableCard from '../components/TableCard';
import Modal from '../components/Modal';

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
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');

  // Estado del catálogo dentro del modal de consumo (Buscador limpio sin preselección)
  const [orderSearch, setOrderSearch] = useState('');
  const [orderCategory, setOrderCategory] = useState('all');
  const [selectedProductId, setSelectedProductId] = useState(''); // Inicialmente vacío
  const [orderQty, setOrderQty] = useState(1);

  const categories = ['all', 'Cervezas', 'Bebidas Sin Alcohol', 'Piqueos', 'Snacks', 'Accesorios'];

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
    setOrderSearch('');
    setOrderCategory('all');
    setSelectedProductId(''); // Limpio, sin producto forzado
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
    setSelectedProductId('');
  };

  const confirmStart = (e) => {
    if (e) e.preventDefault();
    if (!selectedTable) return;
    startTable(selectedTable.id, selectedRateId, playersName);
    closeModal();
  };

  const confirmAddOrder = (e) => {
    if (e) e.preventDefault();
    if (!selectedTable || !selectedProductId) return;
    const prod = products.find(p => p.id === selectedProductId);
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

  // Filtrado de productos para el catálogo del modal
  const modalProducts = products.filter(p => {
    const matchesCategory = orderCategory === 'all' || p.category === orderCategory;
    const matchesSearch = p.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeProduct = products.find(p => p.id === selectedProductId);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Cervezas':
        return <Beer size={18} color="var(--color-terracotta)" />;
      case 'Piqueos':
      case 'Snacks':
        return <UtensilsCrossed size={18} color="var(--status-occupied)" />;
      default:
        return <Package size={18} color="var(--text-muted)" />;
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: 'clamp(16px, 2.5vw, 28px)' }}>
      {/* Header and Filter Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.45rem)', fontWeight: 800, color: 'var(--color-charcoal)', margin: 0 }}>
            Mesas de Billar en Sala
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Distribución oficial: 4 mesas de Pool (troneras) y 2 de Billar Francés (Tres Bandas).
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'var(--surface-card)',
          padding: '4px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          overflowX: 'auto',
          maxWidth: '100%'
        }}>
          {[
            { id: 'all', label: 'Todas', count: tables.length },
            { id: 'available', label: 'Libres', count: tables.filter(t => t.status === 'available').length },
            { id: 'occupied', label: 'En Juego', count: tables.filter(t => t.status === 'occupied').length },
            { id: 'pending', label: 'Por Cobrar', count: tables.filter(t => t.status === 'pending').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                border: 'none',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: filter === tab.id ? 'var(--color-terracotta)' : 'transparent',
                color: filter === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
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
        <div style={{ marginBottom: '28px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '14px',
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
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-charcoal)', margin: 0 }}>
                Zona de Pool (4 Mesas con Troneras)
              </h3>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Tarifa oficial: S/ 15.00/hora • Bola 8 y 9
              </span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(270px, 22vw, 320px), 1fr))',
            gap: '18px'
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
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '14px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '8px'
          }}>
            <div style={{ display: 'flex', gap: '3px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: '1px solid #777' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FFD166' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#E63946' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-charcoal)', margin: 0 }}>
                Zona de Billar Francés (2 Mesas Tres Bandas)
              </h3>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Tarifa oficial: S/ 20.00/hora • Carambola sin troneras
              </span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(270px, 22vw, 320px), 1fr))',
            gap: '18px'
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

      {/* =========================================================================
          MODAL 1: INICIAR PARTIDA (CENTRADO, ELEGANTE)
          ========================================================================= */}
      <Modal
        isOpen={modalType === 'start' && !!selectedTable}
        onClose={closeModal}
        title={`Iniciar Partida — ${selectedTable?.name}`}
        subtitle={`Activación de mesa (${selectedTable?.type})`}
        icon={CircleDot}
        maxWidth="600px"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary modal-btn"
              onClick={closeModal}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary modal-btn"
              onClick={confirmStart}
            >
              <Play size={16} fill="currentColor" />
              <span>Comenzar Partida</span>
            </button>
          </>
        }
      >
        {selectedTable && (
          <form onSubmit={confirmStart} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Tarifa por Hora de Juego</label>
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

            <div className="input-group" style={{ marginBottom: 0 }}>
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
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.84rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}>
              <Info size={18} color="var(--color-terracotta)" style={{ flexShrink: 0 }} />
              <div>
                <strong>Control en Tiempo Real:</strong> El cronómetro se activará al instante y podrás cargar cervezas y snacks en cualquier momento.
              </div>
            </div>
          </form>
        )}
      </Modal>

      {/* =========================================================================
        MODAL 2: AÑADIR CONSUMO — REDISEÑO AMPLIO (1020px) CON CATÁLOGO Y BUSCADOR
        ========================================================================= */}
      <Modal
          isOpen={modalType === 'order' && !!selectedTable}
          onClose={closeModal}
          title={`Añadir Consumo — ${selectedTable?.name}`}
          subtitle="Buscar cervezas, bebidas o piqueos y agregarlos a la cuenta de la mesa"
          icon={Beer}
          maxWidth="1020px"
          footer={
            <>
              <button
                type="button"
                className="btn btn-secondary modal-btn"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary modal-btn"
                disabled={!activeProduct}
                onClick={confirmAddOrder}
                style={{
                  opacity: !activeProduct ? 0.6 : 1,
                  cursor: !activeProduct ? 'not-allowed' : 'pointer'
                }}
              >
                <Plus size={16} />
                <span>
                  {activeProduct
                    ? `Añadir ${orderQty}x ${activeProduct.name.split(' ')[0]} (S/ ${(activeProduct.price * orderQty).toFixed(2)})`
                    : 'Selecciona un Producto'}
                </span>
              </button>
            </>
          }
        >
          {selectedTable && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(380px, 1.35fr) minmax(320px, 1fr)',
              gap: '24px',
              alignItems: 'stretch'
            }}>
              {/* --- COLUMNA IZQUIERDA: BUSCADOR LIMPIO Y CATÁLOGO --- */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label className="input-label" style={{ marginBottom: '6px', display: 'block' }}>
                    Buscador de Productos del Bar
                  </label>
                  <div className="search-bar" style={{ padding: '8px 14px', borderRadius: '10px' }}>
                    <Search size={18} color="var(--text-muted)" />
                    <input
                      type="text"
                      placeholder="🔍 Escribe para buscar (ej. cerveza, tequeños, red bull)..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      autoFocus
                      style={{ fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                {/* Chips de Categorías */}
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setOrderCategory(cat)}
                      style={{
                        border: '1px solid var(--border-subtle)',
                        padding: '5px 12px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: orderCategory === cat ? 'var(--color-terracotta)' : 'var(--bg-canvas)',
                        color: orderCategory === cat ? '#FFFFFF' : 'var(--text-secondary)',
                        fontWeight: 700,
                        fontSize: '0.74rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      {cat === 'all' ? 'Todos' : cat}
                    </button>
                  ))}
                </div>

                {/* Lista Visual de Productos (Más Amplia y Cómoda) */}
                <div style={{
                  maxHeight: '360px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  paddingRight: '4px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '8px',
                  backgroundColor: 'var(--bg-canvas)'
                }}>
                  {modalProducts.length === 0 ? (
                    <div style={{ padding: '30px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      No se encontraron productos coincidentes con tu búsqueda.
                    </div>
                  ) : (
                    modalProducts.map(p => {
                      const isSelected = selectedProductId === p.id;
                      const isOutOfStock = p.stock <= 0;

                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            if (!isOutOfStock) {
                              setSelectedProductId(p.id);
                            }
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            backgroundColor: isSelected ? 'var(--terracotta-subtle)' : 'var(--surface-card)',
                            border: `1.5px solid ${isSelected ? 'var(--color-terracotta)' : 'var(--border-subtle)'}`,
                            cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                            opacity: isOutOfStock ? 0.5 : 1,
                            boxShadow: isSelected ? '0 2px 8px var(--terracotta-glow)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: isSelected ? '#FFFFFF' : 'var(--bg-canvas)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              {getCategoryIcon(p.category)}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{
                                fontWeight: 700,
                                fontSize: '0.86rem',
                                color: 'var(--color-charcoal)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>
                                {p.name}
                              </div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                {p.category}
                              </span>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div className="font-display tabular-nums" style={{ fontWeight: 800, color: 'var(--color-terracotta)', fontSize: '0.96rem' }}>
                              S/ {p.price.toFixed(2)}
                            </div>
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              color: isOutOfStock ? 'var(--status-danger)' : p.stock <= p.minStock ? 'var(--status-occupied)' : 'var(--status-available)'
                            }}>
                              {isOutOfStock ? 'Agotado' : `Stock: ${p.stock}`}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* --- COLUMNA DERECHA: SELECCIÓN ACTUAL Y CUENTA DE LA MESA --- */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                {/* Tarjeta del Producto Seleccionado */}
                <div style={{
                  backgroundColor: 'var(--bg-canvas)',
                  borderRadius: '14px',
                  border: '1px solid var(--border-subtle)',
                  padding: '16px'
                }}>
                  <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 800 }}>
                    Producto Seleccionado
                  </span>

                  {activeProduct ? (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
                        {activeProduct.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        Precio unitario: <strong style={{ color: 'var(--color-terracotta)' }}>S/ {activeProduct.price.toFixed(2)}</strong> • {activeProduct.stock} disponibles
                      </div>

                      {/* Selector de Cantidades */}
                      <div style={{ marginTop: '16px' }}>
                        <label className="input-label" style={{ marginBottom: '6px', display: 'block' }}>Cantidad a Servir</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ width: '44px', height: '44px', padding: 0, fontSize: '1.3rem', fontWeight: 800 }}
                            onClick={() => setOrderQty(Math.max(1, orderQty - 1))}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            className="input-field"
                            style={{ textAlign: 'center', width: '70px', height: '44px', fontWeight: 800, fontSize: '1.1rem' }}
                            min="1"
                            max={activeProduct.stock}
                            value={orderQty}
                            onChange={e => setOrderQty(Math.min(activeProduct.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                          />
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ width: '44px', height: '44px', padding: 0, fontSize: '1.3rem', fontWeight: 800 }}
                            onClick={() => setOrderQty(Math.min(activeProduct.stock, orderQty + 1))}
                          >
                            +
                          </button>

                          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Subtotal:</span>
                            <div className="font-display tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-terracotta)' }}>
                              S/ {(activeProduct.price * orderQty).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      padding: '28px 14px',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                      border: '1.5px dashed var(--border-medium)',
                      borderRadius: '10px',
                      marginTop: '8px'
                    }}>
                      Haz clic en cualquier producto de la lista izquierda para asignarlo a esta mesa.
                    </div>
                  )}
                </div>

                {/* Resumen de Consumos ya Registrados en la Mesa */}
                <div style={{
                  backgroundColor: 'var(--bg-canvas)',
                  borderRadius: '14px',
                  border: '1px solid var(--border-subtle)',
                  padding: '14px 16px',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 800 }}>
                      Consumos Anteriores ({selectedTable.orders.reduce((a, b) => a + b.qty, 0)})
                    </span>
                    <span className="tabular-nums font-display" style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
                      Total: S/ {getTableOrdersCost(selectedTable).toFixed(2)}
                    </span>
                  </div>

                  <div style={{ maxHeight: '130px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {selectedTable.orders.length === 0 ? (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        Sin consumos previos registrados en esta partida.
                      </span>
                    ) : (
                      selectedTable.orders.map((o, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{o.qty}x {o.name}</span>
                          <span className="tabular-nums font-display" style={{ fontWeight: 700, color: 'var(--color-charcoal)' }}>
                            S/ {(o.price * o.qty).toFixed(2)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* =========================================================================
          MODAL 3: LIQUIDACIÓN Y COBRO (CENTRADO, ANCHO 700px, VOUCHER IMPECABLE)
          ========================================================================= */}
        <Modal
          isOpen={modalType === 'checkout' && !!selectedTable}
          onClose={closeModal}
          title={`Liquidación y Cobro — ${selectedTable?.name}`}
          subtitle="Resumen de tiempo y consumos para cierre de partida"
          icon={Receipt}
          maxWidth="700px"
          footer={
            <>
              <button
                type="button"
                className="btn btn-secondary modal-btn"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary modal-btn"
                onClick={confirmCheckout}
              >
                <Check size={16} />
                <span>Confirmar Cobro y Liberar Mesa</span>
              </button>
            </>
          }
        >
          {selectedTable && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* TICKET / VOUCHER CONTABLE PERFECTAMENTE ALINEADO */}
              <div className="receipt-card">
                {/* Cabecera del Voucher */}
                <div className="receipt-header">
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
                      {selectedTable.name}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {selectedTable.type} • {selectedTable.players || 'Cliente General'}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div className="tabular-nums font-display" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
                      {formatTime(getTableElapsedSeconds(selectedTable))}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Tiempo Jugado
                    </span>
                  </div>
                </div>

                {/* Detalle de Conceptos */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div className="receipt-row">
                    <span>Costo de Tiempo (S/ {selectedTable.pricePerHour.toFixed(2)}/h):</span>
                    <span className="tabular-nums font-display" style={{ fontWeight: 700, color: 'var(--color-charcoal)', fontSize: '0.94rem' }}>
                      S/ {getTableTimeCost(selectedTable).toFixed(2)}
                    </span>
                  </div>

                  {selectedTable.orders.map((ord, idx) => (
                    <div key={idx} className="receipt-row">
                      <span>{ord.qty}x {ord.name}:</span>
                      <span className="tabular-nums font-display" style={{ fontWeight: 700, color: 'var(--color-charcoal)', fontSize: '0.94rem' }}>
                        S/ {(ord.price * ord.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}

                  {/* Fila de Total Destacada y Alineada */}
                  <div className="receipt-total-row">
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-charcoal)', letterSpacing: '0.04em' }}>
                      TOTAL A PAGAR:
                    </span>
                    <span className="tabular-nums font-display" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-terracotta)' }}>
                      S/ {getTableTotalCost(selectedTable).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* SELECTOR DE MÉTODO DE PAGO UNIFORME */}
              <div>
                <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>
                  Seleccionar Método de Pago
                </label>
                <div className="payment-grid">
                  {[
                    { id: 'Efectivo', label: 'Efectivo', icon: Banknote },
                    { id: 'Yape', label: 'Yape', icon: Smartphone },
                    { id: 'Plin', label: 'Plin', icon: Smartphone },
                    { id: 'Tarjeta', label: 'Tarjeta', icon: CreditCard }
                  ].map(item => {
                    const Icon = item.icon;
                    const isActive = paymentMethod === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPaymentMethod(item.id)}
                        className={`payment-chip ${isActive ? 'active' : ''}`}
                      >
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </Modal>
    </div>
  );
}
