# DESIGN.md — Sistema de Diseño Visual: Club LIVERPOOL

**Versión:** 2.0 (Identidad Oficial Club LIVERPOOL)  
**Enfoque:** Lounge Nocturno, Mesas Profesionales Tournament Blue y Neón Ámbar  
**Objetivo:** Establecer la guía visual estricta para garantizar una experiencia de usuario idéntica a la atmósfera real del club (iluminación neón cálida, mesas de competencia y paño azul eléctrico).

---

## 1. Filosofía y Dirección Visual

El sistema refleja fielmente el ambiente y la arquitectura del local real (**Club LIVERPOOL**):
* **Atmósfera Lounge Nocturna**: Fondo en carbón profundo (`#1A1817` / `#161413`) con iluminación ámbar cálida focal, eliminando el verde oliva apagado genérico.
* **Mesas Profesionales Tournament Blue**: El paño de las mesas de billar reproduce el **Azul Eléctrico Torneo (`#008ED6`)** característico de mesas profesionales (Rasson / Simonis), visible desde el acceso al club.
* **Luz Neón de Entrada**: El letrero emblemático de la entrada se traslada a la interfaz a través del **Neón Ámbar (`#F5A623`)**, aplicado en cronómetros activos, botones de acción VIP y resplandores de partidas en juego.

---

## 2. Paleta Cromática Fundamental

### 2.1. Tríada Principal de Marca

| Color | Hex | Rol y Aplicación Principal |
| :--- | :--- | :--- |
| **Carbón Profundo** | `#1A1817` / `#221E1D` | **Superficie y Estructura**: Sidebar, topbar, marcos de las mesas y bordes contenedores (similar al entorno nocturno del club). |
| **Azul LIVERPOOL** | `#008ED6` / `#0077C8` | **Identidad de Paño y Acento**: Paño principal de juego en las mesas de billar, pestañas activas y elementos focales del sistema. |
| **Neón Ámbar** | `#F5A623` / `#E69A09` | **Luz e Indicadores VIP**: Botones CTA primarios, contadores de tiempo activo, bordes con brillo (glow) para partidas en juego y destacados de cobro. |

### 2.2. Colores Semánticos y Estados de Mesas

Los tonos del mapa de mesas en la interfaz se mantienen con el color azul característico cuando la mesa esté disponible, y usan el ámbar neón o terracota cuando la mesa esté en juego o por cobrar:

| Estado | Color | Hex | Fondo de Tag (Badge) | Significado Operativo |
| :--- | :--- | :--- | :--- | :--- |
| **Disponible / Libre** | Azul Paño Tournament | `#008ED6` | `#E8F4FC` | Mesa lista. Muestra el paño azul torneo original del club. |
| **Ocupada / Activa** | Ámbar Neón (LIVERPOOL) | `#F5A623` | `#FDF4E7` | Partida en curso (cronómetro corriendo y resplandor neón encendido). |
| **Por Cobrar / Cierre** | Terracota Cálido | `#C85A4B` | `#FBECE9` | Partida finalizada pendiente de pago en caja. |
| **Mantenimiento** | Gris Pizarra Oscuro | `#4A4543` | `#EFECE9` | Fuera de servicio o paño en mantenimiento. |

---

## 3. Tipografía y Escala Jerárquica

Se utilizará la combinación tipográfica moderna de Google Fonts: **`Outfit`** para titulares y elementos numéricos de impacto (cronómetros, precios, identificadores de mesa) e **`Inter`** o **`Plus Jakarta Sans`** para textos de lectura, controles y formularios.

### 3.1. Escala Tipográfica

* **Display Timer (Cronómetro de Mesa)**: `36px` a `48px`, Weight 700 / 800, Monospace tabular (`font-variant-numeric: tabular-nums;`).
* **H1 (Títulos de Módulo)**: `24px` a `28px`, Weight 700, Color `--text-primary`.
* **H2 (Secciones y Títulos de Tarjetas)**: `18px` a `20px`, Weight 600.
* **H3 (Subtítulos y Headers de Modales)**: `15px` a `16px`, Weight 600.
* **Body / Párrafos**: `14px`, Weight 400 / 500, Line-height `1.5`.
* **Caption / Metadatos / Badges**: `11px` a `12px`, Weight 600, Uppercase opcional en tags operativos.

