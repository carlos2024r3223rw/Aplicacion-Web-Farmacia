# PharmaPro - Pharmacy Management System (POS)

**Status:** Production / MVP Ready

PharmaPro is a comprehensive software solution designed to modernize pharmacy operations. It combines a fast **Point of Sale (POS)**, inventory control with smart alerts, and logistics management between branches, all within a modern and secure interface.

---

## Key Features

### Security and Control
* **User Roles:** Differentiated access for Administrators, Pharmacists, and Cashiers.
* **Locked-Down Cash Register:** Prevents petty theft. The system controls openings, closings, and cash counts without allowing unauthorized manual withdrawals.
* **Full Audit Trail:** Immutable record of who did what (logins, voided sales, stock edits).

### Smart Inventory
* **Visual Management:** Support for product images via URL with **High-Resolution Zoom**.
* **Expiration Traffic Light:** Automatic alerts for medications nearing expiration (90 days) or already expired.
* **Low Stock:** Quick filter for restocking critical inventory.
* **Optimized Pagination:** Efficient loading of thousands of products without slowing down the system.

### Point of Sale (POS)
* **Fast Checkout:** Interface optimized for barcode scanners.
* **Thermal Receipt:** Format ready to print on 58mm/80mm printers.
* **Secure Voiding:** Automatic reversal of stock and money when a sale is voided (Admin only).

### Multi-Branch Logistics
* **Transfers:** Request and shipment of merchandise between the Main Office and Branches.
* **Receipt Validation:** Stock is only added once the branch confirms physical receipt.

### User Experience (UX)
* **Dark / Light Mode:** Adaptable to night or day shifts.
* **Dashboard:** Weekly sales charts and real-time KPIs (total sales, alerts).

---

## Tech Stack

This system was built prioritizing speed, stability, and scalability:

* **Frontend:** React.js + Tailwind CSS (modular and responsive design).
* **Backend:** Node.js + Express (modern REST API architecture with Async/Await).
* **Database:** MySQL (relational, with transaction support for financial integrity).
* **Charts:** Recharts.

---

## Installation and Deployment

Follow these steps to install the system in a local environment:

### 1. Database
* Have **XAMPP** or **MySQL Workbench** installed.
* Create a database named `pharmapro_db`.
* Import the initial SQL script (tables: `users`, `inventory`, `orders`, `cash_cuts`, `audit_logs`).
* *Note:* Make sure to run `ALTER TABLE inventory ADD COLUMN image_url TEXT;` if upgrading from a previous version.

### 2. Server Setup (Backend)
```bash
cd backend
npm install
# Create a .env file with DB credentials if necessary
node server.js
```
