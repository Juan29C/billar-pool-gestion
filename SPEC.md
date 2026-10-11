# SPEC.md — Sistema Integral de Gestión para Billar

**Versión:** 1.0  
**Estado:** Especificación inicial para maquetación  
**Objetivo:** Construir un prototipo visual navegable de un sistema profesional de gestión para un negocio de billar.

---

## 1. Visión del producto

Desarrollar una aplicación web moderna que centralice las operaciones de un billar: administración de mesas, cronómetros, tarifas, ventas, inventario, caja, pagos y reportes.

El sistema debe reducir los registros manuales en cuadernos, facilitar el trabajo de los encargados y proporcionar al propietario información clara sobre el funcionamiento del negocio.

La interfaz debe ser lo suficientemente profesional para presentarse en una reunión comercial y evolucionar posteriormente hacia un producto funcional.

## 2. Objetivos de la primera entrega

La primera entrega corresponde a una **maquetación funcional con datos ficticios**.

Debe permitir:
- Navegar entre los módulos principales.
- Visualizar las mesas y sus estados.
- Abrir una mesa y simular una partida.
- Visualizar el cronómetro y un importe estimado.
- Registrar ventas de productos de demostración.
- Consultar el inventario y sus existencias.
- Visualizar una caja y un cierre de turno simulado.
- Consultar reportes y estadísticas de ejemplo.
- Abrir una vista independiente para la pantalla vertical.

No presentar datos ficticios como información real del negocio.

## 3. Reglas para trabajar en el repositorio

Antes de modificar archivos:

1. Inspeccionar la estructura existente del proyecto.
2. Identificar el framework, las dependencias, el sistema de rutas y los componentes reutilizables.
3. Revisar los estilos y convenciones existentes.
4. Identificar qué funcionalidades ya existen y cuáles faltan.
5. Proponer un plan breve de implementación.
6. Reutilizar la arquitectura existente siempre que sea razonable.

No reemplazar ni eliminar configuraciones, módulos o archivos existentes sin una justificación técnica.

Si el repositorio está vacío, proponer una arquitectura apropiada antes de iniciar.

## 4. Identidad visual y experiencia de usuario

Diseñar una interfaz premium, moderna y profesional, inspirada en los espacios de billar contemporáneos.

### Dirección visual

- Fondo general: gris carbón o antracita.
- Superficies: tonos oscuros diferenciados para tarjetas y paneles.
- Color principal: verde asociado al paño de las mesas de billar.
- Color secundario: dorado discreto para destacar acciones o información relevante.
- Texto: blanco suave y grises de alto contraste.
- Verde: estados disponibles y confirmaciones.
- Ámbar: advertencias y partidas activas.
- Rojo: errores y acciones destructivas que requieran confirmación.

Evitar saturación visual, exceso de degradados, brillos, sombras exageradas y elementos decorativos innecesarios.

Utilizar una tipografía legible, iconografía consistente, bordes sutiles y espacios equilibrados.

La interfaz debe transmitir control, rapidez y confianza.

### Diseño adaptable

- Escritorio: navegación lateral y contenido amplio.
- Tablet: navegación compacta y tarjetas reorganizadas.
- Móvil: navegación simplificada, acciones accesibles y tablas adaptadas.
- Pantalla vertical: vista independiente optimizada para orientación portrait.

Los botones de operación deben tener un tamaño adecuado para el uso táctil.

## 5. Estructura general de navegación

Crear un panel administrativo con los siguientes módulos:

1. Dashboard.
2. Mesas de billar.
3. Ventas y punto de venta.
4. Inventario.
5. Caja y turnos.
6. Historial de operaciones.
7. Reportes.
8. Configuración.
9. Pantalla pública de mesas.

El menú administrativo debe mostrar iconos, nombres claros, estado de navegación activo y una jerarquía visual consistente.

La pantalla pública debe disponer de una ruta independiente, sin menú administrativo.

## 6. Dashboard

Crear una página de inicio con indicadores resumidos.

### Indicadores principales

- Mesas disponibles.
- Mesas ocupadas.
- Ingresos del día.
- Ventas de productos.
- Partidas activas.
- Productos con stock bajo.

### Secciones

- Distribución de mesas por estado.
- Evolución de ingresos.
- Resumen de ventas recientes.
- Actividad de las mesas.
- Alertas operativas.
- Estado de la caja.

Utilizar gráficos solo cuando aporten información útil.

Los indicadores deben tener etiquetas, valores legibles y, cuando corresponda, comparaciones con periodos anteriores.

## 7. Módulo de mesas

Este módulo es una de las funcionalidades centrales del producto.

### Visualización

Representar cada mesa mediante una tarjeta que incluya:

- Número o nombre.
- Estado actual.
- Hora de inicio.
- Tiempo transcurrido.
- Tarifa aplicada.
- Importe acumulado estimado.
- Acciones disponibles.

### Estados de una mesa

- Disponible.
- Ocupada.
- Pendiente de cobro.
- Fuera de servicio.

### Acciones

- Iniciar partida.
- Consultar detalle.
- Añadir consumos.
- Cambiar de tarifa cuando esté permitido.
- Finalizar partida.
- Calcular importe.
- Confirmar cobro.
- Consultar historial.

