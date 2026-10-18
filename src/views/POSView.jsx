import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  Receipt, 
  Beer, 
  Coffee, 
  UtensilsCrossed, 
  CreditCard,
  Smartphone,
  Banknote,
  Printer,
  Sparkles,
  Package,
  X,
  AlertCircle
} from 'lucide-react';
import { useBillar } from '../context/BillarContext';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';

export default function POSView() {
  const { 
    products, 
    cart, 
    addToCart, 
    updateCartQty, 
    clearCart, 
    checkoutCart 
  } = useBillar();

  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  
  // Modales
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [lastTicket, setLastTicket] = useState(null);
  const [printSuccessAlert, setPrintSuccessAlert] = useState(false);

  const categories = [
    { id: 'all', label: 'Todos', icon: Sparkles },
    { id: 'Cervezas', label: 'Cervezas', icon: Beer },
    { id: 'Bebidas Sin Alcohol', label: 'Bebidas Sin Alcohol', icon: Coffee },
    { id: 'Piqueos', label: 'Piqueos', icon: UtensilsCrossed },
    { id: 'Snacks', label: 'Snacks', icon: Package },
    { id: 'Accesorios', label: 'Accesorios', icon: Package }
  ];

  const paymentMethods = [
    { id: 'Efectivo', label: 'Efectivo', icon: Banknote },
    { id: 'Yape', label: 'Yape', icon: Smartphone },
    { id: 'Plin', label: 'Plin', icon: Smartphone },
    { id: 'Tarjeta', label: 'Tarjeta', icon: CreditCard }
  ];

  // Filtrado de productos
  const filteredProducts = products.filter(p => {
    const matchesCategory = category === 'all' || p.category === category;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.qty, 0);

  // Procesar Cobro
  const handleCheckout = () => {
    if (!cart.length) return;
    const ticketData = {
      id: `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      items: [...cart],
      total: cartTotal,
      subtotal: cartTotal / 1.18,
      igv: cartTotal - (cartTotal / 1.18),
      paymentMethod
    };

    checkoutCart(paymentMethod);
    setLastTicket(ticketData);
    setPrintSuccessAlert(false);
    setShowSuccessModal(true);
  };

  const handleSimulatePrint = () => {
    setPrintSuccessAlert(true);
    setTimeout(() => setPrintSuccessAlert(false), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '20px 24px' }}>
      {/* Cabecera del Módulo */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-charcoal)', margin: 0 }}>
            Punto de Venta Directo (POS)
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Despacho ágil de barra, bebidas, cócteles y piqueos sin asociar a una mesa.
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 16px',
          backgroundColor: 'var(--surface-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <Package size={18} color="var(--color-terracotta)" />
          <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Catálogo Activo: <strong>{products.length} productos</strong>
          </span>
        </div>
      </div>

      {/* Contenedor Principal en 2 Columnas Responsivas */}
      <div className="pos-layout-grid">
        
        {/* =========================================================================
            COLUMNA IZQUIERDA: CATÁLOGO, BUSCADOR Y CATEGORÍAS
            ========================================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Barra de Búsqueda y Filtros Rápidos */}
          <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div className="search-bar" style={{ flex: 1, padding: '8px 14px' }}>
                <Search size={18} color="var(--text-muted)" />
                <input 
                  type="text" 
                  placeholder="🔍 Buscar por nombre o SKU (ej. Cusqueña, Tequeños, Red Bull)..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ fontSize: '0.88rem' }}
                />
                {searchTerm && (
                  <button 
                    type="button" 
                    onClick={() => setSearchTerm('')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Chips de Categorías */}
            <div style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '4px'
            }}>
              {categories.map(cat => {
                const Icon = cat.icon;
                const isActive = category === cat.id;
                const count = cat.id === 'all' 
                  ? products.length 
                  : products.filter(p => p.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    style={{
                      border: '1px solid',
                      borderColor: isActive ? 'var(--color-terracotta)' : 'var(--border-subtle)',
                      padding: '7px 14px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isActive ? 'var(--color-terracotta)' : 'var(--surface-card)',
                      color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <Icon size={14} />
                    <span>{cat.label}</span>
                    <span style={{
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--bg-canvas)',
                      color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      fontSize: '0.72rem'
                    }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid de Productos */}
          {filteredProducts.length === 0 ? (
            <div className="card" style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Package size={42} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <h4 style={{ margin: '0 0 6px', color: 'var(--color-charcoal)' }}>No se encontraron productos</h4>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>Intenta ajustar la búsqueda o seleccionar otra categoría.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
              gap: '14px'
            }}>
              {filteredProducts.map(p => {
                const inCartItem = cart.find(c => c.id === p.id);
                const isOutOfStock = p.stock <= 0;
                const isLowStock = p.stock > 0 && p.stock <= p.minStock;

                return (
                  <div
                    key={p.id}
                    className="card"
                    style={{
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.18s ease',
                      border: inCartItem ? '1.5px solid var(--color-terracotta)' : '1px solid var(--border-subtle)',
                      boxShadow: inCartItem ? '0 4px 14px rgba(156, 86, 75, 0.15)' : 'var(--shadow-sm)',
                      opacity: isOutOfStock ? 0.6 : 1,
                      position: 'relative'
                    }}
                  >
                    {/* Badge en Carrito */}
                    {inCartItem && (
                      <span style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'var(--color-terracotta)',
                        color: '#FFFFFF',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)'
                      }}>
                        {inCartItem.qty} en carrito
                      </span>
                    )}

                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, marginBottom: '4px' }}>
                        {p.category}
                      </div>
                      <h4 style={{
                        margin: '0 0 6px',
                        fontSize: '0.96rem',
                        fontWeight: 700,
                        color: 'var(--color-charcoal)',
                        lineHeight: 1.3
                      }}>
                        {p.name}
                      </h4>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                        SKU: <span className="font-mono">{p.sku}</span>
                      </div>
                    </div>

                    <div>
                      {/* Estado de Stock */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span className="font-display tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
                          S/ {p.price.toFixed(2)}
                        </span>

                        {isOutOfStock ? (
                          <span className="badge badge-danger" style={{ fontSize: '0.72rem' }}>
                            Agotado
                          </span>
                        ) : isLowStock ? (
                          <span className="badge badge-pending" style={{ fontSize: '0.72rem' }}>
                            Stock: {p.stock}
                          </span>
                        ) : (
                          <span className="badge badge-available" style={{ fontSize: '0.72rem' }}>
                            Stock: {p.stock}
                          </span>
                        )}
                      </div>

                      {/* Botón Añadir */}
                      <button
                        type="button"
                        className={inCartItem ? 'btn btn-primary' : 'btn btn-secondary'}
                        disabled={isOutOfStock}
                        onClick={() => addToCart(p)}
                        style={{
                          width: '100%',
                          minHeight: '38px',
                          fontSize: '0.84rem',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <Plus size={16} />
                        <span>{isOutOfStock ? 'Sin Stock' : inCartItem ? 'Añadir Otro' : 'Agregar'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* =========================================================================
            COLUMNA DERECHA: CARRITO DE COMPRAS Y DESPACHO
            ========================================================================= */}
        <div id="pos-cart-panel" className="card" style={{
          padding: '20px',
          position: 'sticky',
          top: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-medium)'
        }}>
          {/* Cabecera del Carrito */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={20} color="var(--color-terracotta)" />
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
                Pedido Actual
              </h3>
              {cartItemCount > 0 && (
                <span style={{
                  backgroundColor: 'var(--color-charcoal)',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)'
                }}>
                  {cartItemCount} und
                </span>
              )}
            </div>

            {cart.length > 0 && (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--status-danger)',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}
                title="Vaciar comanda"
              >
                <Trash2 size={14} />
                <span>Vaciar</span>
              </button>
            )}
          </div>

          {/* Lista de Ítems en Carrito */}
          <div style={{
            maxHeight: '340px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            paddingRight: '4px'
          }}>
            {cart.length === 0 ? (
              <div style={{
                padding: '36px 12px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                backgroundColor: 'var(--bg-canvas)',
                borderRadius: '12px',
                border: '1.5px dashed var(--border-subtle)'
              }}>
                <ShoppingCart size={32} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
                <p style={{ margin: 0, fontSize: '0.86rem', fontWeight: 600 }}>El carrito está vacío</p>
                <span style={{ fontSize: '0.76rem' }}>Haz clic en "Agregar" en cualquier producto</span>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    backgroundColor: 'var(--bg-canvas)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1, paddingRight: '10px' }}>
                    <div style={{
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      color: 'var(--color-charcoal)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      S/ {item.price.toFixed(2)} c/u
                    </div>
                  </div>

                  {/* Controles de Cantidad */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => updateCartQty(item.id, -1)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--surface-card)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--color-charcoal)'
                      }}
                    >
                      <Minus size={12} />
                    </button>

                    <span className="font-display tabular-nums" style={{ minWidth: '22px', textAlign: 'center', fontWeight: 800, fontSize: '0.88rem' }}>
                      {item.qty}
                    </span>

                    <button
                      type="button"
                      onClick={() => updateCartQty(item.id, 1)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--surface-card)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--color-charcoal)'
                      }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Subtotal Ítem */}
                  <div className="font-display tabular-nums" style={{ minWidth: '65px', textAlign: 'right', fontWeight: 800, fontSize: '0.88rem', color: 'var(--color-charcoal)' }}>
                    S/ {(item.price * item.qty).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desglose Económico */}
          <div style={{
            padding: '14px 16px',
            backgroundColor: 'var(--bg-canvas)',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <span>Subtotal neto:</span>
              <span className="tabular-nums font-mono">S/ {(cartTotal / 1.18).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <span>I.G.V. (18% incl.):</span>
              <span className="tabular-nums font-mono">S/ {(cartTotal - (cartTotal / 1.18)).toFixed(2)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '8px',
              marginTop: '2px'
            }}>
              <span style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--color-charcoal)' }}>
                TOTAL A COBRAR:
              </span>
              <span className="font-display tabular-nums" style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-terracotta)' }}>
                S/ {cartTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Selector de Método de Pago */}
          <div>
            <label className="input-label" style={{ marginBottom: '8px', display: 'block', fontSize: '0.8rem' }}>
              Método de Pago
            </label>
            <div className="payment-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {paymentMethods.map(method => {
                const Icon = method.icon;
                const isActive = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`payment-chip ${isActive ? 'active' : ''}`}
                    style={{ minHeight: '40px', fontSize: '0.8rem', padding: '6px 10px' }}
                  >
                    <Icon size={15} />
                    <span>{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botón Principal de Cobro */}
          <button
            type="button"
            className="btn btn-primary btn-lg modal-btn"
            disabled={cart.length === 0}
            onClick={handleCheckout}
            style={{
              width: '100%',
              minHeight: '48px',
              justifyContent: 'center',
              fontSize: '0.94rem',
              fontWeight: 800,
              gap: '8px',
              boxShadow: cart.length > 0 ? '0 6px 18px rgba(156, 86, 75, 0.35)' : 'none'
            }}
          >
            <Receipt size={18} />
            <span>Cobrar Venta Directa (S/ {cartTotal.toFixed(2)})</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: COMPROBANTE DE VENTA EXITOSA (TICKET FORMATEADO 680px)
          ========================================================================= */}
      {lastTicket && (
        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="¡Venta Registrada con Éxito!"
          subtitle={`Comprobante Digital #${lastTicket.id} — Billar Club`}
          icon={Check}
          maxWidth="640px"
          footer={
            <>
              <button
                type="button"
                className="btn btn-secondary modal-btn"
                onClick={handleSimulatePrint}
                style={{ gap: '6px' }}
              >
                <Printer size={16} />
                <span>Imprimir Ticket</span>
              </button>
              <button
                type="button"
                className="btn btn-primary modal-btn"
                onClick={() => setShowSuccessModal(false)}
              >
                <span>Aceptar y Nueva Venta</span>
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {printSuccessAlert && (
              <div style={{
                padding: '10px 14px',
                backgroundColor: 'var(--status-available-bg)',
                color: 'var(--status-available)',
                border: '1px solid var(--status-available-border)',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Check size={16} />
                <span>Comprobante enviado a impresora térmica (simulación activa).</span>
              </div>
            )}

            {/* Voucher Visual */}
            <div className="receipt-card" style={{ margin: 0 }}>
              <div className="receipt-header">
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
                    BILLAR CLUB & LOUNGE
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    RUC: 20601234567 • Ticket POS: {lastTicket.id}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                    {lastTicket.date}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {lastTicket.time}
                  </div>
                </div>
              </div>

              <div className="receipt-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <span>Detalle de Consumos</span>
                  <span>Importe</span>
                </div>

                {lastTicket.items.map((item, idx) => (
                  <div key={idx} className="receipt-line">
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {item.qty}x {item.name}
                    </span>
                    <span className="tabular-nums font-mono" style={{ fontWeight: 700, color: 'var(--color-charcoal)' }}>
                      S/ {(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}

                <div style={{ borderTop: '1px dashed var(--border-medium)', margin: '10px 0' }} />

                <div className="receipt-line" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Subtotal Neto:</span>
                  <span className="tabular-nums font-mono">S/ {lastTicket.subtotal.toFixed(2)}</span>
                </div>
                <div className="receipt-line" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>I.G.V. (18%):</span>
                  <span className="tabular-nums font-mono">S/ {lastTicket.igv.toFixed(2)}</span>
                </div>

                <div className="receipt-total-row">
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
                    TOTAL PAGADO:
                  </span>
                  <span className="font-display tabular-nums" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-terracotta)' }}>
                    S/ {lastTicket.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div style={{
                padding: '12px 18px',
                backgroundColor: 'rgba(156, 86, 75, 0.08)',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.82rem'
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>Método de Cancelación:</span>
                <span className="badge badge-occupied" style={{ fontWeight: 700 }}>
                  {lastTicket.paymentMethod}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Barra Flotante de Carrito para Móvil / Tablet */}
      {cartItemCount > 0 && (
        <div 
          className="pos-mobile-cart-bar"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#1E1B19',
            borderTop: '2px solid #F5A623',
            padding: '12px 18px',
            boxShadow: '0 -6px 20px rgba(0, 0, 0, 0.45)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <div 
            onClick={() => {
              const cartEl = document.getElementById('pos-cart-panel');
              if (cartEl) cartEl.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div style={{
              position: 'relative',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(245, 166, 35, 0.18)',
              border: '1px solid #F5A623',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShoppingCart size={20} color="#F5A623" />
              <span style={{
                position: 'absolute',
                top: -5,
                right: -5,
                backgroundColor: '#F5A623',
                color: '#161413',
                fontSize: '11px',
                fontWeight: 900,
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cartItemCount}
              </span>
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#B3A69F', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Ver Carrito ({cartItemCount} und)
              </div>
              <div className="font-display tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF' }}>
                S/ {cartTotal.toFixed(2)}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const cartEl = document.getElementById('pos-cart-panel');
              if (cartEl) cartEl.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              backgroundColor: '#F5A623',
              color: '#161413',
              fontWeight: 800,
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 12px rgba(245, 166, 35, 0.35)'
            }}
          >
            <span>Ir a Pagar</span>
            <Check size={16} />
          </button>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: CONFIRMAR VACIADO DE CARRITO (CONFIRM MODAL REUTILIZABLE)
          ========================================================================= */}
      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => {
          clearCart();
          setShowClearConfirm(false);
        }}
        title="¿Vaciar Carrito de Venta?"
        message="Se eliminarán todos los productos seleccionados en la comanda actual. Esta acción no se puede deshacer."
        confirmText="Sí, Vaciar Carrito"
        cancelText="Conservar Pedido"
        variant="danger"
      />
    </div>
  );
}
