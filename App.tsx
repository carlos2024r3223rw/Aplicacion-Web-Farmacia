import React, { useState, useMemo, useEffect, useRef } from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, CartesianGrid, YAxis, LabelList } from 'recharts';
import { LoginScreen } from './components/LoginScreen';
import { DashboardView } from './components/dashboard/DashboardView';
import { POSView } from './components/pos/POSView';
import { InventoryView } from './components/inventory/InventoryView';
import { CustomersView } from './components/customers/CustomersView';
import { SuppliersView } from './components/suppliers/SuppliersView';
import { OrdersView } from './components/orders/OrdersView';
import { SettingsView } from './components/settings/SettingsView';

const Icons = {
  Edit: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Trash: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Dashboard: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  Inventory: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  Orders: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  Settings: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Download: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Check: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Eye: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  Sun: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Moon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
  Search: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Filter: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  Warning: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Cart: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Plus: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Minus: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>,
  Print: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" /></svg>,
  Users: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Phone: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Map: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Bolt: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Truck: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  Cash: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Ban: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>,
  Back: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
  Office: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> 
};

const StatCard = ({ label, value, variant = 'blue', onClick, theme }: any) => {
  const colors: any = {
    blue: theme === 'dark' ? 'bg-blue-600/10 text-blue-500 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-200',
    green: theme === 'dark' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200',
    orange: theme === 'dark' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-orange-50 text-orange-600 border-orange-200',
    red: theme === 'dark' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-rose-50 text-rose-600 border-rose-200',
    yellow: theme === 'dark' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-yellow-50 text-yellow-600 border-yellow-200',
  };
  return (
    <div onClick={onClick} className={`p-4 rounded-2xl border flex flex-col ${onClick ? 'cursor-pointer active:scale-95 transition-transform hover:opacity-80' : ''} ${colors[variant]}`}>
      <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</span>
      <span className="text-2xl font-black tracking-tight">{value}</span>
    </div>
  );
};

const EmptyState = ({ title, text }: { title: string; text: string }) => (
  <div className="rounded-2xl border border-dashed border-neutral-700/60 px-6 py-12 text-center opacity-80">
    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-xl text-blue-500">+</div>
    <p className="font-bold text-sm">{title}</p>
    <p className="mx-auto mt-1 max-w-sm text-xs opacity-50">{text}</p>
  </div>
);

const BottomNav = ({ activeTab, onTabChange, labels, theme, role }: any) => {
  if (!role) return null;
  const r = role.toLowerCase();
  let tabs: any[] = [];
  if (r === 'cashier' || r === 'cajero' || r === 'staff') {
    tabs = [{ id: 'POS', icon: Icons.Cart, label: labels.POS }, { id: 'Clients', icon: Icons.Users, label: labels.clients }, { id: 'Settings', icon: Icons.Settings, label: labels.settings }];
  } else if (r === 'pharmacist' || r === 'farmaceutico' || r === 'farmacéutico') {
    tabs = [
      { id: 'POS', icon: Icons.Cart, label: labels.POS },
      { id: 'Inventory', icon: Icons.Inventory, label: labels.inventory },
      { id: 'Orders', icon: Icons.Orders, label: labels.orders },
      { id: 'Clients', icon: Icons.Users, label: labels.clients },
      { id: 'Settings', icon: Icons.Settings, label: labels.settings },
    ];
  } else {
    tabs = [
      { id: 'Dashboard', icon: Icons.Dashboard, label: labels.dashboard },
      { id: 'POS', icon: Icons.Cart, label: labels.POS },
      { id: 'Inventory', icon: Icons.Inventory, label: labels.inventory },
      { id: 'Clients', icon: Icons.Users, label: labels.clients },
      { id: 'Suppliers', icon: Icons.Truck, label: labels.suppliers },
      { id: 'Orders', icon: Icons.Orders, label: labels.orders },
      { id: 'Settings', icon: Icons.Settings, label: labels.settings },
    ];
  }
  return (
    <div className={`fixed bottom-0 left-0 right-0 w-full ${theme === 'dark' ? 'bg-black/95 border-neutral-800' : 'bg-white/95 border-gray-200'} backdrop-blur-xl border-t px-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2 flex justify-start overflow-x-auto z-50 lg:hidden no-scrollbar`}>
      {tabs.map((tab) => (<button key={tab.id} onClick={() => onTabChange(tab.id)} className={`flex-none w-[72px] flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${activeTab === tab.id ? 'text-blue-500' : (theme === 'dark' ? 'text-neutral-500 hover:text-neutral-300' : 'text-gray-400 hover:text-gray-600')}`}><tab.icon className="w-5 h-5" /><span className="text-[8px] font-bold uppercase tracking-wide whitespace-nowrap">{tab.label}</span>{activeTab === tab.id && <div className="w-1 h-1 bg-blue-500 rounded-full mt-0.5 animate-pulse" />}</button>))}
    </div>
  );
};

