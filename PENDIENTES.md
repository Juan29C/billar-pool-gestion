# PENDIENTES.md — Plan de Acción e Implementación: Club LIVERPOOL

**Proyecto:** Sistema de Gestión Integral — Club LIVERPOOL  
**Documentos de Referencia:** [SPEC.md](file:///c:/xampp/htdocs/billar/SPEC.md), [DESIGN.md](file:///c:/xampp/htdocs/billar/DESIGN.md), [PLAN.md](file:///c:/xampp/htdocs/billar/PLAN.md)  
**Objetivo:** Implementar la identidad oficial del local real (**Azul Eléctrico Tournament** y **Neón Ámbar LIVERPOOL**), la **dualidad de cronómetros (Tiempo Libre vs. Cuenta Regresiva)** y la **adaptabilidad responsive profunda módulo por módulo**.

---

## 📋 Checklist de Ejecución por Bloques

### 🎨 Bloque 1: Identidad Visual Oficial Club LIVERPOOL
> Adaptación del sistema de diseño a la atmósfera real del club (letrero neón ámbar/dorado y mesas de paño azul torneo profesional).

- [x] **1.1. Actualización de Tokens CSS (`src/styles/tokens.css` y `DESIGN.md`)**
  - [x] Incorporar color **Azul Eléctrico Tournament**: `#008ED6` / `#0077C8` (Paño oficial de juego).
  - [x] Incorporar color **Neón Ámbar LIVERPOOL**: `#F5A623` / `#FFB020` (Acentos de luz, botones de acción y cronómetro activo).
  - [x] Ajustar **Carbón Profundo de Sala**: `#161413` / `#221E1D` (Estructura de tarjetas, sidebar y muebles).
  - [x] Crear variables de resplandor neón: `--neon-amber-glow` y `--neon-blue-glow`.
- [x] **1.2. Rediseño Visual de Tarjetas de Mesa (`TableCard.jsx`)**
  - [x] Paño de mesa en Azul Torneo profesional para mesas disponibles.
  - [x] Marco en carbón noble con esquineros metálicos pulidos.
  - [x] Borde iluminado con resplandor en Ámbar Neón e indicador neón superior cuando la mesa esté en juego activo.
  - [x] Tipografía de cronómetro de alta legibilidad nocturna con brillo Neón Ámbar.
- [x] **1.3. Actualización de la Pantalla Pública Vertical (`PublicDisplayView.jsx`)**
  - [x] Logotipo / Imagotipo representativo de Club LIVERPOOL con efecto neón.
  - [x] Visualización de mesas con la nueva paleta Azul Torneo y Neón Ámbar para monitores de sala.

---

### ⏱️ Bloque 2: Dualidad de Cronómetros (Tiempo Libre vs. Cuenta Regresiva)
> Soporte completo para las dos dinámicas de juego del billar tradicional y moderno.

- [x] **2.1. Lógica en Contexto (`BillarContext.jsx`)**
  - [x] Estructura de mesa con `playMode`: `'free'` (libre) o `'countdown'` (fijo).
  - [x] Para `countdown`: almacenar `targetMinutes` y calcular `remainingSeconds`.
  - [x] Detección de **Alerta de 5 minutos** (`isNearEnd`).
  - [x] Detección de **Tiempo Cumplido** (`isTimeOver`) a los 00:00:00.
  - [x] Contador de **Sobretiempo** progresivo (`+00:05:12`) tras vencerse el tiempo límite, sumando el costo correspondiente a la tarifa.
- [x] **2.2. Modal de Apertura de Mesa (`TablesView.jsx`)**
  - [x] Selector interactivo de modalidad al abrir mesa:
    - [x] **Tiempo Libre**: El cronómetro arranca en `00:00:00` y sube.
    - [x] **Tiempo Límite / Cuenta Regresiva**: Selector rápido de 30 min, 45 min, 1h, 1h 30m, 2h o minutos personalizados.
  - [x] Resumen previo del importe asignado si es tiempo prepago/fijo.
- [x] **2.3. Indicadores en Vivo en la Tarjeta de Mesa (`TableCard.jsx`)**
  - [x] Etiqueta indicadora: `⏱ TIEMPO LIBRE` vs. `⏳ CUENTA REGRESIVA`.
  - [x] Cuenta atrás en vivo por segundo.
  - [x] Micro-animación o pulso ámbar cuando falten menos de 5 minutos.
  - [x] Estado de advertencia roja/neón cuando el tiempo haya culminado.
- [x] **2.4. Modal Unificado de Gestión de Partida Activa (`TablesView.jsx`)**
  - [x] Panel de Control unificado al presionar `⚙️ Ajustar` en mesa activa o por cobrar.
  - [x] **Pestaña Control de Tiempos**: Extensión rápida de tiempo contratado en cuenta regresiva (`+15m`, `+30m`, `+45m`, `+1h`), cambio de modo en caliente (Libre <-> Regresiva) y corrección de minutos transcurridos.
  - [x] **Acción de Finalización Anticipada / Congelar**: Botón `⏸️ Finalizar Tiempo / Congelar Cronómetro` para detener el reloj en el segundo actual sin liberar la cuenta, y botón `▶️ Reanudar Cronómetro` si se pausó por error.
  - [x] **Pestaña Resumen y Consumos**: Detalle financiero en vivo (tiempo + bar) con acceso directo para añadir más productos o saltar inmediatamente a `Cobrar en Caja`.

---

### 📱 Bloque 3: Adaptabilidad Responsive Avanzada Módulo por Módulo
> Garantizar navegación táctil fluida tanto en laptops de caja como en tablets de mozos y teléfonos móviles.

- [x] **3.1. Módulo de Mesas (`TablesView.jsx`)**
  - [x] *Desktop (>1024px)*: Cuadrícula fluida de 3-4 columnas.
  - [x] *Tablet (768px-1024px)*: 2 columnas balanceadas con controles táctiles de 44px.
  - [x] *Móvil (<768px)*: 1 columna con tarjetas fluidas y modales tipo bottom-sheet táctiles adaptados a la pantalla móvil.
- [x] **3.2. Punto de Venta — POS (`POSView.jsx`)**
  - [x] *Desktop*: Catálogo de 3 columnas + Carrito lateral fijo.
  - [x] *Móvil / Tablet*: Catálogo fluido en `pos-layout-grid` con barra inferior flotante interactiva (*"🛒 Ver Carrito (X) • S/ XX.XX — Ir a Pagar"*), con salto suave a liquidación.
- [x] **3.3. Control de Inventario (`InventoryView.jsx`)**
  - [x] Tabla con scroll horizontal suave `-webkit-overflow-scrolling: touch` y KPIs fluidos en 2 columnas móviles.
  - [x] Botones táctiles ampliados a 32px para ajuste ergonómico de stock `[- / +]`.
- [x] **3.4. Caja y Turnos (`CashRegisterView.jsx`)**
  - [x] Desglose financiero por canal de pago reorganizado en cuadrícula responsive (`minmax(150px, 1fr)`).
  - [x] Modales de Arqueo y Cierre de turno ajustados al viewport móvil sin recortes.
- [x] **3.5. Dashboard Principal (`DashboardView.jsx`)**
  - [x] Tarjetas KPI fluidas (2 columnas en móvil, 4 en monitor grande con `minmax(150px, 1fr)`).
  - [x] Cuadrícula de distribución de mesas y transacciones sin desbordamiento horizontal en viewports angostos.

---

### 📑 Bloque 4: Cierre del Prototipo y Documentación
- [x] **4.1. Actualizar `DESIGN.md` con la paleta oficial LIVERPOOL.**
- [x] **4.2. Actualizar `PLAN.md` con los avances y estado de cada fase.**
- [x] **4.3. Validación de compilación y verificación de consola sin errores.**

---

*Estado final del documento: ¡Todos los bloques (1, 2, 3 y 4) completados al 100% y validados exitosamente!*

