# PLAN.md — Plan de Maquetación e Implementación de Interfaces Visuales

**Proyecto:** Sistema de Gestión para Billar Club & Lounge  
**Documentos de Referencia:** [SPEC.md](file:///c:/xampp/htdocs/billar/SPEC.md) & [DESIGN.md](file:///c:/xampp/htdocs/billar/DESIGN.md)  
**Alcance:** Prototipo visual interactivo navegable (Front-end), maquetación de alta fidelidad, simulaciones locales y cumplimiento estricto del sistema de diseño.

---

## 1. Objetivo General

Desarrollar una aplicación web interactiva y comercialmente presentable que cumpla con todos los requisitos visuales y de interacción descritos en [SPEC.md](file:///c:/xampp/htdocs/billar/SPEC.md), implementando la identidad visual refinada en [DESIGN.md](file:///c:/xampp/htdocs/billar/DESIGN.md) con la paleta de tres colores base (**Carbón Cálido `#2B2725`**, **Terracota `#9C564B`** y **Blanco `#FFFFFF`**).

---

## 2. Stack Tecnológico para la Maquetación

* **Entorno**: Aplicación web moderna con **Vite + React** (o HTML5/CSS3/JS modular) para garantizar recarga instantánea en desarrollo, componentes reutilizables limpios y rendimiento fluido.
* **Estilos**: **Vanilla CSS / CSS Modules / Variables CSS** basadas estrictamente en los tokens definidos en [DESIGN.md](file:///c:/xampp/htdocs/billar/DESIGN.md) (sin dependencias engorrosas, control total de acabados y micro-animaciones).
* **Iconografía**: Lucide Icons o Phosphor Icons (modernos, limpios y consistentes).
* **Tipografías**: Google Fonts (`Outfit` para títulos y números de impacto, `Plus Jakarta Sans` para lectura y controles).
* **Gestión de Estado de Prototipo**: Estado local en React y sincronización con `localStorage` para que la simulación persista entre recargas (cronómetros, mesas abiertas, ventas ficticias y turnos).

---

## 3. Fases de Implementación

### Fase 1: Cimientos del Sistema de Diseño y Layout Base
* Configurar el proyecto y la estructura de carpetas (`src/components`, `src/views`, `src/styles`, `src/mockData`).
* Crear el archivo de tokens CSS (`tokens.css`) con variables para colores (`#2B2725`, `#9C564B`, `#FFFFFF`, semánticos), tipografías, radios y sombras.
* Construir los componentes estructurales globales:
  * **Sidebar**: Navegación con los 9 módulos, estado activo en terracota, branding del local y colapsable en pantallas pequeñas.
  * **Topbar**: Breadcrumbs, buscador rápido, estado de turno de caja y perfil de usuario.
  * **Layout Wrapper**: Contenedor responsivo (escritorio, tablet y móvil).

---

### Fase 2: Componentes Reutilizables de Interfaz (Design System Avanzado)
Construir los componentes atómicos y moleculares para evitar duplicidad de estilos:
* **Botones**: Primario Terracota, Secundario neutro, Contorno y Peligro con alturas táctiles uniformes de 44px.
* **Badges / Chips**: Estados de mesa (Disponible, Ocupada, Por cobrar, Mantenimiento) y estados de stock.
* **Tarjetas y Contenedores**: Con bordes suaves y elevación nivel 1/2.
* **Inputs y Selects**: Con estilo pulido y validaciones visuales.
* **Buscador de Productos (`ProductSearchSelect`)**: Combobox reutilizable con autocompletado en tiempo real, chips de categorías, precios y badges de stock.
* **Modales Reutilizables Temáticos (`Modal` & `ConfirmModal`)**: Cabecera nocturna en Carbón Cálido (`#2B2725`), iconografía de billar/bar, alineación simétrica y formato bottom-sheet táctil en pantallas pequeñas.
* **Sidebar Dinámico**: Modo expandido (260px) y compacto (72px), con soporte nativo de apertura en nueva pestaña vía clic central (scroll-click).

---

### Fase 3: Módulo de Mesas (Núcleo Operativo Físico) — [COMPLETADA Y VERIFICADA]
* **Grid de Mesas Adaptativo (Laptop vs. Monitor)**:
  * Distribución oficial del local: 6 mesas físicas (4 de Pool con 6 troneras y 2 de Billar Francés con diamantes).
  * Cronómetro visual en vivo por segundo (horas, minutos y segundos).
  * Tarifa por hora aplicada y cálculo dinámico de importe en tiempo real (`S/ XX.XX`).
* **Modales Interactivos Temáticos de Alta Visibilidad**:
  * Modal *Iniciar Partida*: Selección de tarifa y notas con imagotipo de billar (ancho optimizado 600px).
  * Modal *Agregar Consumo*: Rediseño espacioso a 2 columnas (1020px), buscador limpio en tiempo real, chips de categoría y catálogo con scroll amplio (hasta 6 productos a la vista).
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

### Fase 5: Dashboard Principal, Caja y Turnos — [PRÓXIMA A EJECUTAR]
* **Dashboard**:
  * Tarjetas KPI de alto impacto (Mesas activas, Ingresos del día, Partidas jugadas, Alertas de inventario).
  * Resumen visual del estado de las mesas en tiempo real.
  * Tabla de actividad reciente y gráfico simulado de ingresos.
* **Caja y Turnos**:
  * Indicador de turno abierto/cerrado con hora y responsable.
  * Resumen de ingresos por método de pago (Efectivo vs. Billeteras digitales vs. Tarjetas).
  * Registro de egresos rápidos simulados y arqueo de caja con balance.

---

### Fase 6: Historial de Operaciones, Reportes y Configuración
* **Historial de Operaciones**:
  * Filtros por fecha, tipo de operación (Partida, Venta POS) y método de pago.
  * Modal de detalle con desglose de la transacción.
* **Reportes**:
  * Gráficas estilizadas de horas con mayor ocupación, productos más vendidos y distribución de ingresos.
* **Configuración**:
  * Formulario visual para tarifas por hora/minuto, datos del establecimiento y reglas de redondeo.

---

### Fase 7: Pantalla Pública Vertical (Modo TV / Sala)
* Crear la ruta independiente `/pantalla-mesas` (sin sidebar administrativo).
* Optimizar la disposición para pantallas verticales (orientación portrait).
* Tipografía de gran escala, alto contraste carbón/blanco/terracota visible a distancia.
* Semáforos de disponibilidad de mesas y mensajes del establecimiento.

---

### Fase 8: Revisión Final, Responsive y Pulido de Detalles
* Ajustes de responsive design: Desktop amplio, tablet (sidebar compacta) y móvil.
* Comprobación de contrastes accesibles y micro-animaciones en todos los botones y modales.
* Validación frente a todos los criterios de aceptación de [SPEC.md](file:///c:/xampp/htdocs/billar/SPEC.md).

---

## 4. Estructura de Archivos Proyectada

```text
billar/
├── SPEC.md
├── DESIGN.md
├── PLAN.md
├── package.json
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── styles/
│   │   ├── tokens.css          # Variables (#2B2725, #9C564B, #FFFFFF, etc.)
│   │   ├── global.css          # Reseteo y tipografías
│   │   └── components.css      # Estilos comunes de botones, tarjetas, badges
│   ├── data/
│   │   └── mockData.js         # Mesas, productos, tarifas y transacciones ficticias
│   ├── context/
│   │   └── BillarContext.jsx   # Estado interactivo simulado (mesas activas, carrito)
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── Topbar.jsx
│   │   ├── TableCard.jsx       # Tarjeta de mesa con cronómetro
│   │   ├── Modal.jsx
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

1. **Fidelidad al Diseño**: 100% de coherencia con la paleta de Carbón Cálido, Terracota y Blanco definida en [DESIGN.md](file:///c:/xampp/htdocs/billar/DESIGN.md).
2. **Interactividad Fluida**: Mesas con cronómetro activo en tiempo real, adición de consumos y cálculo de tarifas funcional.
3. **Punto de Venta Operativo en Demo**: Carrito de compras reactivo y registro simulado sin errores.
4. **Vista Vertical Independiente**: Lista y accesible para pruebas en pantalla tipo quiosco/TV.
5. **Cero Errores de Consola**: Navegación y cambios de estado limpios y rápidos.
