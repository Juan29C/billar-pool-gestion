import React, { useState } from 'react';
import { 
  Wallet, 
  CircleDollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Receipt,
  Plus,
  CreditCard,
  Smartphone,
  Banknote,
  MinusCircle,
  Check,
  RotateCcw,
  User,
  Info
} from 'lucide-react';
import { useBillar } from '../context/BillarContext';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';

export default function CashRegisterView() {
  const { 
    shift, 
    shiftHistory, 
    transactions, 
    addExpense, 
    closeShift, 
    openShift 
  } = useBillar();

  // Estados de modales
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showOpenModal, setShowOpenModal] = useState(false);

  // Form states
  const [countedCash, setCountedCash] = useState('');
  const [closeNotes, setCloseNotes] = useState('');

  const [expenseForm, setExpenseForm] = useState({
    description: '',
    category: 'Insumos Bar',
    amount: ''
  });

  const [openForm, setOpenForm] = useState({
    cashierName: 'Carlos Mendoza',
    initialCash: '250.00'
  });

  const totalSales = (shift.cashSales || 0) + (shift.yapeSales || 0) + (shift.plinSales || 0) + (shift.cardSales || 0);
  const expectedCashInDrawer = (shift.initialCash || 0) + (shift.cashSales || 0) - (shift.expenses || 0);

  // Manejo de Registro de Egreso
  const handleSaveExpense = (e) => {
    e.preventDefault();
    if (!expenseForm.description.trim() || !expenseForm.amount) return;

    addExpense({
      description: expenseForm.description.trim(),
      category: expenseForm.category,
      amount: parseFloat(expenseForm.amount) || 0
    });

    setExpenseForm({ description: '', category: 'Insumos Bar', amount: '' });
    setShowExpenseModal(false);
  };

  // Manejo de Cierre de Turno
  const handleConfirmClose = (e) => {
    e.preventDefault();
    closeShift({
      countedCash: parseFloat(countedCash) || expectedCashInDrawer,
      notes: closeNotes.trim()
    });
    setCountedCash('');
    setCloseNotes('');
    setShowCloseModal(false);
  };

  // Manejo de Apertura de Turno
  const handleConfirmOpen = (e) => {
    e.preventDefault();
    openShift({
      cashierName: openForm.cashierName.trim() || 'Cajero de Turno',
      initialCash: parseFloat(openForm.initialCash) || 0
    });
    setShowOpenModal(false);
  };

  // Filtrar egresos de transacciones
  const shiftExpensesList = transactions.filter(t => t.type === 'Egreso de Caja');

  return (
    <div className="animate-fade-in" style={{ padding: '20px 24px' }}>
      {/* Header */}
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
            Caja, Turnos y Control de Efectivo
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Supervisión del turno activo, desglose por canal de pago, arqueo de gaveta y egresos menores.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {shift.isOpen ? (
            <>
              <button 
                type="button"
                className="btn btn-secondary modal-btn"
                onClick={() => setShowExpenseModal(true)}
                style={{ gap: '6px' }}
              >
                <MinusCircle size={16} color="var(--status-danger)" />
                <span>Registrar Egreso</span>
              </button>
              <button 
                type="button"
                className="btn btn-primary modal-btn"
                onClick={() => {
                  setCountedCash(expectedCashInDrawer.toFixed(2));
                  setShowCloseModal(true);
                }}
                style={{ gap: '6px' }}
              >
                <Receipt size={16} />
                <span>Cierre de Turno y Arqueo</span>
              </button>
            </>
          ) : (
            <button 
              type="button"
              className="btn btn-primary modal-btn"
              onClick={() => setShowOpenModal(true)}
              style={{ gap: '6px' }}
            >
              <RotateCcw size={16} />
              <span>Aperturar Nuevo Turno</span>
            </button>
          )}
        </div>
      </div>

      {/* Tarjeta de Estado del Turno (Hero Nocturno) */}
      <div className="card" style={{
        backgroundColor: 'var(--surface-dark)',
        color: '#FFFFFF',
        padding: '24px',
        marginBottom: '20px',
        border: '1px solid #3E3531',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: shift.isOpen ? 'var(--status-available)' : 'var(--status-danger)'
              }} className={shift.isOpen ? 'pulse-indicator' : ''} />
              <span style={{
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 800,
                color: shift.isOpen ? 'var(--color-terracotta)' : 'var(--text-on-dark-muted)'
              }}>
                {shift.isOpen ? 'TURNO ACTIVO EN CURSO' : 'TURNO CERRADO'}
              </span>
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px' }}>
              Responsable: {shift.cashierName}
            </h3>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-on-dark-muted)' }}>
              <span>
                Hora de Apertura: <strong>{shift.openedAt ? new Date(shift.openedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</strong>
              </span>
              <span>•</span>
              <span>
                Fondo Inicial: <strong className="tabular-nums">S/ {Number(shift.initialCash || 0).toFixed(2)}</strong>
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-on-dark-muted)' }}>Total Recaudado en Turno</span>
            <div className="font-display tabular-nums" style={{ fontSize: '2.3rem', fontWeight: 800, color: '#FFFFFF' }}>
              S/ {totalSales.toFixed(2)}
            </div>
            <span style={{ fontSize: '0.76rem', color: 'var(--color-terracotta)', fontWeight: 700 }}>
              {transactions.length} operaciones registradas
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Desglose por Método de Pago y Balance */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {/* Efectivo en Gaveta */}
        <div className="card" style={{ padding: '18px', borderLeft: '4px solid var(--status-available)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
              EFECTIVO EN GAVETA
            </span>
            <Banknote size={18} color="var(--status-available)" />
          </div>
          <div className="font-display tabular-nums" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
            S/ {expectedCashInDrawer.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Fondo (S/ {shift.initialCash.toFixed(2)}) + Ventas (S/ {shift.cashSales.toFixed(2)}) - Egresos
          </div>
        </div>

        {/* Yape */}
        <div className="card" style={{ padding: '18px', borderLeft: '4px solid #732282' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
              YAPE (DIGITAL)
            </span>
            <Smartphone size={18} color="#732282" />
          </div>
          <div className="font-display tabular-nums" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
            S/ {Number(shift.yapeSales || 0).toFixed(2)}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Directo a cuenta bancaria
          </div>
        </div>

        {/* Plin */}
        <div className="card" style={{ padding: '18px', borderLeft: '4px solid #00B1EA' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
              PLIN (DIGITAL)
            </span>
            <Smartphone size={18} color="#00B1EA" />
          </div>
          <div className="font-display tabular-nums" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
            S/ {Number(shift.plinSales || 0).toFixed(2)}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Directo a cuenta bancaria
          </div>
        </div>

        {/* Tarjetas POS */}
        <div className="card" style={{ padding: '18px', borderLeft: '4px solid var(--color-terracotta)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
              TARJETAS POS
            </span>
            <CreditCard size={18} color="var(--color-terracotta)" />
          </div>
          <div className="font-display tabular-nums" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
            S/ {Number(shift.cardSales || 0).toFixed(2)}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Izipay / Niubiz terminal
          </div>
        </div>

        {/* Egresos / Gastos Menores */}
        <div className="card" style={{ padding: '18px', borderLeft: '4px solid var(--status-danger)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--status-danger)', fontWeight: 800, textTransform: 'uppercase' }}>
              TOTAL EGRESOS
            </span>
            <MinusCircle size={18} color="var(--status-danger)" />
          </div>
          <div className="font-display tabular-nums" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--status-danger)' }}>
            -S/ {Number(shift.expenses || 0).toFixed(2)}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Retiros de gaveta autorizados
          </div>
        </div>
      </div>

      {/* Grid 2 Columnas: Egresos del Turno & Historial de Cierres */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px'
      }}>
        {/* Egresos Registrados en el Turno */}
        <div className="card">
          <div className="card-header" style={{ marginBottom: '16px' }}>
            <div>
              <h3 className="card-title">Egresos y Gastos Menores del Turno</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Salidas de dinero de la gaveta física justificadas
              </span>
            </div>
            {shift.isOpen && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowExpenseModal(true)}
              >
                <Plus size={14} />
                <span>Nuevo Egreso</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
            {shiftExpensesList.length === 0 ? (
              <div style={{ padding: '36px 12px', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-canvas)', borderRadius: '10px' }}>
                <CheckCircle2 size={28} style={{ margin: '0 auto 8px', color: 'var(--status-available)' }} />
                <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>No hay egresos registrados en este turno.</span>
              </div>
            ) : (
              shiftExpensesList.map((eg, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 14px',
                    backgroundColor: 'var(--bg-canvas)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-charcoal)' }}>
                      {eg.description}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {eg.time} • Método: {eg.method}
                    </div>
                  </div>
                  <div className="font-display tabular-nums" style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--status-danger)' }}>
                    -S/ {Math.abs(eg.amount).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Historial de Cierres de Turno */}
        <div className="card">
          <div className="card-header" style={{ marginBottom: '16px' }}>
            <div>
              <h3 className="card-title">Historial de Cierres Anteriores</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Arqueos realizados por el equipo de caja
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
            {shiftHistory.map((s, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-canvas)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-charcoal)' }}>
                    {s.date}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Cajero: <strong>{s.cashier}</strong> • {s.notes}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="tabular-nums font-display" style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-charcoal)' }}>
                    S/ {s.totalSales.toFixed(2)}
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: s.diff === 0 ? 'var(--status-available)' : s.diff > 0 ? 'var(--color-terracotta)' : 'var(--status-danger)'
                  }}>
                    {s.diff === 0 ? 'Cuadre Exacto' : s.diff > 0 ? `+S/ ${s.diff.toFixed(2)} sobrante` : `-S/ ${Math.abs(s.diff).toFixed(2)} faltante`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: REGISTRAR EGRESO / GASTO MENOR (PORTAL, 540px)
          ========================================================================= */}
      <Modal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        title="Registrar Egreso de Caja"
        subtitle="Salida de efectivo de la gaveta para compras menores o servicios"
        icon={MinusCircle}
        danger={true}
        maxWidth="540px"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary modal-btn"
              onClick={() => setShowExpenseModal(false)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="form-expense"
              className="btn btn-primary modal-btn"
              style={{ backgroundColor: '#B93838', borderColor: '#B93838' }}
            >
              <span>Confirmar Egreso</span>
            </button>
          </>
        }
      >
        <form id="form-expense" onSubmit={handleSaveExpense} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Concepto del Gasto / Motivo *</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ej. Compra de 2 bolsas de hielo, Pago de delivery..."
              value={expenseForm.description}
              onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Categoría de Egreso</label>
              <select 
                className="input-field"
                value={expenseForm.category}
                onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}
              >
                <option value="Insumos Bar">Insumos Bar</option>
                <option value="Limpieza">Limpieza</option>
                <option value="Mantenimiento Mesas">Mantenimiento Mesas</option>
                <option value="Servicios Varios">Servicios Varios</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Importe a Retirar (S/) *</label>
              <input 
                type="number" 
                step="0.50"
                min="0.50"
                className="input-field font-display" 
                placeholder="25.00"
                value={expenseForm.amount}
                onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                required
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* =========================================================================
          MODAL 2: CIERRE DE TURNO Y ARQUEO FÍSICO (PORTAL, 640px)
          ========================================================================= */}
      <Modal
        isOpen={showCloseModal}
        onClose={() => setShowCloseModal(false)}
        title="Cierre de Turno y Arqueo Físico"
        subtitle={`Cuadre de caja para ${shift.cashierName}`}
        icon={Receipt}
        maxWidth="640px"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary modal-btn"
              onClick={() => setShowCloseModal(false)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="form-close-shift"
              className="btn btn-primary modal-btn"
            >
              <span>Confirmar y Finalizar Turno</span>
            </button>
          </>
        }
      >
        <form id="form-close-shift" onSubmit={handleConfirmClose} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Balance Contable */}
          <div style={{
            padding: '16px',
            backgroundColor: 'var(--bg-canvas)',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Fondo Inicial de Caja:</span>
              <span className="font-mono tabular-nums">S/ {shift.initialCash.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>+ Ventas en Efectivo:</span>
              <span className="font-mono tabular-nums">S/ {shift.cashSales.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
              <span style={{ color: 'var(--status-danger)' }}>- Egresos Retirados:</span>
              <span className="font-mono tabular-nums" style={{ color: 'var(--status-danger)' }}>-S/ {shift.expenses.toFixed(2)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '8px',
              marginTop: '4px'
            }}>
              <span style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--color-charcoal)' }}>
                EFECTIVO ESPERADO EN GAVETA:
              </span>
              <span className="font-display tabular-nums" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
                S/ {expectedCashInDrawer.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Input de Efectivo Contado */}
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Efectivo Real Contado en Gaveta (S/) *</label>
            <input 
              type="number" 
              step="0.10"
              className="input-field font-display" 
              value={countedCash}
              onChange={e => setCountedCash(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Cálculo de Diferencia en Vivo */}
          {countedCash !== '' && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '10px',
              backgroundColor: Math.abs(parseFloat(countedCash) - expectedCashInDrawer) < 0.01 
                ? 'var(--status-available-bg)' 
                : (parseFloat(countedCash) - expectedCashInDrawer) > 0 
                  ? 'rgba(156, 86, 75, 0.12)' 
                  : 'rgba(185, 56, 56, 0.12)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-charcoal)' }}>
                Diferencia Calculada:
              </span>
              <span className="font-display tabular-nums" style={{
                fontWeight: 800,
                fontSize: '1.1rem',
                color: Math.abs(parseFloat(countedCash) - expectedCashInDrawer) < 0.01 
                  ? 'var(--status-available)' 
                  : (parseFloat(countedCash) - expectedCashInDrawer) > 0 
                    ? 'var(--color-terracotta)' 
                    : 'var(--status-danger)'
              }}>
                {Math.abs(parseFloat(countedCash) - expectedCashInDrawer) < 0.01
                  ? 'S/ 0.00 (Cuadre Exacto)'
                  : (parseFloat(countedCash) - expectedCashInDrawer) > 0
                    ? `+S/ ${(parseFloat(countedCash) - expectedCashInDrawer).toFixed(2)} (Sobrante)`
                    : `-S/ ${Math.abs(parseFloat(countedCash) - expectedCashInDrawer).toFixed(2)} (Faltante)`}
              </span>
            </div>
          )}

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Notas / Observaciones del Cierre</label>
            <textarea 
              className="input-field" 
              rows={2}
              placeholder="Ej. Sin novedades en el turno / Se dejó fondo completo para el turno noche..."
              value={closeNotes}
              onChange={e => setCloseNotes(e.target.value)}
            />
          </div>
        </form>
      </Modal>

      {/* =========================================================================
          MODAL 3: APERTURA DE NUEVO TURNO (PORTAL, 540px)
          ========================================================================= */}
      <Modal
        isOpen={showOpenModal}
        onClose={() => setShowOpenModal(false)}
        title="Apertura de Nuevo Turno de Caja"
        subtitle="Inicio de jornada operativa y asignación de fondo de cambio"
        icon={RotateCcw}
        maxWidth="540px"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary modal-btn"
              onClick={() => setShowOpenModal(false)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="form-open-shift"
              className="btn btn-primary modal-btn"
            >
              <span>Aperturar Turno</span>
            </button>
          </>
        }
      >
        <form id="form-open-shift" onSubmit={handleConfirmOpen} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Nombre del Cajero / Responsable *</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ej. Luis Ramos"
              value={openForm.cashierName}
              onChange={e => setOpenForm({ ...openForm, cashierName: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Fondo Inicial de Gaveta (S/) *</label>
            <input 
              type="number" 
              step="10.00"
              min="0"
              className="input-field font-display" 
              placeholder="250.00"
              value={openForm.initialCash}
              onChange={e => setOpenForm({ ...openForm, initialCash: e.target.value })}
              required
            />
          </div>

          <div style={{
            padding: '12px 14px',
            backgroundColor: 'var(--bg-canvas)',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Info size={16} color="var(--color-terracotta)" />
            <span>El fondo inicial se guardará como saldo base para el cálculo del arqueo de gaveta.</span>
          </div>
        </form>
      </Modal>
    </div>
  );
}
