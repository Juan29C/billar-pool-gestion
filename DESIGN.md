# DESIGN.md — Sistema de Diseño Visual para Billar Club & Lounge

**Versión:** 1.0  
**Enfoque:** Premium, Moderno, Cálido y Sofisticado  
**Objetivo:** Establecer la guía visual estricta para garantizar una experiencia de usuario llamativa, coherente y comercialmente atractiva en todas las pantallas del sistema.

---

## 1. Filosofía y Dirección Visual

El sistema se aleja de la estética anticuada de software de escritorio tradicional para ofrecer una experiencia visual propia de un **Club & Lounge de Billar contemporáneo**:
* **Atmósfera cálida y refinada**: Contrastes elegantes inspirados en materiales nobles (maderas oscuras, cuero, iluminación cálida y metales sobrios).
* **Claridad operativa inmediata**: La interfaz es limpia, sin saturación innecesaria ni sombras exageradas, priorizando la legibilidad de cronómetros, importes y estados de mesa a cualquier distancia.
* **Micro-interacciones vivas**: Transiciones sutiles, estados de hover claros, efectos de brillo controlado en cronómetros activos y pulsos suaves en partidas en curso.

---

## 2. Paleta Cromática Fundamental

### 2.1. Tríada Principal de Marca

| Color | Hex | Rol y Aplicación Principal |
| :--- | :--- | :--- |
| **Carbón Cálido** | `#2B2725` | **Superficie de Control**: Barra lateral (sidebar), barra superior (topbar), encabezados de tablas, modales oscuros y elementos que requieran máxima jerarquía estructural. |
| **Terracota** | `#9C564B` | **Acento Protagonista**: Botones principales (CTA), pestañas activas, elementos seleccionados, bordes focales y destacados de conversión/cobro. |
| **Blanco Puro** | `#FFFFFF` | **Lienzo de Trabajo**: Fondo de tarjetas, paneles de contenido, formularios, modales diurnos y celdas de datos. |

### 2.2. Paleta Extendida y Superficies Neutras

Para evitar interfaces planas y asegurar un contraste agradable y ergonómico:

| Token CSS | Hex | Propósito |
| :--- | :--- | :--- |
| `--bg-canvas` | `#F8F6F4` | Fondo general de la aplicación (crema/gris neutro muy suave, cálido). |
| `--surface-card` | `#FFFFFF` | Superficie de tarjetas y contenedores principales. |
| `--surface-hover` | `#F1ECE8` | Estados de hover en listas y filas de tablas. |
| `--border-subtle` | `#E5DED8` | Bordes suaves de separación en tarjetas y divisiones. |
| `--text-primary` | `#2B2725` | Texto principal de alto contraste y títulos. |
| `--text-muted` | `#7D726D` | Subtítulos, metadatos, etiquetas secundarias e indicadores auxiliares. |
| `--brand-dark-soft`| `#38322F` | Sub-niveles de la barra lateral y tarjetas oscuras secundarias. |
| `--brand-accent-hover`| `#83453B` | Hover de botones terracota (oscurecido elegante). |
| `--brand-accent-subtle`| `#F7EBE8` | Fondos de tags/badges activos con texto terracota. |

### 2.3. Colores Semánticos y Estados de Mesas

Los colores funcionales se calibran para convivir armónicamente con el carbón cálido y el terracota, evitando tonos fluorescentes estridentes:

| Estado | Color | Hex | Fondo de Tag (Badge) | Significado Operativo |
| :--- | :--- | :--- | :--- | :--- |
| **Disponible** | Verde Salvia / Esmeralda | `#2E7D52` | `#EAF5EE` | Mesa lista para abrir partida. |
| **Ocupada / Activa** | Ámbar Cálido | `#C87A18` | `#FDF4E7` | Partida en curso (cronómetro corriendo). |
| **Por Cobrar / Cierre** | Terracota Alerta | `#9C564B` | `#FBECE9` | Partida finalizada pendiente de pago en caja. |
| **Mantenimiento** | Gris Pizarra | `#66615E` | `#EFECE9` | Fuera de servicio o paño en mantención. |
| **Peligro / Anular** | Carmín Cálido | `#B93838` | `#FDEBEB` | Acciones destructivas y alertas críticas de stock. |

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
* Fondo: **Carbón Cálido (`#2B2725`)**.
* Logotipo superior: Tipografía estilizada con emblema de billar sutil en acabado Terracota y Blanco.
* Ítems de navegación:
  * Reposo: Texto e icono en gris cálido suave (`#A89F99`), hover sutil a `#3D3734`.
  * Activo: Fondo Terracota con opacidad (`rgba(156, 86, 75, 0.25)` o sólido), borde indicador izquierdo de `4px` en `#9C564B` y texto blanco brillante.
