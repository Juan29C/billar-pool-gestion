import React, { useState } from 'react';
import {
  Play,
  Plus,
  Minus,
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
  Sparkles,
  RotateCcw,
  Trash2,
  ShoppingBag,
  SlidersHorizontal
} from 'lucide-react';
import { useBillar } from '../context/BillarContext';
import TableCard from '../components/TableCard';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';

export default function TablesView() {
  const {
    tables,
    rates,
    products,
    startTable,
    addOrderToTable,
    addOrdersToTable,
    adjustTableTime,
    resetDemoData,
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
  const [modalType, setModalType] = useState(null); // 'start' | 'order' | 'checkout' | 'adjust_time'

  // Form states: Apertura de Mesa
  const [selectedRateId, setSelectedRateId] = useState(rates[0]?.id || '');
  const [playersName, setPlayersName] = useState('');
  const [startTimingMode, setStartTimingMode] = useState('0'); // '0' | '15' | '30' | '45' | '60' | 'custom'
  const [customStartMinutes, setCustomStartMinutes] = useState(15);

  // Form states: Ajuste de Tiempo en mesa activa
  const [adjustMinutes, setAdjustMinutes] = useState(30);

  // Form states: Cobro
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');

  // Estado del catálogo y COMANDA MULTI-PRODUCTO para añadir consumo a la mesa
  const [orderSearch, setOrderSearch] = useState('');
  const [orderCategory, setOrderCategory] = useState('all');
  const [orderBasket, setOrderBasket] = useState([]); // [{ id, name, price, qty, stock, category }]

  // Confirmación y Toast de Reinicio de Demo
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccessToast, setResetSuccessToast] = useState(false);

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
    setStartTimingMode('0');
    setCustomStartMinutes(15);
    setModalType('start');
  };

  const handleOpenOrder = (table) => {
    setSelectedTable(table);
    setOrderSearch('');
    setOrderCategory('all');
    setOrderBasket([]); // Inicia comanda limpia para seleccionar múltiples productos a la vez
    setModalType('order');
  };

  const handleOpenCheckout = (table) => {
    setSelectedTable(table);
    setPaymentMethod('Efectivo');
    setModalType('checkout');
  };

  const handleOpenAdjustTime = (table) => {
    setSelectedTable(table);
    const currentMins = Math.floor(getTableElapsedSeconds(table) / 60);
    setAdjustMinutes(currentMins > 0 ? currentMins : 30);
    setModalType('adjust_time');
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedTable(null);
    setOrderBasket([]);
  };

  // Apertura de mesa con soporte para inicio en tiempo real o retroactivo
  const confirmStart = (e) => {
    if (e) e.preventDefault();
    if (!selectedTable) return;
    const minutes = startTimingMode === 'custom' 
      ? Math.max(0, parseInt(customStartMinutes, 10) || 0) 
      : parseInt(startTimingMode, 10) || 0;
    startTable(selectedTable.id, selectedRateId, playersName, minutes);
    closeModal();
  };

  // Ajuste manual de tiempo transcurrido en cronómetro
  const confirmAdjustTime = (e) => {
    if (e) e.preventDefault();
    if (!selectedTable) return;
    adjustTableTime(selectedTable.id, adjustMinutes);
    closeModal();
  };

  // Funciones de Comanda Multi-Producto
  const addToBasket = (product) => {
    if (product.stock <= 0) return;
    setOrderBasket(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.qty < product.stock) {
          return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
        }
        return prev;
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        qty: 1,
        stock: product.stock,
        category: product.category
      }];
    });
  };

  const updateBasketQty = (productId, newQty) => {
    if (newQty <= 0) {
      setOrderBasket(prev => prev.filter(item => item.id !== productId));
      return;
    }
    setOrderBasket(prev => prev.map(item => {
      if (item.id === productId) {
        return { ...item, qty: Math.min(item.stock, newQty) };
      }
      return item;
    }));
  };

  const removeFromBasket = (productId) => {
    setOrderBasket(prev => prev.filter(item => item.id !== productId));
  };

  const basketTotal = orderBasket.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const basketUnits = orderBasket.reduce((sum, item) => sum + item.qty, 0);

  // Confirmar y cargar comanda completa a la cuenta de la mesa
  const confirmAddOrder = (e) => {
    if (e) e.preventDefault();
    if (!selectedTable || orderBasket.length === 0) return;
    addOrdersToTable(selectedTable.id, orderBasket);
    closeModal();
  };

  const confirmCheckout = () => {
    if (!selectedTable) return;
    checkoutTable(selectedTable.id, paymentMethod);
    closeModal();
  };

  // Reiniciar datos de demo para limpiar tiempos viejos acumulados (ej. 147h)
  const handleConfirmReset = () => {
    resetDemoData();
    setShowResetConfirm(false);
    setResetSuccessToast(true);
    setTimeout(() => setResetSuccessToast(false), 3500);
  };

  // Filtrado de productos para el catálogo del modal
  const modalProducts = products.filter(p => {
    const matchesCategory = orderCategory === 'all' || p.category === orderCategory;
    const matchesSearch = p.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
      {/* Toast de confirmación de reseteo */}
      {resetSuccessToast && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 18px',
          backgroundColor: '#1E382B',
          border: '1px solid #2E5A44',
          color: '#E8F5E9',
          borderRadius: 'var(--radius-md)',
          marginBottom: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          animation: 'fadeIn 0.25s ease'
        }}>
          <Check size={18} color="#4ADE80" />
          <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>
            Tiempos de demostración restablecidos con éxito. Los cronómetros ahora muestran partidas realistas en curso.
          </span>
        </div>
      )}

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

        {/* Acciones de Cabecera y Filtros */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Botón de Restablecer Tiempos Demo */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowResetConfirm(true)}
            title="Reiniciar cronómetros acumulados en el navegador y restaurar tiempos coherentes de demostración"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              padding: '7px 12px',
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-secondary)'
            }}
          >
            <RotateCcw size={14} color="var(--color-terracotta)" />
            <span>Restablecer Tiempos Demo</span>
          </button>

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
                onOpenAdjustTimeModal={handleOpenAdjustTime}
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
                onOpenAdjustTimeModal={handleOpenAdjustTime}
              />
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: INICIAR PARTIDA CON SELECTOR DE HORA DE INICIO
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

            {/* Selector de Momento de Inicio */}
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={15} color="var(--color-terracotta)" />
                <span>Momento de Inicio del Cronómetro</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px', marginTop: '4px' }}>
                {[
                  { id: '0', label: 'Ahora mismo (00:00)' },
                  { id: '15', label: 'Hace 15 min' },
                  { id: '30', label: 'Hace 30 min' },
                  { id: '45', label: 'Hace 45 min' },
                  { id: '60', label: 'Hace 1 hora' },
                  { id: 'custom', label: 'Personalizado' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStartTimingMode(item.id)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: `1.5px solid ${startTimingMode === item.id ? 'var(--color-terracotta)' : 'var(--border-subtle)'}`,
                      backgroundColor: startTimingMode === item.id ? 'var(--terracotta-subtle)' : 'var(--bg-canvas)',
                      color: startTimingMode === item.id ? 'var(--color-terracotta)' : 'var(--text-secondary)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {startTimingMode === 'custom' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Minutos transcurridos:</span>
                  <input
                    type="number"
                    className="input-field"
                    style={{ width: '90px', padding: '6px 10px', textAlign: 'center', fontWeight: 700 }}
                    min="1"
                    max="600"
                    value={customStartMinutes}
                    onChange={e => setCustomStartMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>minutos</span>
                </div>
              )}
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
                <strong>Control en Tiempo Real:</strong> El cronómetro calculará el importe en vivo y podrás añadir consumos de bebidas y snacks a la comanda en cualquier momento.
              </div>
            </div>
          </form>
        )}
      </Modal>

      {/* =========================================================================
        MODAL 2: AÑADIR CONSUMO — SISTEMA DE COMANDA MULTI-PRODUCTO
        ========================================================================= */}
      <Modal
        isOpen={modalType === 'order' && !!selectedTable}
        onClose={closeModal}
        title={`Añadir Consumo — ${selectedTable?.name}`}
        subtitle="Selecciona cervezas, bebidas o piqueos y cárgalos a la comanda de la mesa"
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
              disabled={orderBasket.length === 0}
              onClick={confirmAddOrder}
              style={{
                opacity: orderBasket.length === 0 ? 0.6 : 1,
                cursor: orderBasket.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              <Plus size={16} />
              <span>
                {orderBasket.length === 0
                  ? 'Selecciona al menos un producto'
                  : `Cargar ${basketUnits} producto${basketUnits > 1 ? 's' : ''} a la Mesa (S/ ${basketTotal.toFixed(2)})`}
              </span>
            </button>
          </>
        }
      >
        {selectedTable && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(360px, 1.25fr) minmax(340px, 1fr)',
            gap: '24px',
            alignItems: 'stretch'
          }}>
            {/* --- COLUMNA IZQUIERDA: CATÁLOGO Y BUSCADOR --- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="input-label" style={{ marginBottom: '6px', display: 'block' }}>
                  Catálogo del Bar y Snacks
                </label>
                <div className="search-bar" style={{ padding: '8px 14px', borderRadius: '10px' }}>
                  <Search size={18} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder="🔍 Buscar por nombre o SKU (ej. cusqueña, tequeños)..."
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

              {/* Lista Visual de Productos con botón directo para agregar a la comanda */}
              <div style={{
                maxHeight: '380px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
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
                    const itemInBasket = orderBasket.find(i => i.id === p.id);
                    const isOutOfStock = p.stock <= 0;

                    return (
                      <div
                        key={p.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          backgroundColor: itemInBasket ? 'var(--terracotta-subtle)' : 'var(--surface-card)',
                          border: `1.5px solid ${itemInBasket ? 'var(--color-terracotta)' : 'var(--border-subtle)'}`,
                          opacity: isOutOfStock ? 0.5 : 1,
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: itemInBasket ? '#FFFFFF' : 'var(--bg-canvas)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {getCategoryIcon(p.category)}
                          </div>
                          <div style={{ minWidth: 0, paddingRight: '8px' }}>
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem' }}>
                              <span style={{ color: 'var(--text-muted)' }}>{p.category}</span>
                              <span style={{ color: 'var(--border-medium)' }}>•</span>
                              <span style={{
                                fontWeight: 700,
                                color: isOutOfStock ? 'var(--status-danger)' : p.stock <= p.minStock ? 'var(--status-occupied)' : 'var(--status-available)'
                              }}>
                                {isOutOfStock ? 'Agotado' : `${p.stock} disp.`}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Precio y Botón de Añadir */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                          <div className="font-display tabular-nums" style={{ fontWeight: 800, color: 'var(--color-terracotta)', fontSize: '0.96rem' }}>
                            S/ {p.price.toFixed(2)}
                          </div>

                          <button
                            type="button"
                            disabled={isOutOfStock}
                            onClick={() => addToBasket(p)}
                            style={{
                              border: 'none',
                              backgroundColor: itemInBasket ? 'var(--color-terracotta)' : 'var(--color-charcoal)',
                              color: '#FFFFFF',
                              borderRadius: '8px',
                              padding: '6px 10px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <Plus size={14} />
                            <span>{itemInBasket ? `${itemInBasket.qty}x` : 'Agregar'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* --- COLUMNA DERECHA: COMANDA A CARGAR Y CONSUMOS PREVIOS --- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Tarjeta de Comanda de la Mesa */}
              <div style={{
                backgroundColor: 'var(--bg-canvas)',
                borderRadius: '14px',
                border: '1.5px solid var(--border-subtle)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                flex: 1
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 800 }}>
                      Comanda a Cargar
                    </span>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
                      {orderBasket.length === 0 ? 'Sin productos añadidos' : `${basketUnits} ítems en comanda`}
                    </div>
                  </div>

                  {orderBasket.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setOrderBasket([])}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--status-danger)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Limpiar Comanda
                    </button>
                  )}
                </div>

                {/* Lista de productos en la comanda actual */}
                <div style={{
                  flex: 1,
                  maxHeight: '230px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  paddingRight: '4px'
                }}>
                  {orderBasket.length === 0 ? (
                    <div style={{
                      padding: '36px 16px',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '0.86rem',
                      border: '1.5px dashed var(--border-medium)',
                      borderRadius: '10px'
                    }}>
                      <ShoppingBag size={28} color="var(--text-muted)" style={{ margin: '0 auto 8px', opacity: 0.6 }} />
                      <p style={{ margin: 0 }}>Haz clic en <strong>"Agregar"</strong> en cualquier producto de la izquierda para sumarlo a esta comanda.</p>
                      <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: 'var(--text-muted)' }}>Puedes elegir múltiples cervezas, gaseosas o piqueos a la vez.</p>
                    </div>
                  ) : (
                    orderBasket.map(item => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 10px',
                          backgroundColor: 'var(--surface-card)',
                          borderRadius: '8px',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        <div style={{ minWidth: 0, flex: 1, paddingRight: '8px' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--color-charcoal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.name}
                          </div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            S/ {item.price.toFixed(2)} c/u
                          </span>
                        </div>

                        {/* Controles de cantidad */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => updateBasketQty(item.id, item.qty - 1)}
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-medium)',
                              backgroundColor: 'var(--bg-canvas)',
                              color: 'var(--color-charcoal)',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Minus size={12} />
                          </button>

                          <span style={{ width: '22px', textAlign: 'center', fontWeight: 800, fontSize: '0.88rem' }}>
                            {item.qty}
                          </span>

                          <button
                            type="button"
                            disabled={item.qty >= item.stock}
                            onClick={() => updateBasketQty(item.id, item.qty + 1)}
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-medium)',
                              backgroundColor: 'var(--bg-canvas)',
                              color: 'var(--color-charcoal)',
                              fontWeight: 800,
                              cursor: item.qty >= item.stock ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Plus size={12} />
                          </button>

                          {/* Subtotal */}
                          <div className="font-display tabular-nums" style={{ width: '68px', textAlign: 'right', fontWeight: 800, color: 'var(--color-terracotta)', fontSize: '0.92rem' }}>
                            S/ {(item.price * item.qty).toFixed(2)}
                          </div>

                          {/* Eliminar ítem */}
                          <button
                            type="button"
                            onClick={() => removeFromBasket(item.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: '2px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Subtotal de la comanda */}
                {orderBasket.length > 0 && (
                  <div style={{
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px dashed var(--border-medium)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                      Total de esta Comanda:
                    </span>
                    <span className="font-display tabular-nums" style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-terracotta)' }}>
                      S/ {basketTotal.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Resumen de Consumos ya Registrados en la Mesa */}
              <div style={{
                backgroundColor: 'var(--bg-canvas)',
                borderRadius: '14px',
                border: '1px solid var(--border-subtle)',
                padding: '12px 16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 800 }}>
                    Consumos Anteriores en Mesa ({selectedTable.orders.reduce((a, b) => a + b.qty, 0)})
                  </span>
                  <span className="tabular-nums font-display" style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
                    Total Previo: S/ {getTableOrdersCost(selectedTable).toFixed(2)}
                  </span>
                </div>

                <div style={{ maxHeight: '90px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {selectedTable.orders.length === 0 ? (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Sin consumos anteriores registrados en esta partida.
                    </span>
                  ) : (
                    selectedTable.orders.map((o, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
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
        MODAL 4: AJUSTAR TIEMPO EN MESA ACTIVA
        ========================================================================= */}
      <Modal
        isOpen={modalType === 'adjust_time' && !!selectedTable}
        onClose={closeModal}
        title={`Ajustar Tiempo — ${selectedTable?.name}`}
        subtitle="Calibrar los minutos transcurridos en el cronómetro de la partida"
        icon={SlidersHorizontal}
        maxWidth="520px"
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
              onClick={confirmAdjustTime}
            >
              <Check size={16} />
              <span>Guardar Nuevo Tiempo</span>
            </button>
          </>
        }
      >
        {selectedTable && (
          <form onSubmit={confirmAdjustTime} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>
                Seleccionar Minutos Transcurridos
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[15, 30, 45, 60, 90, 120].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setAdjustMinutes(mins)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: `1.5px solid ${adjustMinutes === mins ? 'var(--color-terracotta)' : 'var(--border-subtle)'}`,
                      backgroundColor: adjustMinutes === mins ? 'var(--terracotta-subtle)' : 'var(--bg-canvas)',
                      color: adjustMinutes === mins ? 'var(--color-terracotta)' : 'var(--color-charcoal)',
                      fontWeight: 800,
                      fontSize: '0.84rem',
                      cursor: 'pointer'
                    }}
                  >
                    {mins >= 60 ? `${mins / 60}h ${mins % 60 ? `${mins % 60}m` : ''}` : `${mins} min`}
                  </button>
                ))}
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">O ingresar minutos exactos</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="number"
                  className="input-field"
                  min="0"
                  max="1440"
                  value={adjustMinutes}
                  onChange={e => setAdjustMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                  style={{ fontWeight: 800, fontSize: '1.05rem', textAlign: 'center', width: '120px' }}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>minutos de juego</span>
              </div>
            </div>

            {/* Vista previa del nuevo cálculo */}
            <div style={{
              padding: '14px',
              backgroundColor: 'var(--bg-canvas)',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>
                  Nuevo Cronómetro
                </span>
                <div className="font-display tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
                  {formatTime(adjustMinutes * 60)}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>
                  Nuevo Costo Estimado
                </span>
                <div className="font-display tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-terracotta)' }}>
                  S/ {((adjustMinutes / 60) * selectedTable.pricePerHour).toFixed(2)}
                </div>
              </div>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal de Confirmación para Restablecer Tiempos de Demostración */}
      <ConfirmModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleConfirmReset}
        title="¿Restablecer Cronómetros de Demostración?"
        message="Esta acción limpiará los cronómetros viejos acumulados en el navegador (ej. 147 horas) y reconfigurará las 6 mesas con tiempos frescos y coherentes de demostración (30 a 50 minutos)."
        confirmText="Restablecer Tiempos"
        cancelText="Cancelar"
        variant="warning"
      />

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
