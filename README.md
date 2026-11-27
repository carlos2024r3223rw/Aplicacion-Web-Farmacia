# PharmaPro

**Pharmacy operations, organized in one responsive workspace.**

PharmaPro is a portfolio MVP for managing everyday pharmacy workflows: point-of-sale checkout, inventory, expiration monitoring, staff access, and stock transfers between branches.

It demonstrates how a pharmacy team could move from product search to a recorded sale while keeping inventory and operational activity visible in one system.

> **Portfolio project:** Use sample data only. This is not a certified pharmacy or regulatory-compliance system.

## Product highlights

- **Point of sale:** Search products, build a cart, complete checkout, and print 58 mm / 80 mm receipts.
- **Inventory management:** Track stock, find low-quantity products, upload images, and export inventory to CSV.
- **Expiration monitoring:** Highlight medicines nearing expiration or already expired.
- **Cash register controls:** Manage opening, closing, cash counts, and permission-based voids.
- **Branch transfers:** Request and ship stock between locations; add stock after the receiving branch confirms delivery.
- **Staff access and audit history:** Separate roles and record key actions such as logins, voided sales, and inventory changes.
- **Responsive, bilingual interface:** Use the application on desktop, tablet, or mobile; switch between English and Spanish and light and dark themes.

## Screenshots

| Dashboard | Point of sale |
| :---: | :---: |
| <img width="1875" height="951" alt="Captura de pantalla 2026-11-24 164543" src="https://github.com/user-attachments/assets/c9998f26-f62c-4aad-9cce-158a464f44ef" />
 | <img width="340" alt="POS cart" src="https://github.com/user-attachments/assets/4be62538-e378-432c-96e9-f2efe61fc371" /> |

| Receipt | Staff roles |
| :---: | :---: |
| <img width="340" alt="Thermal receipt" src="https://github.com/user-attachments/assets/e7239d5e-dfef-4efc-a333-ebf99b6ce25a" /> | <img width="340" alt="Staff roles" src="https://github.com/user-attachments/assets/6b3a95d8-4fb1-4ea1-850a-c24f27b3317a" /> |

| Inventory |
| :---: |
| <img width="340" alt="Inventory" src="https://github.com/user-attachments/assets/9297955e-9e26-47b4-b877-e088c8f7dc6b" /> |

## Built with

| Area | Technology |
| --- | --- |
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MySQL |
| Charts | Recharts |
| Delivery | Progressive Web App (PWA) |

## Run locally

### 1. Prepare the database

1. Start MySQL or MariaDB with XAMPP, Laragon, or another local server.
2. Import `base de datos utilizada.sql` using phpMyAdmin or a database client. The SQL file creates and selects the `pharmapro_db` database.
3. Configure the backend database connection for your local environment.

### 2. Start the backend

```bash
cd backend
npm install
```

Create a local `.env` file with the database settings expected by the backend, then run:

```bash
node server.js
```

### 3. Start the frontend

From the repository root, open a second terminal:

```bash
npm install
npm run dev
```

Open the local URL printed by the frontend development server. Confirm its API configuration points to the backend you started.

## Demo data and security

Seeded accounts and records are for local demonstration only. Change sample passwords before deployment. Do not use real patient information or expose the database publicly without a separate security and privacy review.

## Project status

This is a portfolio MVP. Review the source and configure the database, authentication, and deployment environment for your own use case before extending it.

## License

No license file is currently included. Please contact the author before reusing or distributing the project.
