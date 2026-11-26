# PharmaPro — Pharmacy Management System

PharmaPro is a portfolio **MVP** for pharmacy operations. It combines a point of sale, inventory management, expiration and low-stock alerts, staff roles, and branch-to-branch stock transfers.

> **Demo project:** Use sample data only. Configure the database, credentials, and deployment environment for your own setup before exposing the application to users.

## Screenshots

| Dashboard | Point of sale | Receipt | Staff roles | Inventory |
| :---: | :---: | :---: | :---: | :---: |
| <img width="180" alt="Dashboard KPIs" src="https://github.com/user-attachments/assets/39577502-c7d4-4830-b3db-c09426cf0a85" /> | <img width="180" alt="POS cart" src="https://github.com/user-attachments/assets/4be62538-e378-432c-96e9-f2efe61fc371" /> | <img width="180" alt="Thermal receipt" src="https://github.com/user-attachments/assets/e7239d5e-dfef-4efc-a333-ebf99b6ce25a" /> | <img width="180" alt="Staff roles" src="https://github.com/user-attachments/assets/6b3a95d8-4fb1-4ea1-850a-c24f27b3317a" /> | <img width="180" alt="Inventory" src="https://github.com/user-attachments/assets/9297955e-9e26-47b4-b877-e088c8f7dc6b" /> |

## Features

- **Point of sale:** Product search, cart, checkout, and printable 58 mm / 80 mm receipts.
- **Inventory:** Product images, stock tracking, CSV export, pagination, and low-stock filtering.
- **Expiration alerts:** Highlights medicines that are nearing or past their expiration date.
- **Cash register controls:** Cash opening/closing and cash counts, with role-based permissions.
- **Audit history:** Records key actions such as logins, voided sales, and inventory changes.
- **Branch transfers:** Request and ship stock between locations; inventory is added after receipt is confirmed.
- **Bilingual interface:** English and Spanish, plus light and dark themes.
- **Dashboard:** Sales charts and operational KPIs.

## Technology

- React, TypeScript, Tailwind CSS, and Recharts
- Node.js and Express
- MySQL
- Progressive Web App (PWA) interface

## Run locally

### 1. Configure the database

1. Install and start a local MySQL or MariaDB server, such as XAMPP or Laragon.
2. Create a database named `pharmapro_db`.
3. Import the SQL schema or seed file included in the repository.
4. Configure the backend database connection using your local settings. Do not commit real credentials.

If you are upgrading an existing database, check the schema and migrations before applying changes. The older setup may require an `image_url` column in the inventory table.

### 2. Start the backend

```bash
cd backend
npm install
```

Create a local `.env` file with the database settings expected by the backend, then start the API:

```bash
node server.js
```

### 3. Start the frontend

From the repository root, open a second terminal:

```bash
npm install
npm run dev
```

Open the local URL printed by the frontend development server. Confirm that its API configuration points to the backend you started.

## Demo accounts

The project has seeded demo accounts in its database. Their credentials are for local demonstration only. Check the seed data for the current account names, change the passwords before deployment, and never reuse these credentials for a real system.

## Security and scope

This is a portfolio project and has not been presented as a certified pharmacy or regulatory-compliance system. Do not use it to manage real patient data, prescriptions, payments, or medication inventory without a separate security, privacy, and operational review.

## License

No license file is currently included. Contact the author before reusing or distributing this project.