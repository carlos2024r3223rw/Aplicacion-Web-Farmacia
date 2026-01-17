#  PharmaPro - Sistema de Gestión Farmacéutica (POS)

**Estado:** Producción / MVP Listo

PharmaPro es una solución integral de software diseñada para modernizar la gestión operativa de farmacias. Combina un **Punto de Venta (POS)** ágil, control de inventario con alertas inteligentes y gestión de logística entre sucursales, todo bajo una interfaz moderna y segura.

---

##  Características Principales

###  Seguridad y Control
* **Roles de Usuario:** Acceso diferenciado para Administradores, Farmacéuticos y Cajeros.
* **Caja Blindada:** Prevención de "robo hormiga". El sistema controla aperturas, cierres y arqueos sin permitir retiros manuales no autorizados.
* **Auditoría Completa:** Registro inmutable de quién hizo qué (Login, Ventas Anuladas, Ediciones de Stock).

###  Inventario Inteligente
* **Gestión Visual:** Soporte para imágenes de productos mediante URL con **Zoom en Alta Resolución**.
* **Semáforo de Vencimiento:** Alertas automáticas para medicamentos próximos a caducar (90 días) o vencidos.
* **Stock Bajo:** Filtro rápido para reposición de inventario crítico.
* **Paginación Optimizada:** Carga eficiente de miles de productos sin trabar el sistema.

###  Punto de Venta (POS)
* **Venta Rápida:** Interfaz optimizada para lectores de código de barras.
* **Ticket Térmico:** Formato listo para imprimir en impresoras de 58mm/80mm.
* **Anulación Segura:** Reversión automática de stock y dinero al anular una venta (solo Admin).

###  Logística Multicursal
* **Transferencias:** Solicitud y envío de mercancía entre la Sede Central y Sucursales.
* **Validación de Recepción:** El stock solo se suma cuando la sucursal confirma la recepción física.

###  Experiencia de Usuario (UX)
* **Modo Oscuro / Claro:** Adaptable a turnos nocturnos o diurnos.
* **Dashboard:** Gráficas de ventas semanales y KPIs en tiempo real (Total vendido, alertas).

---

##  Tecnologías (Tech Stack)

Este sistema fue construido priorizando velocidad, estabilidad y escalabilidad:

* **Frontend:** React.js + Tailwind CSS (Diseño Modular y Responsive).
* **Backend:** Node.js + Express (Arquitectura REST API Moderna con Async/Await).
* **Base de Datos:** MySQL (Relacional, con soporte de transacciones para integridad financiera).
* **Gráficos:** Recharts.

---

##  Instalación y Despliegue

Sigue estos pasos para instalar el sistema en un entorno local:

### 1. Base de Datos
* Tener instalado **XAMPP** o **MySQL Workbench**.
* Crear una base de datos llamada `pharmapro_db`.
* Importar el script SQL inicial (tablas de `users`, `inventory`, `orders`, `cash_cuts`, `audit_logs`).
* *Nota:* Asegurarse de ejecutar `ALTER TABLE inventory ADD COLUMN image_url TEXT;` si se actualiza desde una versión anterior.

### 2. Configuración del Servidor (Backend)
```bash
cd backend
npm install
# Crear archivo .env con credenciales de BD si es necesario
node server.js