const SideNav = ({ activeTab, onTabChange, labels, theme, role, user }: any) => {
  if (!role) return null;
  const r = role.toLowerCase();
  const tabs: any[] = r === 'cashier' || r === 'cajero' || r === 'staff'
    ? [{ id: 'POS', icon: Icons.Cart, label: labels.POS }, { id: 'Clients', icon: Icons.Users, label: labels.clients }, { id: 'Settings', icon: Icons.Settings, label: labels.settings }]
    : r === 'pharmacist' || r === 'farmaceutico' || r === 'farmacéutico'
      ? [{ id: 'POS', icon: Icons.Cart, label: labels.POS }, { id: 'Inventory', icon: Icons.Inventory, label: labels.inventory }, { id: 'Orders', icon: Icons.Orders, label: labels.orders }, { id: 'Clients', icon: Icons.Users, label: labels.clients }, { id: 'Settings', icon: Icons.Settings, label: labels.settings }]
      : [{ id: 'Dashboard', icon: Icons.Dashboard, label: labels.dashboard }, { id: 'POS', icon: Icons.Cart, label: labels.POS }, { id: 'Inventory', icon: Icons.Inventory, label: labels.inventory }, { id: 'Clients', icon: Icons.Users, label: labels.clients }, { id: 'Suppliers', icon: Icons.Truck, label: labels.suppliers }, { id: 'Orders', icon: Icons.Orders, label: labels.orders }, { id: 'Settings', icon: Icons.Settings, label: labels.settings }];
  return <aside className={`hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 flex-col border-r p-6 ${theme === 'dark' ? 'border-neutral-900 bg-[#090909]' : 'border-gray-200 bg-white'}`}>
    <div className="flex items-center gap-3 mb-10"><div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><span className="text-xl font-bold italic text-white">P+</span></div><div><p className="text-lg font-bold leading-none">PharmaPro</p><p className="text-[9px] uppercase tracking-[0.2em] opacity-40 mt-1">Gestión farmacéutica</p></div></div>
    <nav className="space-y-2">{tabs.map((tab) => <button key={tab.id} onClick={() => onTabChange(tab.id)} className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : theme === 'dark' ? 'text-neutral-500 hover:bg-neutral-900 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}><tab.icon className="w-5 h-5" />{tab.label}</button>)}</nav>
    <div className={`mt-auto rounded-2xl border p-4 ${theme === 'dark' ? 'border-neutral-800 bg-neutral-900/60' : 'border-gray-200 bg-gray-50'}`}><p className="font-bold text-sm truncate">{user?.name}</p><p className="text-[10px] uppercase tracking-wider opacity-50 mt-1">{user?.role}</p></div>
  </aside>;
};


const categoryTranslations: any = { "Antibiotic": { EN: "Antibiotic", ES: "Antibiótico" }, "Analgesic": { EN: "Analgesic", ES: "Analgésico" }, "Cardiac": { EN: "Cardiac", ES: "Cardíaco" }, "Diabetes": { EN: "Diabetes", ES: "Diabetes" }, "Statins": { EN: "Statins", ES: "Estatinas" }, "Misc": { EN: "Misc", ES: "Varios" } };
const translations: any = { 
    EN: { dashboard: "Dashboard", inventory: "Inventory", orders: "Orders", settings: "Settings", clients: "Clients", POS: "POS", suppliers: "Suppliers", noClients: "No registered clients", close: "Close", scannerMode: "Scanner", language: "Language & Theme", darkMode: "Dark Mode", lightMode: "Light Mode", security: "Security", logout: "Sign Out", logoutConfirm: "Are you sure you want to log out?", staffMgmt: "Staff Management", branches: "Manage Branches", admin: "Administration", changePass: "Change Password", exportCsv: "Export Inventory (CSV)", confirmTitle: "Confirm", yes: "Yes", no: "No", openBox: "OPEN SHIFT", closeBox: "CLOSE SHIFT", salesHistory: "Sales History", todaySales: "Today Sales", pendingPresc: "Pending", lowStock: "Low Stock", expiredCount: "Expired", warningCount: "Expiring", addClient: "Add Client", pass: "Password", name: "Name", user: "Username", workspace: "Workspace", weeklySales: "Weekly Sales", last7Days: "Last 7 days", stockRequests: "Stock Requests (Admin)", noPendingRequests: "No pending requests.", noSalesYet: "No sales registered yet", noSalesHint: "Sales will appear here after your first checkout.", send: "Send", requestFrom: "From", requested: "Requested", searchProduct: "Search product...", scanProduct: "SCAN...", emptyCart: "Cart is empty", emptyCartHint: "Search for a product to start the sale.", optionalCustomer: "Customer (optional)", noPhone: "No phone", removeCustomer: "Remove customer", addCustomer: "Add customer", decreaseQty: "Decrease quantity", increaseQty: "Increase quantity", removeProduct: "Remove product", total: "TOTAL", charge: "CHARGE", branchList: "Branches", newBranch: "New Branch", branchName: "Branch Name", address: "Address", phone: "Phone", save: "Save", deleteBranch: "Delete branch?", newStaff: "New Employee", editStaff: "Edit Employee", addStaff: "Add Employee", deleteStaff: "Delete employee?", fullName: "Full Name", pharmacist: "Pharmacist", cashier: "Cashier", staffRole: "Staff", newPassword: "New Password", saveChanges: "Save Changes", created: "Created", updated: "Changes saved", deleted: "Deleted", branchCreated: "Branch created", generalCustomer: "General Customer", centralBranch: "Central Branch", receiptCustomer: "Customer", receiptTicket: "Receipt #", receiptCashier: "Cashier", receiptQty: "Qty", receiptItem: "Item", receiptThanks: "Thank you for your purchase", receiptSystem: "PharmaPro System v10.1", print: "PRINT", receiptTaxId: "Tax ID", receiptRegistration: "Tax/Reg", newClient: "New Customer", editClient: "Edit Customer", customerName: "Customer name", phoneNumber: "Phone number", optionalTaxId: "Tax ID (optional)", cancel: "Cancel", deleteClient: "Delete customer", deleteClientConfirm: "Delete customer?" },
    ES: { dashboard: "Panel", inventory: "Inventario", orders: "Pedidos", settings: "Ajustes", clients: "Clientes", POS: "Caja", suppliers: "Prov.", noClients: "No hay clientes registrados", close: "Cerrar", scannerMode: "Escáner", language: "Idioma y Tema", darkMode: "Modo Oscuro", lightMode: "Modo Claro", security: "Seguridad", logout: "Cerrar Sesión", logoutConfirm: "¿Seguro que quieres cerrar sesión?", staffMgmt: "Gestión de Personal", branches: "Gestionar Sucursales", admin: "Administración", changePass: "Cambiar Contraseña", exportCsv: "Exportar Inventario (CSV)", confirmTitle: "Confirmación", yes: "Sí", no: "No", openBox: "ABRIR CAJA", closeBox: "CERRAR CAJA", salesHistory: "Historial de Ventas", todaySales: "Ventas Hoy", pendingPresc: "Pendientes", lowStock: "Stock Bajo", expiredCount: "Vencidos", warningCount: "Por Vencer", addClient: "Añadir Cliente", pass: "Contraseña", name: "Nombre", user: "Usuario", workspace: "Área de trabajo", weeklySales: "Ventas semanales", last7Days: "Últimos 7 días", stockRequests: "Solicitudes de stock (Admin)", noPendingRequests: "No hay pedidos pendientes.", noSalesYet: "Aún no hay ventas registradas", noSalesHint: "Las ventas aparecerán aquí cuando cobres tu primera orden.", send: "Enviar", requestFrom: "De", requested: "Piden", searchProduct: "Buscar producto...", scanProduct: "ESCANEA...", emptyCart: "Carrito vacío", emptyCartHint: "Busca un producto para iniciar la venta.", optionalCustomer: "Cliente (opcional)", noPhone: "Sin teléfono", removeCustomer: "Quitar cliente", addCustomer: "Añadir cliente", decreaseQty: "Reducir cantidad", increaseQty: "Aumentar cantidad", removeProduct: "Eliminar producto", total: "TOTAL", charge: "COBRAR", branchList: "Sucursales", newBranch: "Nueva Sucursal", branchName: "Nombre Sucursal", address: "Dirección", phone: "Teléfono", save: "Guardar", deleteBranch: "¿Borrar Sucursal?", newStaff: "Nuevo Empleado", editStaff: "Editar Empleado", addStaff: "Añadir Empleado", deleteStaff: "¿Eliminar Empleado?", fullName: "Nombre Completo", pharmacist: "Farmacéutico", cashier: "Cajero", staffRole: "Personal", newPassword: "Nueva Contraseña", saveChanges: "Guardar Cambios", created: "Creado", updated: "Cambios guardados", deleted: "Eliminado", branchCreated: "Sucursal creada", generalCustomer: "Cliente General", centralBranch: "Sucursal Centro", receiptCustomer: "Cliente", receiptTicket: "Ticket #", receiptCashier: "Cajero", receiptQty: "Cant", receiptItem: "Producto", receiptThanks: "Gracias por su compra", receiptSystem: "Sistema PharmaPro v10.1", print: "IMPRIMIR", receiptTaxId: "RNC", receiptRegistration: "DTE/Reg", newClient: "Nuevo cliente", editClient: "Editar cliente", customerName: "Nombre del cliente", phoneNumber: "Número de teléfono", optionalTaxId: "RNC (opcional)", cancel: "Cancelar", deleteClient: "Eliminar cliente", deleteClientConfirm: "¿Borrar cliente?" }
};

const App = () => {
  const API_URL = (import.meta.env.VITE_API_URL as string) || '';

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [language, setLanguage] = useState('ES');
  const [theme, setTheme] = useState('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [filterExpiry, setFilterExpiry] = useState('All');
  const [inventory, setInventory] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]); 
  const [branches, setBranches] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]); 
  const [chartData, setChartData] = useState<any[]>([]); 
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [posSearch, setPosSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null); 
  const [posCustomerSearch, setPosCustomerSearch] = useState('');
  const [scannerMode, setScannerMode] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [isAddingMed, setIsAddingMed] = useState(false);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [isStaffMgmt, setIsStaffMgmt] = useState(false);
  const [isBranchMgmt, setIsBranchMgmt] = useState(false);
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [activeShift, setActiveShift] = useState<any>(null); 
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [toast, setToast] = useState({ message: '', visible: false });
  const [confirmModal, setConfirmModal] = useState<any>({ isOpen: false, type: null, id: null, message: '' });
  const [cashModal, setCashModal] = useState({ isOpen: false, type: 'open' }); 
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const searchInputRef = useRef<HTMLInputElement>(null);
  const t = (key: string) => translations[language][key] || key;
  const sectionTitle = ({ Dashboard: t('dashboard'), POS: t('POS'), Inventory: t('inventory'), Clients: t('clients'), Suppliers: t('suppliers'), Orders: t('orders'), Settings: t('settings') } as any)[activeTab] || 'PharmaPro';
  const showToast = (message: string) => { setToast({ message, visible: true }); setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000); };

  useEffect(() => { document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' }); }, [activeTab]);

  const resetFilters = () => { setFilterCategory('All'); setFilterLowStock(false); setFilterExpiry('All'); setSearchQuery(''); };
  const goToFilter = (type: string) => { setActiveTab('Inventory'); resetFilters(); if (type === 'expired') setFilterExpiry('expired'); if (type === 'warning') setFilterExpiry('warning'); if (type === 'lowStock') setFilterLowStock(true); };

  const exportToCSV = () => {
    const headers = ["Nombre,Categoria,Stock,Precio,Vencimiento,Imagen"];
    const rows = inventory.map(item => `"${item.name}","${item.category}",${item.stock},${item.price},${item.expiryDate ? item.expiryDate.split('T')[0] : ''},"${item.image_url || ''}"`);
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = `inventario_pharmapro_${new Date().toISOString().split('T')[0]}.csv`; document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const getExpiryStatus = (dateString: string) => {
    if (!dateString) return 'good';
    const today = new Date(); const expiry = new Date(dateString); const diffTime = expiry.getTime() - today.getTime(); const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'expired'; if (diffDays < 90) return 'warning'; return 'good';
  };

  const loadAllData = async () => {
    try {
      const responses = await Promise.all(['/inventory', '/users', '/orders', '/customers', '/suppliers', '/branches', '/branch-requests', '/stats/weekly'].map(endpoint => fetch(`${API_URL}${endpoint}`)));
      if (responses.some(response => !response.ok)) throw new Error('API response error');
      const [inventoryData, usersData, ordersData, customersData, suppliersData, branchesData, requestsData, weeklyData] = await Promise.all(responses.map(response => response.json()));
      setInventory(inventoryData); setStaffList(usersData); setOrders(ordersData); setCustomers(customersData); setSuppliers(suppliersData); setBranches(branchesData); setRequests(requestsData); setChartData(weeklyData); setApiError('');
      if (currentUser) checkActiveShift();
    } catch (error) {
      console.error(error);
      setApiError('No se pudieron cargar los datos. Verifica que el servidor local esté activo.');
    } finally { setIsLoading(false); }
  };

  useEffect(() => {
      if(isLoggedIn) {
          const interval = setInterval(loadAllData, 3000); 
          return () => clearInterval(interval);
      }
  }, [isLoggedIn, currentUser]);

  const checkActiveShift = () => { fetch(`${API_URL}/cash-cut/active/${currentUser.id}`).then(r => r.json()).then(setActiveShift).catch(console.error); }

  useEffect(() => { if(isLoggedIn) loadAllData(); }, [isLoggedIn]);
  useEffect(() => { if(activeTab==='POS' && scannerMode && searchInputRef.current && !cashModal.isOpen && !isAddingCustomer) searchInputRef.current.focus(); }, [activeTab, scannerMode, cart, cashModal, isAddingCustomer]);

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      if (!item) return false;
      const q = searchQuery.toLowerCase();
      const itemName = (item.name || '').toLowerCase();
      const matchesSearch = itemName.includes(q);
      const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
      const matchesStock = filterLowStock ? item.stock <= 10 : true;
      const matchesExpiry = filterExpiry === 'All' || getExpiryStatus(item.expiryDate) === filterExpiry;
      return matchesSearch && matchesCategory && matchesStock && matchesExpiry;
    });
  }, [inventory, searchQuery, filterCategory, filterLowStock, filterExpiry]);

  const paginatedInventory = useMemo(() => {
      const start = (currentPage - 1) * itemsPerPage;
      return filteredInventory.slice(start, start + itemsPerPage);
  }, [filteredInventory, currentPage]);

  const posFilteredCustomers = useMemo(() => {
    if (!posCustomerSearch || selectedCustomer) return [];
    return customers.filter(c => c.name.toLowerCase().includes(posCustomerSearch.toLowerCase()));
  }, [customers, posCustomerSearch, selectedCustomer]);

  const addToCart = (product: any) => {
    if (!activeShift) { showToast("⚠️ Caja Cerrada: Se añadirá igual"); }
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) { showToast("Cantidad +1"); return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item); }
      showToast("Producto Agregado");
      return [...prev, { ...product, qty: 1 }];
    });
  };
  const removeFromCart = (id: any) => { setCart(prev => prev.filter(item => item.id !== id)); showToast("Eliminado del carrito"); };
  const updateCartQty = (id: any, delta: number) => { setCart(prev => prev.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item)); };

  const handleScannerInput = (e: any) => {
    if (e.key === 'Enter' && scannerMode) {
        const match = inventory.find(i => i.name.toLowerCase() === posSearch.toLowerCase() || i.id.toString() === posSearch);
        if (match) { addToCart(match); setPosSearch(''); showToast(`Escaneado: ${match.name}`); }
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!activeShift) { alert("⚠️ ERROR: Debes ABRIR CAJA para registrar la venta."); return; }
    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const orderData = { patient: selectedCustomer ? selectedCustomer.name : (posCustomerSearch || "Cliente General"), customerId: selectedCustomer?.id, items: cart, total, actingUser: { id: currentUser.id, name: currentUser.name } };
    try {
      const res = await fetch(`${API_URL}/sale`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData) });
      const data = await res.json();
      if (data.success) { setLastOrder({ ...orderData, id: Math.floor(Math.random() * 10000), date: new Date().toLocaleDateString() }); setCart([]); setSelectedCustomer(null); setIsTicketOpen(true); loadAllData(); showToast("¡Venta Exitosa!"); }
      else { alert(data.error || "Error en venta"); }
    } catch (err) { alert("Error de conexión"); }
  };

  const requestStock = async (item: any) => {
      const branchName = prompt("¿Para qué sucursal?", "Sede Central");
      if(!branchName) return;
      await genericPost('/branch-requests', { item_name: item.name, qty: 10, requested_by: currentUser.name, branch_name: branchName, actingUser: currentUser }, "Solicitud Enviada");
  };

  const handleVoidOrder = async () => { const { id } = confirmModal; const reason = prompt("Motivo de anulación:"); if(!reason) return; try { const res = await fetch(`${API_URL}/orders/${id}/void`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ reason, actingUser: currentUser }) }); if(res.ok) { showToast("Venta Anulada"); loadAllData(); setConfirmModal({isOpen:false, type:null}); setSelectedOrder(null); } else { alert("Error al anular"); } } catch (err) { alert("Error"); } };
  const handleCashAction = async (e: any) => { e.preventDefault(); const amount = e.target.amount.value; if (cashModal.type === 'open') { await fetch(`${API_URL}/cash-cut/open`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId: currentUser.id, amount }) }); showToast("Caja Abierta"); } else { const res = await fetch(`${API_URL}/cash-cut/close`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ id: activeShift.id, closeAmount: amount, userId: currentUser.id }) }); const data = await res.json(); alert(`Cierre Exitoso:\nVendido: $${data.totalSales}\nDiferencia: $${data.discrepancy}`); } setCashModal({isOpen:false}); loadAllData(); };
  
  const handleLogin = async (e: any) => { e.preventDefault(); const fd = new FormData(e.target); try { const res = await fetch(`${API_URL}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user: fd.get('user'), pass: fd.get('pass') }) }); const data = await res.json(); if (data.success) { setIsLoggedIn(true); setCurrentUser(data.user); const r = (data.user.role || '').toLowerCase(); if (['cashier','cajero','staff','pharmacist','farmaceutico'].includes(r)) { setActiveTab('POS'); } else { setActiveTab('Dashboard'); } showToast(`Bienvenido ${data.user.name}`); } else { alert('Credenciales Incorrectas'); } } catch (err) { alert('ERROR DE CONEXIÓN'); } };
  const genericPost = async (url: string, body: any, msg: string) => { await fetch(`${API_URL}${url}`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ ...body, actingUser: currentUser }) }); loadAllData(); showToast(msg); };
  const genericPut = async (url: string, body: any, msg: string) => { await fetch(`${API_URL}${url}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ ...body, actingUser: currentUser }) }); loadAllData(); showToast(msg); };
  const genericDelete = async (url: string, msg: string) => { await fetch(`${API_URL}${url}`, { method: 'DELETE', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ actingUser: currentUser }) }); loadAllData(); showToast(msg); setConfirmModal({isOpen:false}); };
  
  const updateMedication = (e: any) => { e.preventDefault(); const fd = new FormData(e.target); genericPut(`/inventory/${editingItem.id}`, { name: fd.get('name'), category: fd.get('category'), stock: parseInt(fd.get('stock') as string), price: parseFloat(fd.get('price') as string), expiryDate: fd.get('expiry'), image_url: fd.get('image_url') }, "Actualizado"); setEditingItem(null); };
  const addMedication = (e: any) => { e.preventDefault(); const fd = new FormData(e.target); genericPost('/inventory', { name: fd.get('name'), category: fd.get('category'), stock: parseInt(fd.get('stock') as string), price: parseFloat(fd.get('price') as string), expiryDate: fd.get('expiry'), image_url: fd.get('image_url') }, "Guardado"); setIsAddingMed(false); };
  
  const updateCustomer = (e: any) => { e.preventDefault(); const fd = new FormData(e.target); genericPut(`/customers/${editingCustomer.id}`, { name: fd.get('name'), phone: fd.get('phone'), address: fd.get('address'), rnc: fd.get('rnc') }, "Actualizado"); setEditingCustomer(null); };
  const addCustomer = (e: any) => { e.preventDefault(); const fd = new FormData(e.target); genericPost('/customers', { name: fd.get('name'), phone: fd.get('phone'), address: fd.get('address'), rnc: fd.get('rnc') }, "Creado"); setIsAddingCustomer(false); if(activeTab==='POS') setPosCustomerSearch(fd.get('name') as string); };
  const handleUpdateStaff = (e: any) => { e.preventDefault(); const fd = new FormData(e.target); const userId = editingStaff ? (editingStaff.id || editingStaff.ID) : (currentUser.id || currentUser.ID); genericPut(`/users/${userId}`, { name: fd.get('name') || currentUser.name, role: fd.get('role') || currentUser.role, username: fd.get('username') || currentUser.username, password: fd.get('password') }, t('updated')); setEditingStaff(null); setIsChangingPass(false); };
  const addStaffMember = (e: any) => { e.preventDefault(); const fd = new FormData(e.target); genericPost('/users', { name: fd.get('name'), role: fd.get('role'), username: fd.get('username'), password: fd.get('password') }, t('created')); setIsAddingStaff(false); };
  const addBranch = (e: any) => { e.preventDefault(); const fd = new FormData(e.target); genericPost('/branches', { name: fd.get('name'), address: fd.get('address'), phone: fd.get('phone') }, t('branchCreated')); setIsAddingBranch(false); };

  const executeDelete = () => { const { type, id } = confirmModal; if (type === 'delete_product') genericDelete(`/inventory/${id}`, "Eliminado"); else if (type === 'delete_staff') genericDelete(`/users/${id}`, t('deleted')); else if (type === 'delete_customer') genericDelete(`/customers/${id}`, "Eliminado"); else if (type === 'delete_supplier') genericDelete(`/suppliers/${id}`, "Eliminado"); else if (type === 'delete_branch') genericDelete(`/branches/${id}`, t('deleted')); else if (type === 'void_order') handleVoidOrder(); else if (type === 'logout') { setIsLoggedIn(false); setCurrentUser(null); setCart([]); setActiveTab('Dashboard'); setConfirmModal({ isOpen: false }); showToast("Sesión Cerrada"); } };

  const bgMain = theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-gray-900';
  const bgCard = theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200 shadow-sm';
  const inputClass = theme === 'dark' ? 'bg-black border-neutral-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900';

  if (!isLoggedIn) return <LoginScreen onSubmit={handleLogin} />;

  return (
    <div className={`min-h-screen flex flex-col font-sans relative ${bgMain}`}>
      <style>{`@media print { body * { visibility: hidden; } #print-area, #print-area * { visibility: visible; } #print-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; background-color: white; color: black; } .no-print { display: none !important; } @page { size: auto; margin: 0mm; } }`}</style>
      {toast.visible && <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] bg-black text-white px-6 py-3 rounded-full font-bold shadow-2xl border border-neutral-800 animate-bounce">{toast.message}</div>}
      <SideNav activeTab={activeTab} onTabChange={setActiveTab} labels={translations[language]} theme={theme} role={currentUser?.role} user={currentUser} />
      <header className={`flex-shrink-0 px-6 py-4 border-b flex items-center justify-between backdrop-blur-md z-40 lg:pl-72 ${theme === 'dark' ? 'border-neutral-900 bg-black/50' : 'border-gray-200 bg-white/50'}`}><div className="flex items-center gap-3 lg:hidden"><div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><span className="text-xl font-bold italic text-white">P+</span></div><h1 className="text-lg font-bold">PharmaPro</h1></div><div className="hidden lg:block"><p className="text-xs uppercase tracking-[0.2em] opacity-40">{t('workspace')}</p><h1 className="text-2xl font-black mt-1">{sectionTitle}</h1></div><div className="text-xs text-right opacity-50 lg:mr-10"><p>{currentUser?.name}</p><p className="uppercase font-bold text-[10px]">{currentUser?.role}</p></div></header>
      
      <main className="flex-1 overflow-y-auto px-6 pt-6 pb-28 scroll-smooth lg:ml-64 lg:px-10 lg:pt-8 lg:pb-10">
        <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 lg:hidden"><p className="text-[10px] uppercase tracking-[0.2em] opacity-40">{t('workspace')}</p><h2 className="text-2xl font-black mt-1">{sectionTitle}</h2></div>
        {apiError && <div role="alert" className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400"><span>{apiError}</span><button onClick={loadAllData} className="rounded-lg bg-rose-500/15 px-3 py-2 text-xs font-bold">Reintentar</button></div>}
        {isLoading && <div className="mb-5 flex items-center gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-sm text-blue-400"><span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" /> Cargando información de PharmaPro...</div>}
        {activeTab === 'Dashboard' && ['admin','owner'].includes(currentUser?.role?.toLowerCase()) && <DashboardView inventory={inventory} chartData={chartData} requests={requests} theme={theme} bgCard={bgCard} language={language} t={t} StatCard={StatCard} Icons={Icons} goToFilter={goToFilter} genericPut={genericPut} />}

        {activeTab === 'Inventory' && <InventoryView inventory={inventory} filteredInventory={filteredInventory} paginatedInventory={paginatedInventory} categoryTranslations={categoryTranslations} language={language} searchQuery={searchQuery} setSearchQuery={setSearchQuery} resetFilters={resetFilters} filterCategory={filterCategory} filterLowStock={filterLowStock} filterExpiry={filterExpiry} setFilterCategory={setFilterCategory} setFilterLowStock={setFilterLowStock} setFilterExpiry={setFilterExpiry} currentPage={currentPage} itemsPerPage={itemsPerPage} setCurrentPage={setCurrentPage} currentUser={currentUser} setEditingItem={setEditingItem} setIsAddingMed={setIsAddingMed} requestStock={requestStock} Icons={Icons} bgCard={bgCard} inputClass={inputClass} />}

        {/* --- DEMÁS PESTAÑAS (POS, Orders, Clients, Settings...) --- */}
        {activeTab === 'POS' && <POSView activeShift={activeShift} setCashModal={setCashModal} t={t} scannerMode={scannerMode} setScannerMode={setScannerMode} inputClass={inputClass} searchInputRef={searchInputRef} posSearch={posSearch} setPosSearch={setPosSearch} handleScannerInput={handleScannerInput} Icons={Icons} inventory={inventory} addToCart={addToCart} bgCard={bgCard} cart={cart} updateCartQty={updateCartQty} removeFromCart={removeFromCart} selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer} posCustomerSearch={posCustomerSearch} setPosCustomerSearch={setPosCustomerSearch} setIsAddingCustomer={setIsAddingCustomer} posFilteredCustomers={posFilteredCustomers} handleCheckout={handleCheckout} theme={theme} />}

        {activeTab === 'Suppliers' && <SuppliersView suppliers={suppliers} bgCard={bgCard} setIsAddingSupplier={setIsAddingSupplier} setConfirmModal={setConfirmModal} />}
        {activeTab === 'Clients' && <CustomersView customers={customers} bgCard={bgCard} setIsAddingCustomer={setIsAddingCustomer} setEditingCustomer={setEditingCustomer} setConfirmModal={setConfirmModal} currentUser={currentUser} t={t} />}
        {activeTab === 'Orders' && <OrdersView orders={orders} bgCard={bgCard} setIsTicketOpen={setIsTicketOpen} setLastOrder={setLastOrder} setSelectedOrder={setSelectedOrder} />}
        
        {activeTab === 'Settings' && <SettingsView theme={theme} language={language} setTheme={setTheme} setLanguage={setLanguage} t={t} exportToCSV={exportToCSV} setIsStaffMgmt={setIsStaffMgmt} setIsBranchMgmt={setIsBranchMgmt} setIsChangingPass={setIsChangingPass} setConfirmModal={setConfirmModal} />}

        </div>
      </main>

      {/* --- MODAL DE ZOOM DE IMAGEN (NUEVO) --- */}
      {expandedImage && (
        <div className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm cursor-pointer" onClick={() => setExpandedImage(null)}>
            <img src={expandedImage} alt="Zoom" className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain" />
            <div className="absolute top-4 right-4 text-white/50 text-sm font-bold">Clic para cerrar</div>
        </div>
      )}

      {/* --- MODALES --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/90 z-[500] flex items-center justify-center p-6">
            <div className={`p-6 rounded-3xl border shadow-2xl max-w-sm w-full ${bgCard} relative`}>
                <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 p-2 bg-neutral-800/20 rounded-full">✕</button>
                <h2 className="text-xl font-bold mb-1">{t('orderDetails')}</h2>
                <p className="text-xs opacity-50 mb-4">ID: #{selectedOrder.id}</p>
                <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">{selectedOrder.items.map((item: any, i: number) => (<div key={i} className="flex justify-between text-sm border-b border-dashed border-neutral-700/30 pb-1"><span>{item.qty} x {item.name}</span><span className="font-bold">${(item.price * item.qty).toFixed(2)}</span></div>))}</div>
                <div className="flex justify-between items-center text-xl font-black mb-6"><span>Total</span><span>${Number(selectedOrder.total).toFixed(2)}</span></div>
                <div className="flex gap-2"><button onClick={() => { setIsTicketOpen(true); setLastOrder(selectedOrder); }} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm">{t('print')}</button>{['admin','owner'].includes(currentUser?.role?.toLowerCase()) && selectedOrder.status !== 'Voided' && (<button onClick={() => setConfirmModal({isOpen:true, type:'void_order', id:selectedOrder.id, message:"¿ANULAR VENTA? Se devolverá el stock."})} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold">Anular</button>)}</div>
            </div>
        </div>
      )}

      {confirmModal.isOpen && (<div className="fixed inset-0 bg-black/95 z-[600] flex items-center justify-center p-8"><div className={`p-8 rounded-3xl border text-center w-full max-w-sm ${bgCard}`}><h3 className="text-2xl font-bold mb-8">{confirmModal.message}</h3><div className="flex gap-3"><button onClick={() => setConfirmModal({...confirmModal, isOpen:false})} className="flex-1 min-w-0 py-4 bg-gray-600 rounded-2xl text-white font-bold">{t('no')}</button><button onClick={() => { if(confirmModal.type==='void_order') handleVoidOrder(); else if(confirmModal.type==='delete_supplier') genericDelete(`/suppliers/${confirmModal.id}`, "Eliminado"); else executeDelete(); }} className="flex-1 min-w-0 py-4 bg-red-600 rounded-2xl text-white font-bold">{t('yes')}</button></div></div></div>)}

      {(isBranchMgmt || isAddingBranch) && (
        <div className="fixed inset-0 bg-black/95 z-[250] flex items-center justify-center p-6">
            <div className={`w-full max-w-sm p-6 rounded-3xl border ${bgCard}`}>
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => { setIsBranchMgmt(false); setIsAddingBranch(false); }} className="p-2 rounded-full bg-gray-500/20"><Icons.Back className="w-5 h-5"/></button>
                    <h2 className="text-xl font-bold">{isBranchMgmt ? t('branchList') : t('newBranch')}</h2>
                </div>
                {isBranchMgmt ? (
                    <div><div className="space-y-2 mb-4 max-h-60 overflow-y-auto">{branches.map(b => (<div key={b.id} className="flex justify-between p-3 border rounded-xl items-center"><div><p className="font-bold text-sm">{b.name}</p><p className="text-[10px] opacity-50">{b.address}</p></div><button onClick={()=>setConfirmModal({isOpen:true, type:'delete_branch', id:b.id, message:t('deleteBranch')})} className="p-2 bg-red-500/10 text-red-500 rounded-lg"><Icons.Trash className="w-4 h-4"/></button></div>))}</div><button type="button" onClick={()=>{setIsAddingBranch(true); setIsBranchMgmt(false);}} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg">{`+ ${t('newBranch')}`}</button></div>
                ) : (
                    <form onSubmit={addBranch} className="space-y-4">
                        <input name="name" required placeholder={t('branchName')} className={`w-full p-4 rounded-xl border outline-none ${inputClass}`} />
                        <input name="address" placeholder={t('address')} className={`w-full p-4 rounded-xl border outline-none ${inputClass}`} />
                        <input name="phone" placeholder={t('phone')} className={`w-full p-4 rounded-xl border outline-none ${inputClass}`} />
                        <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg">{t('save')}</button>
                    </form>
                )}
            </div>
        </div>
      )}

      {(isStaffMgmt || isAddingStaff || editingStaff || isChangingPass) && (
        <div className="fixed inset-0 bg-black/95 z-[250] flex items-center justify-center p-6">
            <div className={`w-full max-w-sm p-6 rounded-3xl border ${bgCard}`}>
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => { setIsStaffMgmt(false); setIsAddingStaff(false); setEditingStaff(null); setIsChangingPass(false); }} className="p-2 rounded-full bg-gray-500/20"><Icons.Back className="w-5 h-5"/></button>
                    <h2 className="text-xl font-bold">{isChangingPass ? t('changePass') : (isStaffMgmt ? t('staffMgmt') : (isAddingStaff ? t('newStaff') : t('editStaff')))}</h2>
                </div>
                {isStaffMgmt ? (
                    <div><div className="space-y-2 mb-4 max-h-60 overflow-y-auto">{staffList.map(s => (<div key={s.id} className="flex justify-between p-3 border rounded-xl items-center"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-xs">{s.name.charAt(0)}</div><div><p className="font-bold text-sm">{s.name}</p><p className="text-[10px] opacity-50 uppercase">{t(({admin:'admin',owner:'admin',pharmacist:'pharmacist',cashier:'cashier',staff:'staffRole'} as any)[s.role?.toLowerCase()] || 'staffRole')}</p></div></div><div className="flex gap-2"><button onClick={()=>{setEditingStaff(s); setIsStaffMgmt(false);}} className="p-2 bg-gray-500/10 rounded-lg"><Icons.Edit className="w-4 h-4"/></button>{s.username !== 'admin' && <button onClick={()=>setConfirmModal({isOpen:true, type:'delete_staff', id:s.id, message:t('deleteStaff')})} className="p-2 bg-red-500/10 text-red-500 rounded-lg"><Icons.Trash className="w-4 h-4"/></button>}</div></div>))}</div><button type="button" onClick={()=>{setIsAddingStaff(true); setIsStaffMgmt(false);}} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg">{`+ ${t('addStaff')}`}</button></div>
                ) : (
                    <form onSubmit={isAddingStaff ? addStaffMember : handleUpdateStaff} className="space-y-4">
                        {!isChangingPass && (<><input name="name" defaultValue={editingStaff?.name} required placeholder={t('fullName')} className={`w-full p-4 rounded-xl border outline-none ${inputClass}`} /><select name="role" defaultValue={editingStaff?.role} className={`w-full p-4 rounded-xl border outline-none ${inputClass}`}><option value="Pharmacist">{t('pharmacist')}</option><option value="Cashier">{t('cashier')}</option><option value="Staff">{t('staffRole')}</option></select><input name="username" defaultValue={editingStaff?.username} required placeholder={t('user')} className={`w-full p-4 rounded-xl border outline-none ${inputClass}`} /></>)}
                        <input name="password" type="password" placeholder={t('newPassword')} className={`w-full p-4 rounded-xl border outline-none ${inputClass}`} />
                        <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg">{t('saveChanges')}</button>
                    </form>
                )}
            </div>
        </div>
      )}

      {cashModal.isOpen && (<div className="fixed inset-0 bg-black/95 z-[500] flex items-center justify-center p-6"><form onSubmit={handleCashAction} className={`p-6 rounded-3xl border w-full max-w-xs ${bgCard}`}><h2 className="text-xl font-bold mb-2">{cashModal.type === 'open' ? '🟢 ABRIR TURNO' : '🔴 CERRAR TURNO'}</h2><input name="amount" type="number" step="0.01" autoFocus required className={`w-full p-4 text-2xl font-black text-center rounded-xl border mb-4 ${inputClass}`} /><button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold">CONFIRMAR</button><button type="button" onClick={() => setCashModal({isOpen:false})} className="w-full mt-2 py-3 text-sm opacity-50">Cancelar</button></form></div>)}
      {(isAddingSupplier || editingSupplier) && (<div className="fixed inset-0 bg-black/95 z-[250] flex items-center justify-center p-6"><form onSubmit={async (e) => { e.preventDefault(); const fd = new FormData(e.target as HTMLFormElement); const body = { name: fd.get('name'), contact: fd.get('contact'), phone: fd.get('phone'), address: fd.get('address') }; if(editingSupplier) await genericPut(`/suppliers/${editingSupplier.id}`, body, "Actualizado"); else await genericPost('/suppliers', body, "Creado"); setIsAddingSupplier(false); setEditingSupplier(null); }} className={`w-full max-w-sm space-y-4 p-6 rounded-3xl border ${bgCard}`}><h2 className="text-xl font-bold">{editingSupplier ? 'Editar proveedor' : 'Nuevo proveedor'}</h2><label className="block text-xs font-bold opacity-60">Empresa<input name="name" defaultValue={editingSupplier?.name} required placeholder="Nombre de la empresa" className={`mt-1 w-full p-4 rounded-xl border ${inputClass}`} /></label><label className="block text-xs font-bold opacity-60">Contacto<input name="contact" defaultValue={editingSupplier?.contact} placeholder="Nombre de contacto" className={`mt-1 w-full p-4 rounded-xl border ${inputClass}`} /></label><label className="block text-xs font-bold opacity-60">Teléfono<input name="phone" defaultValue={editingSupplier?.phone} placeholder="Número de teléfono" className={`mt-1 w-full p-4 rounded-xl border ${inputClass}`} /></label><label className="block text-xs font-bold opacity-60">Dirección<input name="address" defaultValue={editingSupplier?.address} placeholder="Dirección" className={`mt-1 w-full p-4 rounded-xl border ${inputClass}`} /></label><div className="flex gap-2"><button type="button" onClick={()=>{setIsAddingSupplier(false);setEditingSupplier(null)}} className="flex-1 py-3 bg-gray-600 rounded-xl text-white">Cancelar</button><button className="flex-1 py-3 bg-blue-600 rounded-xl text-white font-bold">Guardar</button></div></form></div>)}
      {(isAddingMed || editingItem) && (<div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[250] flex items-center justify-center p-6"><form onSubmit={editingItem ? updateMedication : addMedication} className={`w-full max-w-sm space-y-4 p-6 rounded-3xl border shadow-2xl ${bgCard}`}><h2 className="text-xl font-bold">{editingItem ? "Editar" : "Nuevo"} Producto</h2>
      
      {/* VISTA PREVIA DE IMAGEN */}
      {editingItem?.image_url && (<div className="w-full h-40 bg-neutral-900 rounded-xl mb-4 flex items-center justify-center overflow-hidden border border-neutral-800"><img src={editingItem.image_url} alt="Vista" className="w-full h-full object-contain" onError={(e:any) => e.target.style.display='none'} /></div>)}
      
      <input name="name" defaultValue={editingItem?.name} required placeholder="Nombre" className={`w-full p-4 rounded-xl border ${inputClass}`} /><select name="category" defaultValue={editingItem?.category} className={`w-full p-4 rounded-xl border ${inputClass}`}>{Object.keys(categoryTranslations).map(cat => <option key={cat} value={cat}>{categoryTranslations[cat][language]}</option>)}</select><div className="grid grid-cols-2 gap-2"><input name="stock" defaultValue={editingItem?.stock} type="number" required placeholder="Stock" className={`w-full p-4 rounded-xl border ${inputClass}`} /><input name="price" defaultValue={editingItem?.price} type="number" step="0.01" required placeholder="Precio" className={`w-full p-4 rounded-xl border ${inputClass}`} /></div><input name="expiry" defaultValue={editingItem ? editingItem.expiryDate?.split('T')[0] : ''} type="date" required className={`w-full p-4 rounded-xl border ${inputClass}`} />
      
      <input name="image_url" defaultValue={editingItem?.image_url} placeholder="URL de Imagen (Opcional)" className={`w-full p-4 rounded-xl border ${inputClass}`} />
      
      <div className="flex gap-4 pt-2"><button type="button" onClick={() => {setIsAddingMed(false); setEditingItem(null)}} className="flex-1 py-4 font-bold opacity-40 text-sm">Cancelar</button><button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold text-sm">Guardar</button></div></form></div>)}
      {(isAddingCustomer || editingCustomer) && (<div className="fixed inset-0 bg-black/95 z-[250] flex items-center justify-center p-6"><form onSubmit={editingCustomer ? updateCustomer : addCustomer} className={`w-full max-w-sm space-y-4 p-6 rounded-3xl border ${bgCard}`}><h2 className="text-xl font-bold">{editingCustomer ? t('editClient') : t('newClient')}</h2><label className="block text-xs font-bold opacity-60">{t('fullName')}<input name="name" defaultValue={editingCustomer?.name} required placeholder={t('customerName')} className={`mt-1 w-full p-4 rounded-xl border ${inputClass}`} /></label><label className="block text-xs font-bold opacity-60">{t('phone')}<input name="phone" defaultValue={editingCustomer?.phone} placeholder={t('phoneNumber')} className={`mt-1 w-full p-4 rounded-xl border ${inputClass}`} /></label><label className="block text-xs font-bold opacity-60">{t('address')}<input name="address" defaultValue={editingCustomer?.address} placeholder={t('address')} className={`mt-1 w-full p-4 rounded-xl border ${inputClass}`} /></label><label className="block text-xs font-bold opacity-60">{t('receiptTaxId')}<input name="rnc" defaultValue={editingCustomer?.rnc} placeholder={t('optionalTaxId')} className={`mt-1 w-full p-4 rounded-xl border ${inputClass}`} /></label><div className="flex gap-2"><button type="button" onClick={()=>{setIsAddingCustomer(false);setEditingCustomer(null)}} className="flex-1 py-3 bg-gray-600 text-white rounded-xl">{t('cancel')}</button><button className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold">{t('save')}</button></div></form></div>)}
      
      {isTicketOpen && lastOrder && (
        <div className="fixed inset-0 bg-black/90 z-[500] flex items-center justify-center p-4">
          <div className="bg-white text-black w-full max-w-xs p-0 rounded-sm shadow-2xl relative">
            <button onClick={()=>setIsTicketOpen(false)} className="absolute -top-10 right-0 text-white no-print">X</button>
            <div id="print-area" className="font-mono p-4 text-[12px] leading-tight w-full mx-auto bg-white text-black">
              <div className="text-center mb-4 border-b-2 border-dashed border-black pb-2">
                  <h2 className="text-2xl font-black uppercase">PHARMAPRO</h2>
                  <p>{t('centralBranch')}</p>
                  <p>{t('receiptTaxId')}: 101-555-999</p>
                  <p>{new Date().toLocaleString(language === 'EN' ? 'en-US' : 'es-SV')}</p>
              </div>
              <div className="mb-2 border-b-2 border-dashed border-black pb-2">
                  <p><b>{t('receiptCustomer')}:</b> {['Cliente General', 'General Customer'].includes(lastOrder.patient) ? t('generalCustomer') : lastOrder.patient}</p>
                  <p><b>{t('receiptTicket')}:</b> {lastOrder.id}</p>
                  <p><b>{t('receiptCashier')}:</b> {currentUser?.name}</p>
                  <p><b>{t('receiptRegistration')}:</b> _________________</p>
              </div>
              <table className="w-full mb-4 border-b-2 border-dashed border-black pb-2">
                  <thead><tr className="text-left"><th>{t('receiptQty')}</th><th>{t('receiptItem')}</th><th className="text-right">$$</th></tr></thead>
                  <tbody>{lastOrder.items.map((item: any, i: number) => (<tr key={i}><td className="align-top pt-1">{item.qty}</td><td className="align-top pt-1">{item.name.substring(0, 15)}</td><td className="text-right align-top pt-1">{(item.price * item.qty).toFixed(2)}</td></tr>))}</tbody>
              </table>
              <div className="flex justify-between text-2xl font-black mb-2"><span>TOTAL</span><span>${Number(lastOrder.total).toFixed(2)}</span></div>
              <div className="text-center mt-6 border-t-2 border-dashed border-black pt-2">
                  <p>*** {t('receiptThanks').toUpperCase()} ***</p>
                  <p className="mt-2 text-[10px]">{t('receiptSystem')}</p>
              </div>
            </div>
            <button onClick={()=>window.print()} className="w-full py-4 bg-black text-white font-bold no-print">{t('print')}</button>
          </div>
        </div>
      )}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} labels={translations[language]} theme={theme} role={currentUser?.role} />
    </div>
  );
};

export default App;
