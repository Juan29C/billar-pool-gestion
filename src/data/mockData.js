// Datos de demostración oficiales para Billar Club & Lounge
// Configuración exacta del local: 6 Mesas (4 de Pool y 2 de Billar Francés / Tres Bandas)

export const INITIAL_RATES = [
  { id: 'rate_pool', name: 'Pool Estándar', pricePerHour: 15.00, minMinutes: 15 },
  { id: 'rate_carom', name: 'Tres Bandas Profesional', pricePerHour: 20.00, minMinutes: 15 }
];

export const getFreshInitialTables = () => [
  // --- 4 MESAS DE POOL (Con 6 Troneras) ---
  {
    id: 1,
    name: 'Mesa 01',
    tableType: 'pool', // 'pool' | 'carom'
    type: 'Pool Estándar',
    rateId: 'rate_pool',
    pricePerHour: 15.00,
    status: 'occupied',
    playMode: 'free', // 'free' (Tiempo libre ascendente) | 'countdown' (Cuenta regresiva)
    targetMinutes: null,
    startTime: new Date(Date.now() - 52 * 60 * 1000).toISOString(), // 52 mins
    players: 'Grupo Juan & Amigos',
    orders: [
      { id: 'prod_1', name: 'Cerveza Cusqueña Trigo 330ml', qty: 2, price: 10.00 }
    ]
  },
  {
    id: 2,
    name: 'Mesa 02',
    tableType: 'pool',
    type: 'Pool Estándar',
    rateId: 'rate_pool',
    pricePerHour: 15.00,
    status: 'occupied',
    playMode: 'countdown', // Cuenta regresiva: solicitó 2 horas (120m)
    targetMinutes: 120,
    startTime: new Date(Date.now() - 85 * 60 * 1000).toISOString(), // Lleva 1h 25m, restan 35 min
    players: 'Ernesto Torres',
    orders: [
      { id: 'prod_4', name: 'Coca Cola Sin Azúcar 500ml', qty: 2, price: 4.50 },
      { id: 'prod_8', name: 'Porción Tequeños de Queso', qty: 1, price: 18.00 }
    ]
  },
  {
    id: 3,
    name: 'Mesa 03',
    tableType: 'pool',
    type: 'Pool Estándar',
    rateId: 'rate_pool',
    pricePerHour: 15.00,
    status: 'available',
    playMode: 'free',
    targetMinutes: null,
    startTime: null,
    players: '',
    orders: []
  },
  {
    id: 4,
    name: 'Mesa 04',
    tableType: 'pool',
    type: 'Pool Estándar',
    rateId: 'rate_pool',
    pricePerHour: 15.00,
    status: 'pending', // Por cobrar
    playMode: 'free',
    targetMinutes: null,
    startTime: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    endTime: new Date().toISOString(),
    players: 'Familia Paredes',
    orders: [
      { id: 'prod_7', name: 'Red Bull Energy Drink', qty: 2, price: 12.00 }
    ]
  },

  // --- 2 MESAS DE BILLAR FRANCÉS / TRES BANDAS (Sin Troneras, Con Diamantes) ---
  {
    id: 5,
    name: 'Mesa 05',
    tableType: 'carom',
    type: 'Tres Bandas Profesional',
    rateId: 'rate_carom',
    pricePerHour: 20.00,
    status: 'occupied',
    playMode: 'countdown', // Cuenta regresiva: solicitó 35 min
    targetMinutes: 35,
    startTime: new Date(Date.now() - 32 * 60 * 1000).toISOString(), // Lleva 32 min, restan 3 min (Alerta < 5 min activa)
    players: 'Prof. Luis Ramos',
    orders: [
      { id: 'prod_6', name: 'Agua San Mateo con Gas', qty: 1, price: 3.50 }
    ]
  },
  {
    id: 6,
    name: 'Mesa 06',
    tableType: 'carom',
    type: 'Tres Bandas Profesional',
    rateId: 'rate_carom',
    pricePerHour: 20.00,
    status: 'available',
    playMode: 'free',
    targetMinutes: null,
    startTime: null,
    players: '',
    orders: []
  }
];

export const INITIAL_TABLES = getFreshInitialTables();

