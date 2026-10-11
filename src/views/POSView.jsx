import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  Sparkles, 
  Receipt, 
  Beer, 
  Coffee, 
  UtensilsCrossed, 
  CreditCard,
  QrCode
} from 'lucide-react';
import { useBillar } from '../context/BillarContext';

export default function POSView() {
  const { products, cart, addToCart, updateCartQty, clearCart, checkoutCart } = useBillar();

  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastSaleTotal, setLastSaleTotal] = useState(0);

  const categories = ['all', 'Cervezas', 'Bebidas Sin Alcohol', 'Piqueos', 'Snacks', 'Accesorios'];

  const filteredProducts = products.filter(p => {
    const matchesCategory = category === 'all' || p.category === category;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const handleCheckout = () => {
    if (!cart.length) return;
    setLastSaleTotal(cartTotal);
    checkoutCart(paymentMethod);
    setShowSuccessModal(true);
  };

  return (
    <div className="animate-fade-in" style={{
      display: 'grid',
      gridTemplateColumns: '1fr 360px',
      gap: '24px',
      padding: '24px 28px',
      height: 'calc(100vh - var(--topbar-height))',
      overflow: 'hidden'
    }}>
      {/* Columna Izquierda: Catálogo y Búsqueda */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Cabecera y Buscador */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
              Punto de Venta Rápido (POS)
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {products.length} productos disponibles
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="search-bar" style={{ flex: 1 }}>
              <Search size={18} color="var(--text-muted)" />
              <input 
                type="text" 
                placeholder="Buscar por nombre o código SKU (ej. Cusqueña, Tequeños)..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Categorías Pills */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '16px'
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                border: 'none',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: category === cat ? 'var(--color-charcoal)' : 'var(--surface-card)',
                color: category === cat ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: category === cat ? 'var(--shadow-sm)' : 'none',
                transition: 'all var(--transition-fast)'
              }}
            >
              {cat === 'all' ? 'Todos los Productos' : cat}
            </button>
          ))}
        </div>

        {/* Grid de Productos */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '14px',
          paddingRight: '6px'
        }}>
          {filteredProducts.map(p => {
            const isOutOfStock = p.stock <= 0;
            const isLowStock = p.stock <= p.minStock && !isOutOfStock;

            return (
              <div
                key={p.id}
                className="card"
                onClick={() => !isOutOfStock && addToCart(p)}
                style={{
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                  opacity: isOutOfStock ? 0.6 : 1,
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {p.sku}
                    </span>
                    <span 
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isOutOfStock ? 'var(--status-danger-bg)' : isLowStock ? 'var(--status-occupied-bg)' : 'var(--status-available-bg)',
                        color: isOutOfStock ? 'var(--status-danger)' : isLowStock ? 'var(--status-occupied)' : 'var(--status-available)'
                      }}
                    >
                      {isOutOfStock ? 'Agotado' : `Stock: ${p.stock}`}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-charcoal)', marginBottom: '4px' }}>
                    {p.name}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {p.category}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '12px',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--border-subtle)'
                }}>
                  <span className="font-display tabular-nums" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-terracotta)' }}>
                    S/ {p.price.toFixed(2)}
                  </span>
                  <button 
                    className="btn btn-primary btn-sm"
                    disabled={isOutOfStock}
                    style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Columna Derecha: Carrito Lateral */}
      <div className="card" style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '20px',
        borderRadius: 'var(--radius-lg)'
      }}>
        {/* Cabecera del Carrito */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '14px',
          marginBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingCart size={20} color="var(--color-terracotta)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
              Carrito de Venta
            </h3>
          </div>
          {cart.length > 0 && (
            <button 
              className="btn btn-ghost btn-sm"
              onClick={clearCart}
              style={{ color: 'var(--status-danger)', fontSize: '0.78rem' }}
            >
              Vaciar
            </button>
          )}
        </div>

        {/* Lista de Ítems */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          paddingRight: '4px'
        }}>
          {cart.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--text-muted)',
              textAlign: 'center',
              gap: '8px'
            }}>
              <ShoppingCart size={36} strokeWidth={1.5} color="var(--border-medium)" />
              <p style={{ fontSize: '0.85rem' }}>El carrito está vacío.<br />Selecciona productos del catálogo.</p>
            </div>
          ) : (
            cart.map(item => (
              <div 
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  backgroundColor: 'var(--bg-canvas)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ flex: 1, paddingRight: '8px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--color-charcoal)' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    S/ {item.price.toFixed(2)} c/u
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button 
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '2px 6px' }}
                    onClick={() => updateCartQty(item.id, -1)}
                  >
                    <Minus size={12} />
                  </button>

                  <span className="tabular-nums" style={{ fontWeight: 700, width: '20px', textAlign: 'center', fontSize: '0.88rem' }}>
                    {item.qty}
                  </span>

                  <button 
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '2px 6px' }}
                    onClick={() => updateCartQty(item.id, 1)}
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Resumen y Checkout */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '16px',
          marginTop: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {/* Método de Pago */}
          <div>
            <label className="input-label" style={{ marginBottom: '6px', display: 'block' }}>
              Método de Pago
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {['Efectivo', 'Yape', 'Plin', 'Tarjeta'].map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid',
                    borderColor: paymentMethod === method ? 'var(--color-terracotta)' : 'var(--border-subtle)',
                    backgroundColor: paymentMethod === method ? 'var(--terracotta-subtle)' : 'var(--surface-card)',
                    color: paymentMethod === method ? 'var(--color-terracotta)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Total */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 14px',
            backgroundColor: 'var(--bg-canvas)',
            borderRadius: 'var(--radius-md)'
          }}>
            <span style={{ fontWeight: 700, color: 'var(--color-charcoal)' }}>TOTAL A COBRAR:</span>
            <span className="font-display tabular-nums" style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-terracotta)' }}>
              S/ {cartTotal.toFixed(2)}
            </span>
          </div>

          {/* Botón Cobrar */}
          <button 
            className="btn btn-primary btn-lg"
            disabled={cart.length === 0}
            onClick={handleCheckout}
            style={{ width: '100%' }}
          >
            <Receipt size={18} />
            <span>Cobrar Venta Directa</span>
          </button>
        </div>
      </div>

      {/* MODAL VENTA EXITOSA / TICKET DEMO */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div className="modal-header" style={{ textAlign: 'center', display: 'block' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--status-available-bg)',
                color: 'var(--status-available)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <Check size={26} strokeWidth={3} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
                ¡Venta Registrada con Éxito!
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Comprobante visual de demostración
              </p>
            </div>

            <div className="modal-body" style={{ textAlign: 'center' }}>
              <div style={{
                padding: '16px',
                backgroundColor: 'var(--bg-canvas)',
                borderRadius: 'var(--radius-md)',
                border: '1px dashed var(--border-medium)',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  IMPORTE COBRADO ({paymentMethod.toUpperCase()})
                </div>
                <div className="font-display tabular-nums" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-terracotta)' }}>
                  S/ {lastSaleTotal.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--status-available)', marginTop: '4px', fontWeight: 600 }}>
                  Stock actualizado y registrado en caja
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button 
                className="btn btn-primary"
                onClick={() => setShowSuccessModal(false)}
                style={{ width: '100%' }}
              >
                Aceptar y Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