Antes de iniciar una partida, permitir seleccionar la tarifa correspondiente.

Antes de cerrar una partida, mostrar un resumen de tiempo, tarifa, importe y consumos asociados.

Solicitar confirmación para acciones que puedan generar errores operativos.

### Reglas de negocio

- Una mesa no puede tener dos partidas activas simultáneamente.
- El cronómetro debe representar el tiempo real transcurrido, no depender exclusivamente de un contador que se reinicia al recargar la página.
- El importe debe calcularse según la tarifa configurada y las reglas de redondeo del negocio.
- Los consumos deben distinguirse del importe correspondiente al uso de la mesa.
- Los cambios de estado deben reflejarse en las vistas que correspondan.
- La interfaz debe contemplar errores y estados de carga.

Las reglas definitivas de fraccionamiento, pausas, tolerancias y redondeo quedan pendientes de validación con el propietario.

## 8. Módulo de ventas

Crear un punto de venta visual y ágil.

### Interfaz

- Catálogo de productos.
- Búsqueda por nombre.
- Filtros por categoría.
- Imagen o icono del producto.
- Precio unitario.
- Stock disponible.
- Carrito de venta.
- Cantidades y subtotales.
- Total a pagar.
- Método de pago.

### Funcionalidades de demostración

- Añadir productos al carrito.
- Aumentar o disminuir cantidades.
- Eliminar productos.
- Calcular subtotales y total.
- Seleccionar efectivo, Yape, Plin, tarjeta u otro método habilitado.
- Simular la confirmación de una venta.
- Mostrar un comprobante visual de demostración.

Permitir asociar una venta o consumo a una mesa cuando corresponda.

El sistema debe distinguir entre una venta independiente y un consumo asociado a una partida.

No integrar una pasarela de pagos real durante esta fase.

## 9. Módulo de inventario

Crear una pantalla de administración de productos.

### Datos de cada producto

- Nombre.
- SKU o código interno.
- Categoría.
- Precio de venta.
- Costo de adquisición.
- Stock actual.
- Stock mínimo.
- Unidad de medida.
- Estado del producto.

### Acciones

- Crear producto.
- Editar producto.
- Buscar y filtrar.
- Registrar entrada de mercadería.
- Registrar salida o ajuste.
- Consultar movimientos.
- Identificar productos con stock bajo.
- Desactivar productos sin historial.

### Reglas

- Cada movimiento debe mostrar el producto, cantidad, fecha y motivo.
- Una venta confirmada debe reflejarse en el stock.
- Evitar existencias negativas, salvo que exista una política explícita que lo permita.
- No eliminar físicamente productos que formen parte del historial de ventas.
- Diferenciar el costo de adquisición del precio de venta.

En el prototipo, utilizar productos ficticios, por ejemplo, gaseosas, agua, snacks y otros productos que el negocio confirme que comercializa.

## 10. Módulo de caja y turnos

Crear una interfaz para administrar la caja.

### Funcionalidades

- Apertura de turno.
- Registro de fondo inicial.
- Resumen de ingresos por método de pago.
- Registro de egresos autorizados.
- Consulta de movimientos.
- Cierre de turno.
- Registro del efectivo contado.
- Cálculo de diferencias.
- Historial de cierres.

### Reglas

- Diferenciar ventas de mesas, ventas de productos y otros ingresos.
- Evitar contabilizar dos veces un mismo pago.
- Distinguir entre el importe esperado y el importe contado.
- No considerar una venta pendiente como un ingreso cobrado.
- Registrar anulaciones y devoluciones como operaciones identificables.
- No permitir modificar silenciosamente un turno cerrado.

Los permisos para abrir, cerrar, anular o ajustar operaciones deberán definirse por rol.

El registro de pagos será interno durante el prototipo. La integración con el POS físico queda pendiente de investigar.

## 11. Historial de operaciones

Crear una vista con filtros por:

- Fecha.
- Tipo de operación.
- Mesa.
- Producto.
- Usuario.
- Método de pago.
- Estado.

Mostrar identificador, fecha, descripción, importe y estado de cada operación.

Incluir un detalle para consultar los elementos que componen una venta o un cobro de mesa.

Los registros relevantes deben conservar trazabilidad y no desaparecer al cerrar una operación.

## 12. Reportes

Crear un apartado con filtros por periodo.

### Reportes iniciales

- Ingresos diarios.
- Ventas por producto.
- Ventas por categoría.
- Uso de las mesas.
- Duración de las partidas.
- Ingresos por mesas.
- Ingresos por productos.
- Métodos de pago.
- Movimientos y diferencias de caja.
- Productos con mayor rotación.

Los indicadores deben diferenciar ingresos brutos, descuentos, devoluciones y otras cantidades cuando esos datos estén disponibles.

No presentar ingresos como ganancias netas si no se han contabilizado costos y gastos suficientes.

Los gráficos y tablas deben adaptarse al ancho de pantalla.

## 13. Configuración

Crear una sección para administrar las preferencias del negocio.

### Configuraciones previstas

