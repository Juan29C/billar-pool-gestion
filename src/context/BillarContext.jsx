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

  // Vista actual en el panel ('dashboard', 'tables', 'pos', 'inventory', 'cash', 'history', 'reports', 'settings', 'public')
  const [currentView, setCurrentView] = useState('tables');

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
  };

  return (
    <BillarContext.Provider value={{
      tables,
      products,
      rates,
      shift,
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
      checkoutCart
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
