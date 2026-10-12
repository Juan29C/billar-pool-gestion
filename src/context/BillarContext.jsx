import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_TABLES, INITIAL_PRODUCTS, INITIAL_RATES, INITIAL_SHIFT, INITIAL_TRANSACTIONS } from '../data/mockData';

const BillarContext = createContext(null);

export function BillarProvider({ children }) {
  // Estado de mesas (6 mesas exactas: 4 de Pool y 2 de Billar Francés)
  const [tables, setTables] = useState(() => {
    try {
      const saved = localStorage.getItem('billar_tables');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 6) {
          return parsed;
        }
      }
    } catch (e) {
      // ignore
    }
    return INITIAL_TABLES;
  });

  // Estado de productos de inventario
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('billar_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Estado de tarifas
  const [rates, setRates] = useState(INITIAL_RATES);

  // Estado de caja / turno
  const [shift, setShift] = useState(INITIAL_SHIFT);

  // Estado de transacciones
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  // Carrito del POS
  const [cart, setCart] = useState([]);

  // Vista actual sincronizada con hash de la URL para soporte de pestañas y middle-click
  const getInitialView = () => {
    const hash = window.location.hash.replace('#', '').trim();
    const validViews = ['dashboard', 'tables', 'pos', 'inventory', 'cash', 'history', 'reports', 'settings', 'public'];
    return validViews.includes(hash) ? hash : 'tables';
  };

  const [currentView, setCurrentViewInternal] = useState(getInitialView);

  const setCurrentView = (view) => {
    window.location.hash = view;
    setCurrentViewInternal(view);
  };

  // Escuchar cambios de hash (Atrás/Adelante y navegación externa)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      const validViews = ['dashboard', 'tables', 'pos', 'inventory', 'cash', 'history', 'reports', 'settings', 'public'];
      if (validViews.includes(hash)) {
        setCurrentViewInternal(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Reloj global por segundo para actualizar cronómetros en vivo
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem('billar_tables', JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem('billar_products', JSON.stringify(products));
  }, [products]);

  // Cálculo de tiempo e importe estimado de una mesa
  const getTableElapsedSeconds = (table) => {
    if (!table.startTime || table.status === 'available' || table.status === 'maintenance') {
      return 0;
    }
    const startMs = new Date(table.startTime).getTime();
    const endMs = table.endTime ? new Date(table.endTime).getTime() : currentTime;
    return Math.max(0, Math.floor((endMs - startMs) / 1000));
  };

  const getTableTimeCost = (table) => {
    const seconds = getTableElapsedSeconds(table);
    const hours = seconds / 3600;
    // Tarifa proporcional
    const baseCost = hours * table.pricePerHour;
    // Redondeo mínimo o 2 decimales
    return Number(baseCost.toFixed(2));
  };

  const getTableOrdersCost = (table) => {
    if (!table.orders || !table.orders.length) return 0;
    return table.orders.reduce((acc, item) => acc + (item.price * item.qty), 0);
  };

  const getTableTotalCost = (table) => {
    return Number((getTableTimeCost(table) + getTableOrdersCost(table)).toFixed(2));
  };

  // Formatear segundos a HH:MM:SS
  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  };

  // Acciones sobre mesas
  const startTable = (tableId, rateId, playersName = '') => {
    const rate = rates.find(r => r.id === rateId) || rates[0];
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          status: 'occupied',
          rateId: rate.id,
          type: rate.name,
          pricePerHour: rate.pricePerHour,
          startTime: new Date().toISOString(),
          endTime: null,
          players: playersName || 'Jugador General',
          orders: []
        };
      }
      return t;
    }));
  };

  const addOrderToTable = (tableId, product, qty = 1) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        const existing = t.orders.find(o => o.id === product.id);
        let updatedOrders;
        if (existing) {
          updatedOrders = t.orders.map(o => o.id === product.id ? { ...o, qty: o.qty + qty } : o);
        } else {
          updatedOrders = [...t.orders, { id: product.id, name: product.name, qty, price: product.price }];
        }
        return { ...t, orders: updatedOrders };
      }
      return t;
    }));

    // Descontar stock
    setProducts(prev => prev.map(p => {
      if (p.id === product.id) {
        return { ...p, stock: Math.max(0, p.stock - qty) };
      }
      return p;
    }));
  };

  const stopTable = (tableId) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          status: 'pending',
          endTime: new Date().toISOString()
        };
      }
      return t;
    }));
  };

  const checkoutTable = (tableId, paymentMethod = 'Efectivo') => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    const total = getTableTotalCost(table);
    const elapsedSecs = getTableElapsedSeconds(table);
    const timeFormatted = formatTime(elapsedSecs);

    // Registrar en transacciones
    const newTrx = {
      id: `TRX-${Math.floor(1000 + Math.random() * 9000)}`,
      time: 'Hace un momento',
      type: 'Mesa Finalizada',
      description: `${table.name} (${table.type} ${timeFormatted})` + (table.orders.length ? ` + ${table.orders.length} consumos` : ''),
      method: paymentMethod,
      amount: total,
      status: 'Completado'
    };

    setTransactions(prev => [newTrx, ...prev]);

    // Actualizar caja según método
    setShift(prev => ({
      ...prev,
      cashSales: paymentMethod === 'Efectivo' ? prev.cashSales + total : prev.cashSales,
      yapeSales: paymentMethod === 'Yape' ? prev.yapeSales + total : prev.yapeSales,
      plinSales: paymentMethod === 'Plin' ? prev.plinSales + total : prev.plinSales,
      cardSales: paymentMethod === 'Tarjeta' ? prev.cardSales + total : prev.cardSales
    }));

    // Liberar mesa
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          status: 'available',
          startTime: null,
          endTime: null,
          players: '',
          orders: []
        };
      }
      return t;
    }));
  };

  // Acciones de Carrito POS
  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateCartQty = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const clearCart = () => setCart([]);

  const checkoutCart = (paymentMethod = 'Efectivo') => {
    if (!cart.length) return;
    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    // Descontar inventario
    setProducts(prev => prev.map(p => {
      const inCart = cart.find(c => c.id === p.id);
      return inCart ? { ...p, stock: Math.max(0, p.stock - inCart.qty) } : p;
    }));

    // Registrar en transacciones
    const newTrx = {
      id: `TRX-${Math.floor(1000 + Math.random() * 9000)}`,
      time: 'Hace un momento',
      type: 'Venta POS',
      description: `${cart.map(c => `${c.qty}x ${c.name}`).join(', ')}`,
      method: paymentMethod,
      amount: total,
      status: 'Completado'
    };

    setTransactions(prev => [newTrx, ...prev]);

    // Actualizar caja
    setShift(prev => ({
      ...prev,
      cashSales: paymentMethod === 'Efectivo' ? prev.cashSales + total : prev.cashSales,
      yapeSales: paymentMethod === 'Yape' ? prev.yapeSales + total : prev.yapeSales,
      plinSales: paymentMethod === 'Plin' ? prev.plinSales + total : prev.plinSales,
      cardSales: paymentMethod === 'Tarjeta' ? prev.cardSales + total : prev.cardSales
    }));

    clearCart();
    return newTrx;
  };

  // Acciones de Gestión de Inventario
  const addProduct = (newProduct) => {
    const id = `prod_${Date.now()}`;
    const productToAdd = {
      id,
      name: newProduct.name || 'Nuevo Producto',
      sku: newProduct.sku || `SKU-${Math.floor(100 + Math.random() * 900)}`,
      category: newProduct.category || 'Otros',
      price: Number(newProduct.price) || 0,
      cost: Number(newProduct.cost) || 0,
      stock: Number(newProduct.stock) || 0,
      minStock: Number(newProduct.minStock) || 5,
      unit: newProduct.unit || 'und'
    };
    setProducts(prev => [productToAdd, ...prev]);
    return productToAdd;
  };

  const updateProduct = (productId, updatedFields) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          ...updatedFields,
          price: updatedFields.price !== undefined ? Number(updatedFields.price) : p.price,
          cost: updatedFields.cost !== undefined ? Number(updatedFields.cost) : p.cost,
          stock: updatedFields.stock !== undefined ? Number(updatedFields.stock) : p.stock,
          minStock: updatedFields.minStock !== undefined ? Number(updatedFields.minStock) : p.minStock
        };
      }
      return p;
    }));
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const adjustStock = (productId, delta) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, stock: Math.max(0, p.stock + delta) };
      }
      return p;
    }));
  };

  // Historial de Cierres de Turno
  const [shiftHistory, setShiftHistory] = useState([
    {
      id: 'SFT-101',
      date: 'Ayer — Turno Noche (23:30)',
      cashier: 'Luis Ramos',
      totalSales: 680.50,
      cashSales: 290.00,
      yapeSales: 240.50,
      plinSales: 50.00,
      cardSales: 100.00,
      expenses: 40.00,
      initialCash: 250.00,
      countedCash: 500.00,
      diff: 0.00,
      notes: 'Cuadre conforme al cierre de noche'
    },
    {
      id: 'SFT-100',
      date: 'Ayer — Turno Tarde (17:00)',
      cashier: 'Carlos Mendoza',
      totalSales: 420.00,
      cashSales: 180.00,
      yapeSales: 150.00,
      plinSales: 30.00,
      cardSales: 60.00,
      expenses: 25.00,
      initialCash: 200.00,
      countedCash: 357.00,
      diff: 2.00,
      notes: 'Sobrante de S/ 2.00 por propina voluntaria'
    }
  ]);

  // Registrar Egreso / Gasto Menor
  const addExpense = ({ description, amount, category }) => {
    const numericAmount = Math.abs(parseFloat(amount) || 0);
    if (!numericAmount) return;

    setShift(prev => ({
      ...prev,
      expenses: prev.expenses + numericAmount
    }));

    const newTrx = {
      id: `EGR-${Math.floor(1000 + Math.random() * 9000)}`,
      time: 'Hace un momento',
      type: 'Egreso de Caja',
      description: `${description} (${category || 'General'})`,
      method: 'Efectivo',
      amount: -numericAmount,
      status: 'Completado'
    };

    setTransactions(prev => [newTrx, ...prev]);
    return newTrx;
  };

  // Cierre de Turno y Arqueo
  const closeShift = ({ countedCash, notes }) => {
    const expected = shift.initialCash + shift.cashSales - shift.expenses;
    const counted = parseFloat(countedCash) || 0;
    const diff = counted - expected;

    const record = {
      id: `SFT-${Math.floor(100 + Math.random() * 900)}`,
      date: `Hoy — ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      cashier: shift.cashierName,
      totalSales: shift.cashSales + shift.yapeSales + shift.plinSales + shift.cardSales,
      cashSales: shift.cashSales,
      yapeSales: shift.yapeSales,
      plinSales: shift.plinSales,
      cardSales: shift.cardSales,
      expenses: shift.expenses,
      initialCash: shift.initialCash,
      countedCash: counted,
      diff,
      notes: notes || 'Cierre regular de turno'
    };

    setShiftHistory(prev => [record, ...prev]);
    setShift(prev => ({
      ...prev,
      isOpen: false,
      lastClosedRecord: record
    }));

    return record;
  };

  // Apertura de Nuevo Turno
  const openShift = ({ cashierName, initialCash }) => {
    setShift({
      isOpen: true,
      openedAt: new Date().toISOString(),
      cashierName: cashierName || 'Cajero de Turno',
      initialCash: parseFloat(initialCash) || 0,
      cashSales: 0,
      yapeSales: 0,
      plinSales: 0,
      cardSales: 0,
      expenses: 0,
      lastClosedRecord: null
    });
  };

  return (
    <BillarContext.Provider value={{
      tables,
      products,
      rates,
      shift,
      shiftHistory,
      transactions,
      cart,
      currentView,
      currentTime,
      setCurrentView,
      getTableElapsedSeconds,
      getTableTimeCost,
      getTableOrdersCost,
      getTableTotalCost,
      formatTime,
      startTable,
      stopTable,
      addOrderToTable,
      checkoutTable,
      addToCart,
      updateCartQty,
      clearCart,
      checkoutCart,
      addProduct,
      updateProduct,
      deleteProduct,
      adjustStock,
      addExpense,
      closeShift,
      openShift
    }}>
      {children}
    </BillarContext.Provider>
  );
}

export function useBillar() {
  const context = useContext(BillarContext);
  if (!context) {
    throw new Error('useBillar must be used within a BillarProvider');
  }
  return context;
}
