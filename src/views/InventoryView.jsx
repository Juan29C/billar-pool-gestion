import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Edit3, 
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { useBillar } from '../context/BillarContext';

export default function InventoryView() {
  const { products } = useBillar();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form para nuevo producto
  const [newProd, setNewProd] = useState({
    name: '',
    sku: '',
    category: 'Cervezas',
    price: '',
    cost: '',
    stock: '',
    minStock: '10'
  });

  const categories = ['all', 'Cervezas', 'Bebidas Sin Alcohol', 'Piqueos', 'Snacks', 'Accesorios'];

  const filteredProducts = products.filter(p => {
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesQuery = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;

  return (
    <div className="animate-fade-in" style={{ padding: '24px 28px' }}>
      {/* Header */}
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
            Control de Inventario y Almacén
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Supervisión de existencias, precios y alertas de reposición para el bar y snacks.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* Alerta de Stock Bajo si existe */}
      {lowStockCount > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 18px',
          backgroundColor: 'var(--status-occupied-bg)',
          border: '1px solid var(--status-occupied-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--status-occupied)',
          marginBottom: '20px',
          fontSize: '0.86rem',
          fontWeight: 600
        }}>
          <AlertTriangle size={18} />
          <span>Atención: Tienes <strong>{lowStockCount} productos</strong> con stock por debajo del mínimo recomendado.</span>
        </div>
      )}

      {/* Filtros y Búsqueda */}
      <div className="card" style={{ padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-bar" style={{ flex: 1, minWidth: '240px' }}>
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Buscar producto por nombre o SKU..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  border: 'none',
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: categoryFilter === cat ? 'var(--color-terracotta)' : 'var(--bg-canvas)',
                  color: categoryFilter === cat ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {cat === 'all' ? 'Todas las Categorías' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="table-container">
        <table className="table-custom">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio Venta</th>
              <th>Costo Est.</th>
              <th>Stock Actual</th>
              <th>Stock Mín.</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => {
              const isLow = p.stock <= p.minStock && p.stock > 0;
              const isOut = p.stock === 0;

              return (
                <tr key={p.id}>
                  <td style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    {p.sku}
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--color-charcoal)' }}>
                    {p.name}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {p.category}
                    </span>
                  </td>
                  <td className="font-display tabular-nums" style={{ fontWeight: 700, color: 'var(--color-terracotta)' }}>
                    S/ {p.price.toFixed(2)}
                  </td>
                  <td className="font-display tabular-nums" style={{ color: 'var(--text-muted)' }}>
                    S/ {p.cost.toFixed(2)}
                  </td>
                  <td className="font-display tabular-nums" style={{ fontWeight: 800, fontSize: '0.96rem' }}>
                    {p.stock} {p.unit}s
                  </td>
                  <td className="font-display tabular-nums" style={{ color: 'var(--text-muted)' }}>
                    {p.minStock}
                  </td>
                  <td>
                    {isOut ? (
                      <span className="badge badge-maintenance">
                        <span className="badge-dot" />
                        Agotado
                      </span>
                    ) : isLow ? (
                      <span className="badge badge-occupied">
                        <span className="badge-dot" />
                        Stock Bajo
                      </span>
                    ) : (
                      <span className="badge badge-available">
                        <span className="badge-dot" />
                        Óptimo
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL NUEVO PRODUCTO (DEMO) */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Registrar Nuevo Producto</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Añadir artículo al inventario del local
                </span>
              </div>
              <button className="btn-ghost" onClick={() => setShowAddModal(false)} style={{ border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="input-group">
                <label className="input-label">Nombre del Producto</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Ej. Cerveza Artesanal IPA 330ml"
                  value={newProd.name}
                  onChange={e => setNewProd({ ...newProd, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                  <label className="input-label">Código SKU</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Ej. CER-004"
                    value={newProd.sku}
                    onChange={e => setNewProd({ ...newProd, sku: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Categoría</label>
                  <select 
                    className="input-field"
                    value={newProd.category}
                    onChange={e => setNewProd({ ...newProd, category: e.target.value })}
                  >
                    <option value="Cervezas">Cervezas</option>
                    <option value="Bebidas Sin Alcohol">Bebidas Sin Alcohol</option>
                    <option value="Piqueos">Piqueos</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Accesorios">Accesorios</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                  <label className="input-label">Precio de Venta (S/)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    placeholder="12.00"
                    value={newProd.price}
                    onChange={e => setNewProd({ ...newProd, price: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Stock Inicial</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    placeholder="24"
                    value={newProd.stock}
                    onChange={e => setNewProd({ ...newProd, stock: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancelar
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  alert('Producto registrado en simulación de demostración');
                  setShowAddModal(false);
                }}
              >
                Guardar Producto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