---

## 4. Sistema de Elevaciones, Sombras y Bordes

Para mantener un aspecto sobrio y refinado:

* **Bordes redondeados (`border-radius`)**:
  * Badges y botones pequeños: `6px`
  * Botones estándar e inputs: `8px`
  * Tarjetas de mesas, modales y contenedores: `12px` a `14px`
  * Píldoras de estado (`pills`): `9999px`
* **Sombras (`box-shadow`)**:
  * Nivel 1 (Tarjetas en reposo): `0 1px 3px rgba(43, 39, 37, 0.05), 0 4px 12px rgba(43, 39, 37, 0.03)`
  * Nivel 2 (Hover en tarjetas / Dropdowns): `0 8px 24px rgba(43, 39, 37, 0.08), 0 2px 6px rgba(43, 39, 37, 0.04)`
  * Nivel 3 (Modales y Flyouts): `0 20px 40px rgba(43, 39, 37, 0.20)`

---

## 5. Diseño y Anatomía de Componentes Clave

### 5.1. Barra de Navegación Lateral (Sidebar)
* Fondo: **Carbón Profundo (`#1A1817` / `#161413`)**.
* Logotipo superior: Emblema circular Bola 8 en **Neón Ámbar (`#F5A623`)** con texto estricto **"CLUB LIVERPOOL — Billiards & Lounge"**.
* Ítems de navegación:
  * Reposo: Texto e icono en gris cálido suave (`#A89F99`), hover sutil a `#2A2421`.
  * Activo: Fondo sutil con resplandor, indicador neón lateral izquierdo en `#F5A623` y texto blanco brillante de alto contraste.
* Pie de barra: Indicador de turno de caja activo con led verde esmeralda y botón de colapso rápido.

### 5.2. Tarjeta de Mesa de Billar (Componente Estrella)
La tarjeta representa la mesa física real de billar:
* **Cabecera de Tarjeta**:
  * Identificador (ej. *Mesa 01 — Mesa de Pool*) y distintivo visual (Bola 8 para Pool, Tríada de bolas para Tres Bandas).
  * Badge de estado: Azul Torneo (`DISPONIBLE`), Ámbar Neón (`EN JUEGO`), Terracota (`POR COBRAR`).
* **Cuerpo de Tarjeta (Paño de Juego)**:
  * **Paño Oficial**: Degradado en **Azul Eléctrico Tournament (`#008ED6`)**.
  * **Indicador Neón Superior**: Línea superior con resplandor neón dorado/ámbar (`0 0 10px #F5A623, 0 0 20px #F5A623`) cuando la mesa está en juego, o rojo neón (`#E63946`) si el tiempo prepago culminó.
  * **Cronómetro Dual**:
    * *Modo Libre*: Ascendente desde `00:00:00`.
    * *Modo Cuenta Regresiva*: Descendente con aviso neón a los 5 min (`⚠️ QUEDAN < 5 MIN`) y sobretiempo acumulativo rojo (`🚨 TIEMPO CUMPLIDO +HH:MM:SS`).
  * Botón directo **`⚙️ Ajustar`** para abrir el Panel Unificado de Gestión de Partida.
  * Desglose de costo de tiempo, consumos sumados y **Total Acumulado en Ámbar Neón (`S/ XX.XX`)**.
* **Pie de Tarjeta (Acciones Operativas)**:
  * Mesa Libre: Botón primario en Ámbar Neón *"Abrir Mesa"*.
  * Mesa Ocupada: Botón *"☕ + Consumo"* + Botón Ámbar Neón *"✓ Cobrar"*.

### 5.3. Punto de Venta (POS) y Carrito
* **Catálogo en Grid**: Tarjetas visuales con pictograma de categoría, nombre, badge de stock y precio en Ámbar Neón.
* **Carrito Lateral Desktop**: Anclado a la derecha con botones táctiles `[-] [qty] [+]`, selector de pago y liquidación inmediata.
* **Barra Flotante Móvil (`.pos-mobile-cart-bar`)**: En pantallas $\le 960\text{px}$, si hay productos en el carrito, se despliega una barra fija inferior interactiva con badge numérico neón y botón *"Ir a Pagar"* con salto suave.