* Pie de barra: Indicador de turno de caja activo y botón de colapsar.

### 5.2. Tarjeta de Mesa de Billar (Componente Estrella)
La tarjeta es el elemento visual más importante del panel:
* **Cabecera de Tarjeta**:
  * Número y Tipo de mesa (ej. *Mesa 01 — Tres Bandas*).
  * Badge de estado con color semántico (Libre, Ocupada, Por cobrar).
* **Cuerpo de Tarjeta**:
  * **Cronómetro Visual**: Bloque central de alto contraste con fondo suave o display digital estilizado.
  * Datos en tiempo real: Hora de inicio, tiempo transcurrido, consumos adicionales sumados y tarifa por hora.
  * **Importe acumulado estimado**: Destacado en tipografía grande con símbolo de moneda (`S/ 00.00`).
* **Pie de Tarjeta (Acciones Operativas)**:
  * Si está Libre: Botón primario Terracota *"Abrir Partida"*.
  * Si está Ocupada: Botón secundario *"Añadir Consumo"* + Botón Terracota *"Finalizar / Cobrar"*.
  * Efecto animado: Pulso sutil en el cronómetro cuando la partida está en curso.

### 5.3. Punto de Venta (POS) y Carrito
* **Catálogo en Grid**: Tarjetas de productos visuales con foto o pictograma elegante de producto, nombre, stock restante en badge y precio destacado.
* **Carrito Lateral Flotante / Anclado**:
  * Lista rápida de ítems con botones `+` y `-`.
  * Opción de asociar a una mesa activa o cobro directo independiente.
  * Selector de método de pago táctil (Efectivo, Yape, Plin, Tarjeta).
  * Botón Terracota de gran tamaño: *"Confirmar Venta (S/ XX.XX)"*.

### 5.4. Pantalla Pública Vertical (Modo TV / Pantalla en Sala)
* **Orientación**: Optimizado para pantalla vertical (portrait 1080x1920) y adaptable a horizontal.
* **Estilo Visual**: Fondo Carbón Cálido (`#2B2725`) con alto contraste para lectura a más de 5 metros de distancia.
* **Contenido**:
  * Identificador gigante de mesa.
  * Semáforo visual claro (Verde = Disponible, Ámbar = En juego).
  * Sin botones interactivos, sin importes de caja ni datos sensibles.
  * Barra inferior con fecha/hora actual y mensaje de bienvenida / promociones.

---

## 6. Micro-Animaciones y Experiencia Interactiva

* **Feedback táctil y de clic**: Escala sutil `transform: scale(0.98)` en botones al hacer clic.
* **Transiciones de vista**: Fade-in suave de `150ms` a `200ms` al cambiar de módulo.
* **Cronómetros**: Actualización por segundo sin parpadeo del layout (fuentes monoespaciadas).
* **Modales**: Apertura suave con backdrop difuminado (`backdrop-filter: blur(4px); background: rgba(43, 39, 37, 0.4)`).

---

## 7. Criterios de Aprobación de Diseño

Toda pantalla construida debe cumplir rigurosamente con:
1. Usar únicamente los tokens de color definidos (`#2B2725`, `#9C564B`, `#FFFFFF` y sus neutros armónicos).
2. Mantener la consistencia en espaciados (múltiplos de 4px y 8px).
3. Nunca dejar botones sin hover o estados interactivos inertes.
4. Garantizar legibilidad perfecta con contrastes accesibles WCAG AA.
