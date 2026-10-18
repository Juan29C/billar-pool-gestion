import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Beer, Coffee, UtensilsCrossed, Package, AlertTriangle } from 'lucide-react';

/**
 * Componente Reutilizable: ProductSearchSelect (Combobox Buscador)
 * Reemplaza el select HTML nativo por una experiencia moderna con búsqueda instantánea,
 * categorías en chips y visualización clara de precios y existencias.
 */
export default function ProductSearchSelect({
  products = [],
  selectedProductId,
  onSelectProduct,
  label = 'Seleccionar Producto'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const containerRef = useRef(null);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  const categories = ['all', 'Cervezas', 'Bebidas Sin Alcohol', 'Piqueos', 'Snacks', 'Accesorios'];

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Cervezas':
        return <Beer size={16} color="var(--color-terracotta)" />;
      case 'Piqueos':
      case 'Snacks':
        return <UtensilsCrossed size={16} color="var(--status-occupied)" />;
      default:
        return <Package size={16} color="var(--text-muted)" />;
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }} ref={containerRef}>
      {label && <label className="input-label" style={{ marginBottom: '6px', display: 'block' }}>{label}</label>}

      {/* Botón Disparador del Combobox */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          backgroundColor: 'var(--surface-card)',
          border: `1.5px solid ${isOpen ? 'var(--color-terracotta)' : 'var(--border-subtle)'}`,
          borderRadius: '10px',
          cursor: 'pointer',
          boxShadow: isOpen ? '0 0 0 3px var(--terracotta-glow)' : 'var(--shadow-sm)',
          transition: 'all 0.15s ease'
        }}
      >
        {selectedProduct ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-canvas)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {getCategoryIcon(selectedProduct.category)}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{
                fontWeight: 700,
                fontSize: '0.88rem',
                color: 'var(--color-charcoal)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {selectedProduct.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {selectedProduct.category} • <strong style={{ color: 'var(--color-terracotta)' }}>S/ {selectedProduct.price.toFixed(2)}</strong> (Stock: {selectedProduct.stock})
              </div>
            </div>
          </div>
        ) : (
          <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Elegir artículo...</span>
        )}

        <ChevronDown
          size={18}
          color="var(--text-muted)"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', marginLeft: '8px' }}
        />
      </div>

      {/* Panel Desplegable Flotante */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          backgroundColor: 'var(--surface-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 16px 36px rgba(20, 16, 14, 0.22)',
          zIndex: 1000,
          overflow: 'hidden',
          animation: 'fadeIn 0.15s ease-out'
        }}>
          {/* Buscador Integrado */}
          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-canvas)' }}>
            <div className="search-bar" style={{ padding: '6px 12px', borderRadius: '8px' }}>
              <Search size={15} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Buscar bebida o piqueo (ej. Cusqueña, tequeños)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                style={{ fontSize: '0.84rem' }}
              />
            </div>

            {/* Chips de Categorías */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginTop: '8px', paddingBottom: '2px' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    border: '1px solid var(--border-subtle)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: selectedCategory === cat ? 'var(--color-terracotta)' : 'var(--surface-card)',
                    color: selectedCategory === cat ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat === 'all' ? 'Todos' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Resultados */}
          <div style={{ maxHeight: '230px', overflowY: 'auto', padding: '6px' }}>
            {filteredProducts.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                No se encontraron productos coincidentes.
              </div>
            ) : (
              filteredProducts.map(p => {
                const isSelected = selectedProduct?.id === p.id;
                const isOutOfStock = p.stock <= 0;

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      if (!isOutOfStock) {
                        onSelectProduct(p.id);
                        setIsOpen(false);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                      backgroundColor: isSelected ? 'var(--terracotta-subtle)' : 'transparent',
                      opacity: isOutOfStock ? 0.5 : 1,
                      transition: 'background-color 0.12s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected && !isOutOfStock) e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected && !isOutOfStock) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: isSelected ? '#FFFFFF' : 'var(--bg-canvas)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {getCategoryIcon(p.category)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--color-charcoal)' }}>
                          {p.name}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {p.sku} • {p.category}
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div>
                        <div className="font-display tabular-nums" style={{ fontWeight: 800, color: 'var(--color-terracotta)', fontSize: '0.92rem' }}>
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

                      {isSelected && <Check size={16} color="var(--color-terracotta)" strokeWidth={2.5} />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
