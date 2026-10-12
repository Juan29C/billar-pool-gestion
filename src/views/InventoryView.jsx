import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Edit3, 
  Trash2,
  DollarSign,
  TrendingUp,
  BarChart2,
  X,
  AlertCircle,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { useBillar } from '../context/BillarContext';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';

export default function InventoryView() {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    adjustStock 
  } = useBillar();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  // Estados de Modales
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);

  // Form State para Nuevo Producto
  const [formProduct, setFormProduct] = useState({
    name: '',
    sku: '',
    category: 'Cervezas',
    price: '',
    cost: '',
    stock: '',
    minStock: '10'
  });

  const categories = ['all', 'Cervezas', 'Bebidas Sin Alcohol', 'Piqueos', 'Snacks', 'Accesorios'];

  // Métricas de inventario
  const totalProducts = products.length;
  const totalUnits = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  const totalValue = products.reduce((acc, p) => acc + ((Number(p.price) || 0) * (Number(p.stock) || 0)), 0);
  const lowStockProducts = products.filter(p => Number(p.stock) <= Number(p.minStock));

  // Filtrado de productos
  const filteredProducts = products.filter(p => {
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesQuery = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLowStock = !onlyLowStock || (Number(p.stock) <= Number(p.minStock));
    return matchesCat && matchesQuery && matchesLowStock;
  });

  // Manejo de creación
  const handleOpenCreate = () => {
    setFormProduct({
      name: '',
      sku: `PROD-${Math.floor(100 + Math.random() * 900)}`,
      category: 'Cervezas',
      price: '',
      cost: '',
      stock: '24',
      minStock: '6'
    });
    setShowAddModal(true);
  };

  const handleSaveCreate = (e) => {
    e.preventDefault();
    if (!formProduct.name.trim() || !formProduct.price) return;

    addProduct({
      name: formProduct.name.trim(),
      sku: formProduct.sku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
      category: formProduct.category,
      price: parseFloat(formProduct.price) || 0,
      cost: parseFloat(formProduct.cost) || 0,
      stock: parseInt(formProduct.stock, 10) || 0,
      minStock: parseInt(formProduct.minStock, 10) || 5
    });

    setShowAddModal(false);
  };

  // Manejo de edición
  const handleOpenEdit = (p) => {
    setEditingProduct({
      id: p.id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: p.price,
      cost: p.cost || 0,
      stock: p.stock,
      minStock: p.minStock
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name.trim()) return;

    updateProduct(editingProduct.id, {
      name: editingProduct.name.trim(),
      sku: editingProduct.sku.trim(),
      category: editingProduct.category,
      price: parseFloat(editingProduct.price) || 0,
      cost: parseFloat(editingProduct.cost) || 0,
      stock: parseInt(editingProduct.stock, 10) || 0,
      minStock: parseInt(editingProduct.minStock, 10) || 5
    });

    setEditingProduct(null);
  };

  // Manejo de eliminación
  const productToDelete = products.find(p => p.id === deletingProductId);

  const handleConfirmDelete = () => {
    if (deletingProductId) {
      deleteProduct(deletingProductId);
      setDeletingProductId(null);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '20px 24px' }}>
      {/* Cabecera Principal */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-charcoal)', margin: 0 }}>
            Control de Inventario y Almacén
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Gestión de stock, precios de venta, costos y reposición de bar y cafetería.
          </p>
        </div>

        <button 
          type="button"
          className="btn btn-primary modal-btn"
          onClick={handleOpenCreate}
          style={{ gap: '8px', boxShadow: 'var(--shadow-sm)' }}
        >
          <Plus size={18} />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* KPI Cards de Resumen */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div className="kpi-card">
          <div className="kpi-label">Total Productos</div>
          <div className="kpi-value font-display">{totalProducts}</div>
          <div className="kpi-subtext">Catálogo en sistema</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Unidades en Stock</div>
          <div className="kpi-value font-display">{totalUnits} und</div>
          <div className="kpi-subtext">Físico disponible</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Valorización de Almacén</div>
          <div className="kpi-value font-display tabular-nums" style={{ color: 'var(--color-terracotta)' }}>
            S/ {totalValue.toFixed(2)}
          </div>
          <div className="kpi-subtext">Precio venta total</div>
        </div>

        <div className="kpi-card" style={{
          borderColor: lowStockProducts.length > 0 ? 'var(--status-danger)' : 'var(--border-subtle)',
          backgroundColor: lowStockProducts.length > 0 ? 'rgba(185, 56, 56, 0.04)' : 'var(--surface-card)'
        }}>
          <div className="kpi-label" style={{ color: lowStockProducts.length > 0 ? 'var(--status-danger)' : 'var(--text-muted)' }}>
            Productos con Stock Bajo
          </div>
          <div className="kpi-value font-display" style={{ color: lowStockProducts.length > 0 ? 'var(--status-danger)' : 'var(--status-available)' }}>
            {lowStockProducts.length}
          </div>
          <div className="kpi-subtext">
            {lowStockProducts.length > 0 ? 'Requieren reposición inmediata' : 'Stock en niveles óptimos'}
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="card" style={{ padding: '16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-bar" style={{ flex: 1, minWidth: '260px', padding: '8px 14px' }}>
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Buscar por nombre de producto o SKU..."
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

          {/* Toggle de Stock Bajo */}
          <button
            type="button"
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              borderColor: onlyLowStock ? 'var(--status-danger)' : 'var(--border-subtle)',
              backgroundColor: onlyLowStock ? 'rgba(185, 56, 56, 0.12)' : 'var(--bg-canvas)',
              color: onlyLowStock ? 'var(--status-danger)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <AlertTriangle size={15} />
            <span>Solo Stock Bajo ({lowStockProducts.length})</span>
          </button>
        </div>

        {/* Chips de Categorías */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              style={{
                border: '1px solid',
                borderColor: categoryFilter === cat ? 'var(--color-terracotta)' : 'var(--border-subtle)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: categoryFilter === cat ? 'var(--color-terracotta)' : 'var(--surface-card)',
                color: categoryFilter === cat ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: 700,
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

      {/* Tabla Responsiva de Inventario */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-canvas)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '12px 18px', textAlign: 'left', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  Código SKU
                </th>
                <th style={{ padding: '12px 18px', textAlign: 'left', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  Producto / Categoría
                </th>
                <th style={{ padding: '12px 18px', textAlign: 'right', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  Precio Venta
                </th>
                <th style={{ padding: '12px 18px', textAlign: 'right', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  Costo Ref.
                </th>
                <th style={{ padding: '12px 18px', textAlign: 'center', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  Stock Actual
                </th>
                <th style={{ padding: '12px 18px', textAlign: 'center', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  Estado
                </th>
                <th style={{ padding: '12px 18px', textAlign: 'center', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No se encontraron productos que coincidan con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => {
                  const isOutOfStock = p.stock <= 0;
                  const isLowStock = p.stock > 0 && p.stock <= p.minStock;

                  return (
                    <tr 
                      key={p.id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      {/* SKU */}
                      <td style={{ padding: '14px 18px', fontSize: '0.82rem' }}>
                        <span className="font-mono" style={{
                          backgroundColor: 'var(--bg-canvas)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          fontWeight: 700,
                          color: 'var(--color-charcoal)'
                        }}>
                          {p.sku}
                        </span>
                      </td>

                      {/* Nombre y Categoría */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-charcoal)' }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                          {p.category}
                        </div>
                      </td>

                      {/* Precio */}
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <span className="font-display tabular-nums" style={{ fontWeight: 800, fontSize: '0.96rem', color: 'var(--color-charcoal)' }}>
                          S/ {Number(p.price).toFixed(2)}
                        </span>
                      </td>

                      {/* Costo */}
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <span className="tabular-nums font-mono" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          S/ {Number(p.cost || 0).toFixed(2)}
                        </span>
                      </td>

                      {/* Stock y Ajuste Rápido */}
                      <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => adjustStock(p.id, -1)}
                            disabled={p.stock <= 0}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: 'var(--bg-canvas)',
                              cursor: p.stock <= 0 ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--color-charcoal)'
                            }}
                            title="Restar 1 unidad"
                          >
                            -
                          </button>

                          <span className="font-display tabular-nums" style={{ minWidth: '32px', fontWeight: 800, fontSize: '1rem', color: isOutOfStock ? 'var(--status-danger)' : 'var(--color-charcoal)' }}>
                            {p.stock}
                          </span>

                          <button
                            type="button"
                            onClick={() => adjustStock(p.id, 1)}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: 'var(--bg-canvas)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--color-charcoal)'
                            }}
                            title="Sumar 1 unidad"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Badge Estado */}
                      <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                        {isOutOfStock ? (
                          <span className="badge badge-danger">Agotado</span>
                        ) : isLowStock ? (
                          <span className="badge badge-pending">Alerta (≤ {p.minStock})</span>
                        ) : (
                          <span className="badge badge-available">Óptimo</span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => handleOpenEdit(p)}
                            style={{ padding: '6px 10px', fontSize: '0.78rem', gap: '4px', minHeight: '32px' }}
                            title="Editar datos de producto"
                          >
                            <Edit3 size={14} />
                            <span>Editar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingProductId(p.id)}
                            style={{
                              padding: '6px 8px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: 'transparent',
                              color: 'var(--status-danger)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Eliminar producto"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: REGISTRAR NUEVO PRODUCTO (PORTAL, 620px)
          ========================================================================= */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Registrar Nuevo Producto"
        subtitle="Añadir artículo al inventario y catálogo de ventas del bar"
        icon={Package}
        maxWidth="620px"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary modal-btn"
              onClick={() => setShowAddModal(false)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="form-new-product"
              className="btn btn-primary modal-btn"
            >
              <Plus size={16} />
              <span>Guardar Producto</span>
            </button>
          </>
        }
      >
        <form id="form-new-product" onSubmit={handleSaveCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Nombre del Producto *</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ej. Cerveza Corona Extra 355ml"
              value={formProduct.name}
              onChange={e => setFormProduct({ ...formProduct, name: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Código SKU</label>
              <input 
                type="text" 
                className="input-field font-mono" 
                placeholder="Ej. CER-005"
                value={formProduct.sku}
                onChange={e => setFormProduct({ ...formProduct, sku: e.target.value })}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Categoría</label>
              <select 
                className="input-field"
                value={formProduct.category}
                onChange={e => setFormProduct({ ...formProduct, category: e.target.value })}
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
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Precio de Venta (S/) *</label>
              <input 
                type="number" 
                step="0.10"
                min="0"
                className="input-field font-display" 
                placeholder="10.00"
                value={formProduct.price}
                onChange={e => setFormProduct({ ...formProduct, price: e.target.value })}
                required
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Costo Referencial (S/)</label>
              <input 
                type="number" 
                step="0.10"
                min="0"
                className="input-field font-display" 
                placeholder="6.50"
                value={formProduct.cost}
                onChange={e => setFormProduct({ ...formProduct, cost: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Stock Inicial (Unidades)</label>
              <input 
                type="number" 
                min="0"
                className="input-field font-mono" 
                placeholder="24"
                value={formProduct.stock}
                onChange={e => setFormProduct({ ...formProduct, stock: e.target.value })}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Stock Mínimo (Alerta)</label>
              <input 
                type="number" 
                min="1"
                className="input-field font-mono" 
                placeholder="6"
                value={formProduct.minStock}
                onChange={e => setFormProduct({ ...formProduct, minStock: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* =========================================================================
          MODAL 2: EDITAR PRODUCTO / AJUSTAR DATOS (PORTAL, 620px)
          ========================================================================= */}
      {editingProduct && (
        <Modal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          title={`Editar — ${editingProduct.name}`}
          subtitle="Actualización de datos comerciales y existencias"
          icon={Edit3}
          maxWidth="620px"
          footer={
            <>
              <button
                type="button"
                className="btn btn-secondary modal-btn"
                onClick={() => setEditingProduct(null)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="form-edit-product"
                className="btn btn-primary modal-btn"
              >
                <span>Guardar Cambios</span>
              </button>
            </>
          }
        >
          <form id="form-edit-product" onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Nombre del Producto</label>
              <input 
                type="text" 
                className="input-field" 
                value={editingProduct.name}
                onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Código SKU</label>
                <input 
                  type="text" 
                  className="input-field font-mono" 
                  value={editingProduct.sku}
                  onChange={e => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Categoría</label>
                <select 
                  className="input-field"
                  value={editingProduct.category}
                  onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
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
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Precio de Venta (S/)</label>
                <input 
                  type="number" 
                  step="0.10"
                  min="0"
                  className="input-field font-display" 
                  value={editingProduct.price}
                  onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  required
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Costo Referencial (S/)</label>
                <input 
                  type="number" 
                  step="0.10"
                  min="0"
                  className="input-field font-display" 
                  value={editingProduct.cost}
                  onChange={e => setEditingProduct({ ...editingProduct, cost: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Stock en Almacén</label>
                <input 
                  type="number" 
                  min="0"
                  className="input-field font-mono" 
                  value={editingProduct.stock}
                  onChange={e => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Stock Mínimo de Alerta</label>
                <input 
                  type="number" 
                  min="1"
                  className="input-field font-mono" 
                  value={editingProduct.minStock}
                  onChange={e => setEditingProduct({ ...editingProduct, minStock: e.target.value })}
                />
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* =========================================================================
          MODAL 3: CONFIRMAR ELIMINACIÓN DE PRODUCTO (CONFIRM MODAL REUTILIZABLE)
          ========================================================================= */}
      <ConfirmModal
        isOpen={!!deletingProductId}
        onClose={() => setDeletingProductId(null)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar Producto del Catálogo?"
        message={
          productToDelete 
            ? `¿Estás seguro de que deseas eliminar permanentemente "${productToDelete.name}" (${productToDelete.sku}) del inventario?`
            : '¿Confirmar eliminación del producto seleccionado?'
        }
        confirmText="Sí, Eliminar Producto"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