### 5.4. Pantalla Pública Vertical (Modo TV / Pantalla en Sala)
* **Orientación**: Optimizado para pantallas verticales (portrait) y televisores de salón.
* **Estilo Visual**: Fondo nocturno Carbón Profundo (`#231F1D`) con alto contraste para lectura a distancia.
* **Contenido**:
  * Cabecera neón con emblema oficial **CLUB LIVERPOOL**.
  * Cuadrícula de mesas con paño Azul Torneo.
  * Tiempo restante en vivo en cuenta regresiva con alertas luminosas o tiempo transcurrido en modo libre.

---

## 6. Micro-Animaciones y Experiencia Interactiva

* **Feedback táctil y de clic**: Escala sutil `transform: scale(0.98)` en botones al hacer clic.
* **Transiciones de vista**: Fade-in suave de `150ms` al cambiar de módulo.
* **Cronómetros**: Actualización por segundo sin parpadeo del layout (fuentes tabulares `tabular-nums`).
* **Resplandores Neón**: Pulsos de advertencia en ámbar y rojo al expirar tiempos prepago.

---

## 7. Criterios de Aprobación de Diseño

Toda pantalla construida debe cumplir rigurosamente con:
1. Usar únicamente los tokens de color oficiales (`#1A1817`, `#008ED6`, `#F5A623`).
2. Mantener la consistencia en espaciados (múltiplos de 4px y 8px).
3. Nunca dejar botones sin hover o estados interactivos inertes.
4. Garantizar legibilidad perfecta nocturna con contrastes accesibles WCAG AA.

---

## 8. Estrategia Responsive, Sidebar Compacto y Modales Avanzados

### 8.1. Breakpoints y Adaptabilidad Multi-Dispositivo
* **Monitor Amplio (≥ 1024px)**: Sidebar persistente (260px o 72px colapsado), grid de mesas de 3 a 4 columnas y catálogo POS a 3 columnas + carrito lateral.
* **Tablet (768px a 1023px)**:
  * Grid de mesas a 2 columnas balanceadas.
  * POS en cuadrícula fluida con carrito reposicionado y acceso ágil.
* **Móvil (≤ 767px)**:
  * Sidebar en drawer táctil off-canvas con backdrop difuminado.
  * Tarjetas de mesa a 1 columna ocupando el 100% del ancho (`clamp(260px, 100%, 340px)`).
  * Modales en formato **bottom-sheet táctil** (anclados abajo con esquinas redondeadas superiores y botones de ancho completo de $\ge 44\text{px}$).

### 8.2. Modal Unificado de Gestión de Partida Activa (`Modal 4`, 660px)
* Panel de control integral para partidas en juego o congeladas:
  * Pestaña de tiempos: Extensión rápida de cuenta regresiva (`+15m`, `+30m`, `+45m`, `+1h`), cambio de modalidad en caliente (Libre <-> Regresiva) y corrección de apertura tardía.
  * **Botón de Acción Rápida: "⏸️ Detener Cronómetro / Congelar Partida"**: Detiene el reloj en el segundo actual sin liberar consumos ni la cuenta, protegiendo al cliente de cobros indebidos mientras pide el ticket.
  * Botón para **"▶️ Reanudar Cronómetro"** si la mesa fue detenida por error.
  * Pestaña de consumos con desglose financiero y botón directo para proceder a cobrar en caja.

### 8.3. Modal de Comanda Multi-Producto (`Modal 2`, 1020px)
* Diseño responsive de dos columnas (`.comanda-grid-responsive`):
  * Columna izquierda con catálogo y buscador instantáneo.
  * Columna derecha con canasta interactiva `[-] [qty] [+]` para despachar múltiples cervezas, cócteles y piqueos en una sola acción con descuento automático de inventario.
  * En tablets y móviles se apila verticalmente de forma fluida sin desbordamientos.