export const INITIAL_PRODUCTS = [
  {
    id: 'prod_1',
    sku: 'BEB-001',
    name: 'Cerveza Cusqueña Trigo 330ml',
    category: 'Cervezas',
    price: 10.00,
    cost: 5.50,
    stock: 36,
    minStock: 12,
    unit: 'Botella'
  },
  {
    id: 'prod_2',
    sku: 'BEB-002',
    name: 'Cerveza Corona Extra 355ml',
    category: 'Cervezas',
    price: 11.00,
    cost: 6.20,
    stock: 24,
    minStock: 12,
    unit: 'Botella'
  },
  {
    id: 'prod_3',
    sku: 'BEB-003',
    name: 'Cerveza Heineken 330ml',
    category: 'Cervezas',
    price: 10.50,
    cost: 5.80,
    stock: 6,
    minStock: 10,
    unit: 'Botella'
  },
  {
    id: 'prod_4',
    sku: 'GAS-001',
    name: 'Coca Cola Sin Azúcar 500ml',
    category: 'Bebidas Sin Alcohol',
    price: 4.50,
    cost: 2.20,
    stock: 45,
    minStock: 15,
    unit: 'Botella'
  },
  {
    id: 'prod_5',
    sku: 'GAS-002',
    name: 'Inca Kola Regular 500ml',
    category: 'Bebidas Sin Alcohol',
    price: 4.50,
    cost: 2.20,
    stock: 50,
    minStock: 15,
    unit: 'Botella'
  },
  {
    id: 'prod_6',
    sku: 'GAS-003',
    name: 'Agua San Mateo con Gas 600ml',
    category: 'Bebidas Sin Alcohol',
    price: 3.50,
    cost: 1.50,
    stock: 4,
    minStock: 10,
    unit: 'Botella'
  },
  {
    id: 'prod_7',
    sku: 'ENE-001',
    name: 'Red Bull Energy Drink 250ml',
    category: 'Bebidas Sin Alcohol',
    price: 12.00,
    cost: 7.00,
    stock: 18,
    minStock: 8,
    unit: 'Lata'
  },
  {
    id: 'prod_8',
    sku: 'SNK-001',
    name: 'Porción Tequeños de Queso (8 und)',
    category: 'Piqueos',
    price: 18.00,
    cost: 8.50,
    stock: 22,
    minStock: 5,
    unit: 'Porción'
  },
  {
    id: 'prod_9',
    sku: 'SNK-002',
    name: 'Alitas Broaster con Salsa BBQ',
    category: 'Piqueos',
    price: 24.00,
    cost: 11.00,
    stock: 14,
    minStock: 6,
    unit: 'Porción'
  },
  {
    id: 'prod_10',
    sku: 'SNK-003',
    name: 'Mix de Frutos Secos Salados',
    category: 'Snacks',
    price: 7.00,
    cost: 3.20,
    stock: 30,
    minStock: 10,
    unit: 'Bolsa'
  },
  {
    id: 'prod_11',
    sku: 'ACC-001',
    name: 'Tiza Master Azul Profesional',
    category: 'Accesorios',
    price: 5.00,
    cost: 2.00,
    stock: 40,
    minStock: 10,
    unit: 'Unidad'
  }
];

export const INITIAL_SHIFT = {
  isOpen: true,
  openedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  cashierName: 'Carlos Mendoza',
  initialCash: 250.00,
  cashSales: 185.00,
  yapeSales: 140.00,
  plinSales: 45.00,
  cardSales: 95.00,
  expenses: 30.00
};

export const INITIAL_TRANSACTIONS = [
  {
    id: 'TRX-1049',
    time: 'Hace 15 min',
    type: 'Mesa Finalizada',
    description: 'Mesa 01 (Pool Estándar 1h 15m) + 2 Cusqueña Trigo',
    method: 'Yape',
    amount: 38.75,
    status: 'Completado'
  },
  {
    id: 'TRX-1048',
    time: 'Hace 35 min',
    type: 'Venta POS',
    description: '1 Porción Tequeños + 2 Coca Cola',
    method: 'Efectivo',
    amount: 27.00,
    status: 'Completado'
  },
  {
    id: 'TRX-1047',
    time: 'Hace 1 hora',
    type: 'Mesa Finalizada',
    description: 'Mesa 05 (Tres Bandas 1h 30m)',
    method: 'Plin',
    amount: 30.00,
    status: 'Completado'
  }
];
