# PharmaPro

**Pharmacy operations, organized in one responsive workspace.**

PharmaPro is a portfolio MVP for managing everyday pharmacy workflows: point-of-sale checkout, inventory, expiration monitoring, staff access, and stock transfers between branches.

It is designed to demonstrate how a pharmacy team could move from a product search to a recorded sale while keeping inventory and operational activity visible in the same system.

> **Portfolio project:** Use sample data only. This repository is not a certified pharmacy or regulatory-compliance system.

## Product highlights

- **Point of sale:** Search products, build a cart, complete checkout, and print 58 mm / 80 mm receipts.
- **Inventory management:** Track stock, review products with low quantities, upload product images, and export inventory to CSV.
- **Expiration monitoring:** Highlight medicines nearing expiration or already expired.
- **Cash register controls:** Manage register opening, closing, cash counts, and permission-based voids.
- **Branch transfers:** Request and ship stock between locations; add stock after the receiving branch confirms delivery.
- **Staff access and audit history:** Separate roles and record key actions such as logins, voided sales, and stock changes.
- **Responsive interface:** Use the application on desktop, tablet, or a mobile browser.
- **Bilingual display:** Switch between English and Spanish, with light and dark themes.

## Screenshots

| Dashboard | Point of sale | Receipt | Staff roles | Inventory |
| :---: | :---: | :---: | :---: | :---: |
| <img width="180" alt="Dashboard KPIs" src="https://github.com/user-attachments/assets/39577502-c7d4-4830-b3db-c09426cf0a85" /> | <img width="180" alt="POS cart" src="https://github.com/user-attachments/assets/4be62538-e378-432c-96e9-f2efe61fc371" /> | <img width="180" alt="Thermal receipt" src="https://github.com/user-attachments/assets/e7239d5e-dfef-4efc-a333-ebf99b6ce25a" /> | <img width="180" alt="Staff roles" src="https://github.com/user-attachments/assets/6b3a95d8-4fb1-4ea1-850a-c24f27b3317a" /> | <img width="180" alt="Inventory" src="https://github.com/user-attachments/assets/9297955e-9e26-47b4-b877-e088c8f7dc6b" /> |

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

1. Install and start MySQL or MariaDB with XAMPP, Laragon, or another local server.
2. Create a database named `pharmapro_db`.
3. Import the SQL schema or seed file included in the repository.
4. Configure the backend database connection for your local environment.

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

Open a second terminal from the repository root:

```bash
npm install
npm run dev
```

Open the local URL printed by the frontend development server. Confirm its API configuration points to the backend you started.

## Demo data and security

Seeded accounts and sample records are for local demonstration only. Check the database seed for current account details and change any sample passwords before deployment. Do not use real patient information or expose the database publicly without a separate security and privacy review.

## Project status

This is a portfolio MVP. Review the source and configure the database, authentication, and deployment environment for your own use case before extending it.

## License

No license file is currently included. Please contact the author before reusing or distributing the project.