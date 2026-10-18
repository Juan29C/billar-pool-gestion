# PLAN.md — Plan de Maquetación e Implementación de Interfaces Visuales

**Proyecto:** Sistema de Gestión para Billar Club & Lounge (Club LIVERPOOL)  
**Documentos de Referencia:** [SPEC.md](file:///c:/xampp/htdocs/billar/SPEC.md), [DESIGN.md](file:///c:/xampp/htdocs/billar/DESIGN.md), [PENDIENTES.md](file:///c:/xampp/htdocs/billar/PENDIENTES.md)  
**Alcance:** Prototipo visual interactivo navegable (Front-end), maquetación de alta fidelidad, simulaciones locales y cumplimiento estricto del sistema de diseño oficial de Club LIVERPOOL (**Azul Eléctrico Tournament `#008ED6`**, **Neón Ámbar `#F5A623`** y **Carbón Profundo `#161413`**).

---

## 1. Objetivo General

Desarrollar una aplicación web interactiva y comercialmente presentable que cumpla con todos los requisitos visuales y de interacción descritos en [SPEC.md](file:///c:/xampp/htdocs/billar/SPEC.md), implementando la identidad visual del local real (**Club LIVERPOOL**) con mesas en paño azul torneo profesional, iluminación ámbar neón, doble modalidad de cronómetros (Libre vs. Cuenta Regresiva) y adaptabilidad responsive completa para smartphones, tablets y monitores. El seguimiento detallado de ítems se gestiona a través del checklist vivo en [PENDIENTES.md](file:///c:/xampp/htdocs/billar/PENDIENTES.md).

---

## 2. Stack Tecnológico para la Maquetación

* **Entorno**: Aplicación web moderna con **Vite + React** (o HTML5/CSS3/JS modular) para garantizar recarga instantánea en desarrollo, componentes reutilizables limpios y rendimiento fluido.
* **Estilos**: **Vanilla CSS / CSS Modules / Variables CSS** basadas estrictamente en los tokens definidos en [DESIGN.md](file:///c:/xampp/htdocs/billar/DESIGN.md) (sin dependencias engorrosas, control total de acabados y micro-animaciones).
* **Iconografía**: Lucide Icons o Phosphor Icons (modernos, limpios y consistentes).
* **Tipografías**: Google Fonts (`Outfit` para títulos y números de impacto, `Plus Jakarta Sans` para lectura y controles).
* **Gestión de Estado de Prototipo**: Estado local en React y sincronización con `localStorage` para que la simulación persista entre recargas (cronómetros, mesas abiertas, ventas ficticias y turnos).

---

## 3. Fases de Implementación

### Fase 1: Cimientos del Sistema de Diseño y Layout Base — [COMPLETADA Y VERIFICADA]
* Configurar el proyecto y la estructura de carpetas (`src/components`, `src/views`, `src/styles`, `src/mockData`).
* Crear el archivo de tokens CSS (`tokens.css`) con variables para la tríada oficial LIVERPOOL (`#1A1817`, `#008ED6`, `#F5A623`), tipografías, radios y sombras.
* Construir los componentes estructurales globales:
  * **Sidebar**: Navegación con los 9 módulos, estado activo en Ámbar Neón, branding del local y colapsable en pantallas pequeñas.
  * **Topbar**: Breadcrumbs, buscador rápido, estado de turno de caja y perfil de usuario.
  * **Layout Wrapper**: Contenedor responsivo (escritorio, tablet y móvil).

---

### Fase 2: Componentes Reutilizables de Interfaz (Design System Avanzado) — [COMPLETADA Y VERIFICADA]
Construir los componentes atómicos y moleculares para evitar duplicidad de estilos:
* **Botones**: Primario Ámbar Neón LIVERPOOL, Secundario neutro, Contorno y Peligro con alturas táctiles uniformes de 44px.
* **Badges / Chips**: Estados de mesa (Disponible, Ocupada, Por cobrar, Mantenimiento) y estados de stock.
* **Tarjetas y Contenedores**: Con bordes suaves y elevación nivel 1/2.
* **Inputs y Selects**: Con estilo pulido y validaciones visuales.
* **Buscador de Productos (`ProductSearchSelect`)**: Combobox reutilizable con autocompletado en tiempo real, chips de categorías, precios y badges de stock.
* **Modales Reutilizables Temáticos (`Modal` & `ConfirmModal`)**: Cabecera nocturna en Carbón Profundo (`#1A1817`), iconografía de billar/bar, alineación simétrica y formato bottom-sheet táctil en pantallas pequeñas.
* **Sidebar Dinámico**: Modo expandido (260px) y compacto (72px), con soporte nativo de apertura en nueva pestaña vía clic central (scroll-click).

---

### Fase 3: Módulo de Mesas (Núcleo Operativo Físico) — [COMPLETADA Y VERIFICADA]
* **Grid de Mesas Adaptativo (Laptop vs. Monitor)**:
  * Distribución oficial del local: 6 mesas físicas (4 de Pool con 6 troneras y 2 de Billar Francés con diamantes).
  * Cronómetro visual en vivo por segundo (horas, minutos y segundos).
  * Tarifa por hora aplicada y cálculo dinámico de importe en tiempo real (`S/ XX.XX`).
* **Control y Calibración de Tiempos**:
  * **Dualidad de Cronómetros (Tiempo Libre vs. Cuenta Regresiva)**:
    * **Modo Tiempo Libre**: Cronómetro ascendente continuo desde `00:00:00`, facturación proporcional por horas.
    * **Modo Cuenta Regresiva**: Tiempo contratado fijo (chips de 30m, 45m, 1h, 1h 30m, 2h o personalizado). Cuenta descendente en vivo, alerta luminosa y aviso a los 5 minutos (`< 5 MIN`), y al cumplirse los 00:00:00 activa alarma visual roja e inicia cronómetro progresivo de sobretiempo (`+HH:MM:SS`) sumando la tarifa extra.
  * Selector de momento de inicio al abrir mesa: En tiempo real (00:00:00) o retroactivo (hace 15, 30, 45, 60 min o personalizado).
  * **Modal Unificado de Gestión de Partida Activa (`Modal 4`, 660px)**: Panel de control integral para mesas en juego o por cobrar. Pestaña de tiempos para extender cuenta regresiva (`+15m`, `+30m`, `+45m`, `+1h`), cambiar modalidad en caliente (Libre <-> Regresiva), calibrar minutos transcurridos, **botón de acción rápida para finalizar/congelar cronómetro inmediatamente** (`stopTable`), botón para reanudar partida (`resumeTable`), y pestaña de resumen de cuenta con salto directo a liquidación y cobro.
  * Botón de restauración limpia de tiempos de prueba (`Restablecer Tiempos Demo`) con confirmación segura para sanear cronómetros acumulados en el navegador.
* **Modales Interactivos Temáticos de Alta Visibilidad**:
  * Modal *Iniciar Partida*: Selección de tarifa, cliente y selector de tiempo de inicio (ancho optimizado 600px).
  * Modal *Añadir Consumo (Comanda Multi-Producto)*: Rediseño espacioso a 2 columnas (1020px), catálogo ágil en columna izquierda con selector de cantidades y columna derecha con **canasta/comanda multi-producto**, permitiendo cargar múltiples cervezas, gaseosas y piqueos en una sola acción con actualización automática de stock.
  * Modal *Liquidación y Cobro*: Voucher contable ampliado (700px) con líneas punteadas, desglose por conceptos y selector simétrico de método de pago.
  * Centrado absoluto en viewport vía `createPortal(..., document.body)` inmune a transforms y seguro contra recortes de barra de tareas.

---

### Fase 4: Punto de Venta (POS) y Gestión de Inventario — [COMPLETADA Y VERIFICADA]
* **Punto de Venta (POS)**:
  * Catálogo visual fluido en cuadrícula con chips y badges de categorías (*Cervezas, Bebidas sin Alcohol, Piqueos, Snacks, Accesorios*).
  * Buscador en tiempo real por nombre o SKU con botón de limpieza rápida.
  * Carrito de compras lateral con ajuste de cantidades `[-] [qty] [+]`, cálculo automático de subtotal, IGV y total.
  * Selector de método de pago con 4 botones simétricos (*Efectivo, Yape, Plin, Tarjeta*).
  * Modal temático de comprobante/ticket digital (`Modal.jsx`, 640px) con desglose, botón de impresión y actualización de caja.
  * Modal de confirmación para vaciado de carrito con `ConfirmModal.jsx`.
* **Inventario**:
  * 4 tarjetas KPI de resumen de almacén (total productos, unidades físicas, valorización total de stock y alerta de reposición).
  * Tabla limpia de inventario con SKU monoespaciado, control ágil de stock `[- / +]`, badges de estado (*Óptimo, Alerta, Agotado*).
  * Modal estandarizado de registro de nuevo producto (`Modal.jsx`, 620px) conectado al contexto.
  * Modal estandarizado de edición de producto (`Modal.jsx`, 620px).
  * Modal de confirmación para eliminación de producto con `ConfirmModal.jsx`.

---

### Fase 5: Dashboard Principal, Caja y Turnos — [COMPLETADA Y VERIFICADA]
* **Dashboard**:
  * 4 Tarjetas KPI interactivas (Ocupación de Sala %, Ingresos del Turno, Operaciones Totales, Alertas de Stock) con navegación fluida al hacer clic.
  * Distribución de las 6 Mesas en vivo con semáforos, tipo de juego (Pool vs Francés) y cronómetros.
  * Feed de últimos movimientos del turno con discriminación de ingresos y egresos.
  * Barra de acciones rápidas para aperturar partidas o despachar en POS.
* **Caja y Turnos**:
  * Hero card nocturno con estado del turno (*Activo/Cerrado*), responsable, hora y total recaudado.
  * Desglose financiero por canal de pago (*Efectivo en Gaveta, Yape, Plin, Tarjeta, Total Egresos*).
  * Modal estandarizado de registro de egresos / gastos menores (`Modal.jsx`, 540px) conectado al saldo en gaveta.
  * Modal interactivo de cierre de turno y arqueo físico (`Modal.jsx`, 640px) con cálculo automático en vivo de balance y diferencias (*Cuadre Exacto, Sobrante, Faltante*).
  * Modal de apertura de nuevo turno (`Modal.jsx`, 540px) con asignación de fondo inicial.
  * Historial de arqueos y cierres anteriores.

---

### Fase 6: Historial de Operaciones, Reportes y Configuración — [FUNCIONAL CON TARIFAS EDITABLES]
* **Historial de Operaciones**:
  * Filtros en tiempo real por búsqueda de ID, detalle y método de pago (Efectivo, Yape, Plin, Tarjeta).
  * Simulación de exportación de datos.
* **Reportes**:
  * Gráficas de ocupación por horas y métricas de productos más vendidos y facturación.
* **Configuración**:
  * Formulario con **tarifas por hora editables para Pool y Tres Bandas**, conectadas al estado global para actualizar los cobros de mesa al guardar cambios.
  * Configuración de datos comerciales del establecimiento y parámetros de redondeo.

---

### Fase 7: Pantalla Pública Vertical (Modo TV / Sala) — [COMPLETADA Y VERIFICADA]
* Crear la ruta independiente `/pantalla-mesas` (sin sidebar administrativo).
* Optimizar la disposición para pantallas verticales (orientación portrait).
* Tipografía de gran escala, alto contraste carbón/blanco/neón ámbar visible a distancia.
* Semáforos de disponibilidad de mesas y branding oficial Club LIVERPOOL con resplandor neón.

---

### Fase 8: Adaptabilidad Responsive por Módulos y Pulido Final — [COMPLETADA Y VERIFICADA]
* **Mesas de Billar (`TablesView`)**:
  * Desktop: Grid 3-4 columnas con tarjeta extendida y esquineros metálicos.
  * Tablet: Grid 2 columnas balanceadas táctiles.
  * Móvil (<768px): Tarjeta vertical compacta fluida con modales tipo bottom-sheet táctiles adaptados al viewport sin recortes.
* **Punto de Venta (`POSView`)**:
  * Desktop: Catálogo en cuadrícula fluida + carrito lateral fijo.
  * Móvil / Tablet: Reorganización en 1 columna mediante `pos-layout-grid` y barra flotante interactiva fija inferior (*"🛒 Ver Carrito (X) • S/ XX.XX — Ir a Pagar"*) con salto suave a liquidación.
* **Inventario (`InventoryView`)**:
  * Scroll horizontal suave controlado con `-webkit-overflow-scrolling: touch` y KPIs adaptables en 2 columnas móviles.
  * Botones de ajuste rápido de existencias `[- / +]` ampliados a 32px para toque táctil ergonómico.
* **Caja y Turnos (`CashRegisterView`)**:
  * Rejilla adaptativa de canales de pago (`minmax(150px, 1fr)`) y modales de arqueo sin desbordamiento.
* **Dashboard (`DashboardView`)**:
  * KPIs fluidos de 2 a 4 columnas según ancho de viewport y cuadrícula de distribución de mesas con clamp preventivo contra desbordamiento horizontal.
* **Validación**:
  * Cero desbordamientos horizontales en teléfonos y tablets.
  * Altura mínima de toques táctiles cómoda en toda la interfaz.

---

## 4. Estructura de Archivos Proyectada

```text
billar/
├── SPEC.md
├── DESIGN.md
├── PLAN.md
├── PENDIENTES.md
├── package.json
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── styles/
│   │   ├── tokens.css          # Variables (#161413, #008ED6, #F5A623, etc.)
│   │   ├── global.css          # Reseteo y tipografías
│   │   └── components.css      # Estilos comunes de botones, tarjetas, badges, modales bottom-sheet
│   ├── data/
│   │   └── mockData.js         # Mesas, productos, tarifas y transacciones ficticias
│   ├── context/
│   │   └── BillarContext.jsx   # Estado interactivo simulado (mesas activas, dual timer, comanda, carrito)
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── Topbar.jsx
│   │   ├── TableCard.jsx       # Tarjeta de mesa con cronómetro dual y resplandor neón
│   │   ├── Modal.jsx
│   │   ├── ConfirmModal.jsx
│   │   ├── ProductSearchSelect.jsx
│   │   └── POSCart.jsx
│   └── views/
│       ├── DashboardView.jsx
│       ├── TablesView.jsx
│       ├── POSView.jsx
│       ├── InventoryView.jsx
│       ├── CashRegisterView.jsx
│       ├── HistoryView.jsx
│       ├── ReportsView.jsx
│       ├── SettingsView.jsx
│       └── PublicDisplayView.jsx   # Vista vertical para TV
```

---

## 5. Criterios de Éxito de la Entrega

1. **Fidelidad al Diseño**: 100% de coherencia con la paleta de Carbón Profundo (`#1A1817`), Azul Eléctrico Torneo (`#008ED6`) y Neón Ámbar (`#F5A623`) definida en [DESIGN.md](file:///c:/xampp/htdocs/billar/DESIGN.md).
2. **Interactividad Fluida**: Mesas con cronómetro dual en tiempo real (Libre vs. Cuenta Regresiva), comanda multi-producto por mesa, congelamiento/pausa de tiempo y cálculo dinámico de tarifas.
3. **Punto de Venta y Control de Inventario**: Carrito de compras reactivo con barra flotante móvil, catálogo fluido y ajuste táctil de existencias.
4. **Vista Vertical Independiente**: Lista y accesible en `/pantalla-mesas` para monitores de sala con resplandor neón.
5. **Cero Errores de Consola y Compilación Limpia**: Navegación ágil, modales tipo bottom-sheet en móviles y build de producción verificado sin advertencias.