- Nombre y datos del establecimiento.
- Moneda: soles peruanos (PEN).
- Cantidad y nombres de las mesas.
- Tarifas por tiempo.
- Reglas de fraccionamiento y redondeo.
- Categorías de productos.
- Métodos de pago habilitados.
- Usuarios y roles.
- Preferencias de la pantalla pública.

Las configuraciones deben representarse visualmente en la primera fase, aunque su persistencia definitiva se implementará después.

## 14. Pantalla pública vertical

Crear una ruta independiente, por ejemplo, `/pantalla-mesas`.

Debe estar optimizada para pantallas en orientación vertical.

### Contenido

- Nombre o logotipo del establecimiento.
- Indicador general de disponibilidad.
- Tarjetas de las mesas.
- Estados de disponibilidad.
- Tiempo de partida, si el propietario decide mostrarlo.
- Promociones opcionales.
- Hora de actualización o estado de conexión.

### Diseño

- Alto contraste.
- Tipografía grande.
- Tarjetas claramente diferenciadas.
- Información legible a distancia.
- Sin controles administrativos.
- Sin importes acumulados, datos de caja ni información sensible.

La cantidad de columnas debe adaptarse a la resolución y orientación de la pantalla.

Debe contemplar pantallas con diferentes resoluciones y evitar desplazamientos innecesarios.

En el prototipo, la sincronización puede simularse con datos locales. En producción, deberá obtenerse del mismo origen de datos que utiliza el panel administrativo.

## 15. Componentes reutilizables

Crear componentes consistentes para:

- Tarjetas de indicadores.
- Tarjetas de mesas.
- Etiquetas de estado.
- Botones de acción.
- Formularios.
- Campos de búsqueda.
- Filtros.
- Tablas.
- Modales de confirmación.
- Notificaciones.
- Estados vacíos.
- Indicadores de carga.
- Mensajes de error.
- Selectores de fecha.
- Gráficos.

Evitar duplicar código para componentes con el mismo comportamiento.

## 16. Datos de demostración

Crear datos ficticios coherentes entre módulos.

Ejemplos:

- Seis mesas para la vista inicial.
- Mesas libres y ocupadas.
- Tarifas de ejemplo claramente identificadas.
- Productos de bebidas y snacks.
- Ventas de demostración.
- Movimientos de caja ficticios.
- Reportes correspondientes a los datos de muestra.

Los datos relacionados deben ser consistentes entre sí.

Debe ser posible demostrar un flujo completo de manera simulada: iniciar una partida, añadir un consumo, finalizar la partida y visualizar el resumen del cobro.

No inventar tarifas reales del establecimiento.

## 17. Accesibilidad y calidad visual

- Mantener un contraste suficiente.
- No comunicar estados únicamente mediante colores.
- Utilizar etiquetas comprensibles.
- Permitir navegación por teclado donde corresponda.
- Mostrar validaciones junto a los campos.
- Evitar botones sin acciones.
- No utilizar enlaces rotos.
- Evitar contenido cortado o desbordamientos.
- Mantener consistencia entre módulos.

## 18. Alcance excluido de la primera fase

No implementar todavía:

- Procesamiento de tarjetas bancarias.
- Integraciones no verificadas con POS.
- Facturación electrónica real.
- Integraciones con SUNAT.
- Gestión de múltiples establecimientos.
- Aplicaciones móviles nativas.
- Contabilidad avanzada.
- Sincronización de producción.
- Infraestructura definitiva de despliegue.

Estas funcionalidades podrán evaluarse después de validar las necesidades reales del negocio.

## 19. Criterios de aceptación

La primera entrega se considerará satisfactoria cuando:

1. La aplicación pueda ejecutarse siguiendo las instrucciones del repositorio.
2. La navegación entre módulos funcione.
3. Todas las pantallas principales estén maquetadas.
4. Los componentes mantengan una identidad visual consistente.
5. La vista de mesas permita simular cambios de estado.
6. El cronómetro visual pueda representar una partida de demostración.
7. El punto de venta permita gestionar un carrito ficticio.
8. El inventario muestre productos y alertas de stock.
9. Caja y reportes tengan información coherente de demostración.
10. La pantalla vertical tenga una ruta independiente y sea legible.
11. La interfaz funcione en escritorio, tablet y móvil.
12. No existan errores evidentes de navegación, desbordamiento o interacción.
13. El proyecto conserve sus configuraciones y funcionalidades preexistentes.

## 20. Instrucciones finales de implementación

Primero completar la maquetación y la navegación.

Antes de iniciar la lógica de producción, documentar las decisiones pendientes y validar las reglas de negocio.

Al finalizar:

- Ejecutar la aplicación y las comprobaciones disponibles.
- Revisar las pantallas principales.
- Corregir errores visuales y funcionales.
- Documentar los archivos creados o modificados.
- Indicar cómo ejecutar el proyecto.
- Informar las funcionalidades que son simulaciones.
- Presentar una lista de pendientes para la siguiente fase.

La prioridad es entregar un prototipo visual coherente, navegable y comercialmente presentable, sin comprometer la arquitectura existente ni fingir que las funcionalidades simuladas ya operan en producción.