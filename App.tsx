import React, { useState, useMemo, useEffect, useRef } from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, CartesianGrid, YAxis, LabelList } from 'recharts';

// --- ICONOS ---
const Icons = {
  Edit: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Trash: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Dashboard: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" /></svg>,
  Inventory: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  Orders: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  Settings: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Download: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Check: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Eye: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  Sun: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Moon: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
  Search: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Filter: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  Warning: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Cart: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Plus: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Minus: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>,
  Print: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" /></svg>,
  Users: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Phone: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Map: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Bolt: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Truck: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  Cash: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Ban: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>,
  Back: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
  Office: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> 
};

const StatCard = ({ label, value, variant = 'blue', onClick, theme }) => {
  const colors = {
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

const BottomNav = ({ activeTab, onTabChange, labels, theme, role }) => {
  if (!role) return null;
  const r = role.toLowerCase();
  let tabs = [];
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
    <div className={`fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto ${theme === 'dark' ? 'bg-black/90 border-neutral-800' : 'bg-white/90 border-gray-200'} backdrop-blur-xl border-t p-2 pb-6 flex justify-around items-center z-50`}>
      {tabs.map((tab) => (<button key={tab.id} onClick={() => onTabChange(tab.id)} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${activeTab === tab.id ? 'text-blue-500 scale-110' : (theme === 'dark' ? 'text-neutral-500 hover:text-neutral-300' : 'text-gray-400 hover:text-gray-600')}`}><tab.icon className="w-6 h-6" /><span className="text-[9px] font-bold uppercase tracking-wider">{tab.label}</span>{activeTab === tab.id && <div className="w-1 h-1 bg-blue-500 rounded-full mt-1 animate-pulse" />}</button>))}
    </div>
  );
};

const categoryTranslations = { "Antibiotic": { EN: "Antibiotic", ES: "Antibiótico" }, "Analgesic": { EN: "Analgesic", ES: "Analgésico" }, "Cardiac": { EN: "Cardiac", ES: "Cardíaco" }, "Diabetes": { EN: "Diabetes", ES: "Diabetes" }, "Statins": { EN: "Statins", ES: "Estatinas" }, "Misc": { EN: "Misc", ES: "Varios" } };
const translations = { 
    EN: { dashboard: "Dashboard", inventory: "Inventory", orders: "Orders", settings: "Settings", clients: "Clients", POS: "POS", suppliers: "Suppliers", noClients: "No registered clients", close: "Close", scannerMode: "Scanner", language: "Language & Theme", darkMode: "Dark Mode", lightMode: "Light Mode", security: "Security", logout: "Sign Out", logoutConfirm: "Are you sure you want to log out?", staffMgmt: "Staff Management", changePass: "Change Password", exportCsv: "Export Inventory (CSV)", confirmTitle: "Confirm", yes: "Yes", no: "No", openBox: "OPEN SHIFT", closeBox: "CLOSE SHIFT", salesHistory: "Sales History", todaySales: "Today Sales", pendingPresc: "Pending", lowStock: "Low Stock", expiredCount: "Expired", warningCount: "Expiring", addClient: "Add Client", pass: "Password", name: "Name", user: "Username" }, 
    ES: { dashboard: "Panel", inventory: "Inventario", orders: "Pedidos", settings: "Ajustes", clients: "Clientes", POS: "Caja", suppliers: "Prov.", noClients: "No hay clientes registrados", close: "Cerrar", scannerMode: "Escáner", language: "Idioma y Tema", darkMode: "Modo Oscuro", lightMode: "Modo Claro", security: "Seguridad", logout: "Cerrar Sesión", logoutConfirm: "¿Seguro que quieres cerrar sesión?", staffMgmt: "Gestión de Personal", changePass: "Cambiar Contraseña", exportCsv: "Exportar Inventario (CSV)", confirmTitle: "Confirmación", yes: "Sí", no: "No", openBox: "ABRIR CAJA", closeBox: "CERRAR CAJA", salesHistory: "Historial de Ventas", todaySales: "Ventas Hoy", pendingPresc: "Pendientes", lowStock: "Stock Bajo", expiredCount: "Vencidos", warningCount: "Por Vencer", addClient: "Añadir Cliente", pass: "Contraseña", name: "Nombre", user: "Usuario" } 
};

const App = () => {
  // CAMBIA ESTO POR TU IP SI USAS CELULAR
  const API_URL = 'http://192.168.1.177:3001'; 

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [language, setLanguage] = useState('ES');
  const [theme, setTheme] = useState('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [filterExpiry, setFilterExpiry] = useState('All');
  const [inventory, setInventory] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]); 
  const [branches, setBranches] = useState([]);
  const [requests, setRequests] = useState([]); 
  const [chartData, setChartData] = useState([]); 
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [posSearch, setPosSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null); 
  const [posCustomerSearch, setPosCustomerSearch] = useState('');
  const [scannerMode, setScannerMode] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [isAddingMed, setIsAddingMed] = useState(false);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [isStaffMgmt, setIsStaffMgmt] = useState(false);
  const [isBranchMgmt, setIsBranchMgmt] = useState(false);
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [activeShift, setActiveShift] = useState(null); 
  const [toast, setToast] = useState({ message: '', visible: false });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, id: null, message: '' });
  const [cashModal, setCashModal] = useState({ isOpen: false, type: 'open' }); 
  
  const searchInputRef = useRef(null);
  const t = (key) => translations[language][key] || key;
  const showToast = (message) => { setToast({ message, visible: true }); setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000); };

  const resetFilters = () => { setFilterCategory('All'); setFilterLowStock(false); setFilterExpiry('All'); setSearchQuery(''); };
  const goToFilter = (type) => { setActiveTab('Inventory'); resetFilters(); if (type === 'expired') setFilterExpiry('expired'); if (type === 'warning') setFilterExpiry('warning'); if (type === 'lowStock') setFilterLowStock(true); };

  const exportToCSV = () => {
    const headers = ["Nombre,Categoria,Stock,Precio,Vencimiento"];
    const rows = inventory.map(item => `"${item.name}","${item.category}",${item.stock},${item.price},${item.expiryDate ? item.expiryDate.split('T')[0] : ''}`);
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = `inventario_pharmapro_${new Date().toISOString().split('T')[0]}.csv`; document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const getExpiryStatus = (dateString) => {
    if (!dateString) return 'good';
    const today = new Date(); const expiry = new Date(dateString); const diffTime = expiry - today; const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'expired'; if (diffDays < 90) return 'warning'; return 'good';
  };

  const loadAllData = () => {
    fetch(`${API_URL}/inventory`).then(r => r.json()).then(setInventory).catch(console.error);
    fetch(`${API_URL}/users`).then(r => r.json()).then(setStaffList).catch(console.error);
    fetch(`${API_URL}/orders`).then(r => r.json()).then(setOrders).catch(console.error);
    fetch(`${API_URL}/customers`).then(r => r.json()).then(setCustomers).catch(console.error);
    fetch(`${API_URL}/suppliers`).then(r => r.json()).then(setSuppliers).catch(console.error);
    fetch(`${API_URL}/branches`).then(r => r.json()).then(setBranches).catch(console.error);
    fetch(`${API_URL}/branch-requests`).then(r => r.json()).then(setRequests).catch(console.error);
    fetch(`${API_URL}/stats/weekly`).then(r => r.json()).then(setChartData).catch(console.error);
    if(currentUser) checkActiveShift();
  };

  // --- AUTO-REFRESCO (POLLING) PARA NO TENER QUE CERRAR SESIÓN ---
  useEffect(() => {
      if(isLoggedIn) {
          const interval = setInterval(loadAllData, 3000); // Actualiza cada 3 segundos
          return () => clearInterval(interval);
      }
  }, [isLoggedIn, currentUser]);

  const checkActiveShift = () => { fetch(`${API_URL}/cash-cut/active/${currentUser.id}`).then(r => r.json()).then(setActiveShift).catch(console.error); }

  useEffect(() => { if(isLoggedIn) loadAllData(); }, [isLoggedIn]);
  useEffect(() => { if(activeTab==='POS' && scannerMode && searchInputRef.current && !cashModal.isOpen && !isAddingCustomer) searchInputRef.current.focus(); }, [activeTab, scannerMode, cart, cashModal, isAddingCustomer]);

  // FILTROS
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

  const posFilteredCustomers = useMemo(() => {
    if (!posCustomerSearch || selectedCustomer) return [];
    return customers.filter(c => c.name.toLowerCase().includes(posCustomerSearch.toLowerCase()));
  }, [customers, posCustomerSearch, selectedCustomer]);

  // LÓGICA DE CARRITO
  const addToCart = (product) => {
    if (!activeShift) { showToast("⚠️ Caja Cerrada: Se añadirá igual"); }
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) { showToast("Cantidad +1"); return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item); }
      showToast("Producto Agregado");
      return [...prev, { ...product, qty: 1 }];
    });
  };
  const removeFromCart = (id) => { setCart(prev => prev.filter(item => item.id !== id)); showToast("Eliminado del carrito"); };
  const updateCartQty = (id, delta) => { setCart(prev => prev.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item)); };

  const handleScannerInput = (e) => {
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

  const requestStock = async (item) => {
      const branchName = prompt("¿Para qué sucursal?", "Sede Central");
      if(!branchName) return;
      await genericPost('/branch-requests', { item_name: item.name, qty: 10, requested_by: currentUser.name, branch_name: branchName, actingUser: currentUser }, "Solicitud Enviada");
  };

  const handleVoidOrder = async () => { const { id } = confirmModal; const reason = prompt("Motivo de anulación:"); if(!reason) return; try { const res = await fetch(`${API_URL}/orders/${id}/void`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ reason, actingUser: currentUser }) }); if(res.ok) { showToast("Venta Anulada"); loadAllData(); setConfirmModal({isOpen:false, type:null}); setSelectedOrder(null); } else { alert("Error al anular"); } } catch (err) { alert("Error"); } };
  const handleCashAction = async (e) => { e.preventDefault(); const amount = e.target.amount.value; if (cashModal.type === 'open') { await fetch(`${API_URL}/cash-cut/open`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId: currentUser.id, amount }) }); showToast("Caja Abierta"); } else { const res = await fetch(`${API_URL}/cash-cut/close`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ id: activeShift.id, closeAmount: amount, userId: currentUser.id }) }); const data = await res.json(); alert(`Cierre Exitoso:\nVendido: $${data.totalSales}\nDiferencia: $${data.discrepancy}`); } setCashModal({isOpen:false}); loadAllData(); };
  
  const handleLogin = async (e) => { e.preventDefault(); const fd = new FormData(e.target); try { const res = await fetch(`${API_URL}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user: fd.get('user'), pass: fd.get('pass') }) }); const data = await res.json(); if (data.success) { setIsLoggedIn(true); setCurrentUser(data.user); const r = (data.user.role || '').toLowerCase(); if (['cashier','cajero','staff','pharmacist','farmaceutico'].includes(r)) { setActiveTab('POS'); } else { setActiveTab('Dashboard'); } showToast(`Bienvenido ${data.user.name}`); } else { alert('Credenciales Incorrectas'); } } catch (err) { alert('ERROR DE CONEXIÓN'); } };
  const genericPost = async (url, body, msg) => { await fetch(`${API_URL}${url}`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ ...body, actingUser: currentUser }) }); loadAllData(); showToast(msg); };
  const genericPut = async (url, body, msg) => { await fetch(`${API_URL}${url}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ ...body, actingUser: currentUser }) }); loadAllData(); showToast(msg); };
  const genericDelete = async (url, msg) => { await fetch(`${API_URL}${url}`, { method: 'DELETE', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ actingUser: currentUser }) }); loadAllData(); showToast(msg); setConfirmModal({isOpen:false}); };
  
  // FORMULARIOS
  const updateMedication = (e) => { e.preventDefault(); const fd = new FormData(e.target); genericPut(`/inventory/${editingItem.id}`, { name: fd.get('name'), category: fd.get('category'), stock: parseInt(fd.get('stock')), price: parseFloat(fd.get('price')), expiryDate: fd.get('expiry') }, "Actualizado"); setEditingItem(null); };
  const addMedication = (e) => { e.preventDefault(); const fd = new FormData(e.target); genericPost('/inventory', { name: fd.get('name'), category: fd.get('category'), stock: parseInt(fd.get('stock')), price: parseFloat(fd.get('price')), expiryDate: fd.get('expiry') }, "Guardado"); setIsAddingMed(false); };
  const updateCustomer = (e) => { e.preventDefault(); const fd = new FormData(e.target); genericPut(`/customers/${editingCustomer.id}`, { name: fd.get('name'), phone: fd.get('phone'), address: fd.get('address'), rnc: fd.get('rnc') }, "Actualizado"); setEditingCustomer(null); };
  const addCustomer = (e) => { e.preventDefault(); const fd = new FormData(e.target); genericPost('/customers', { name: fd.get('name'), phone: fd.get('phone'), address: fd.get('address'), rnc: fd.get('rnc') }, "Creado"); setIsAddingCustomer(false); if(activeTab==='POS') setPosCustomerSearch(fd.get('name')); };
  const handleUpdateStaff = (e) => { e.preventDefault(); const fd = new FormData(e.target); const userId = editingStaff ? (editingStaff.id || editingStaff.ID) : (currentUser.id || currentUser.ID); genericPut(`/users/${userId}`, { name: fd.get('name') || currentUser.name, role: fd.get('role') || currentUser.role, username: fd.get('username') || currentUser.username, password: fd.get('password') }, "Datos Actualizados"); setEditingStaff(null); setIsChangingPass(false); };
  const addStaffMember = (e) => { e.preventDefault(); const fd = new FormData(e.target); genericPost('/users', { name: fd.get('name'), role: fd.get('role'), username: fd.get('username'), password: fd.get('password') }, "Creado"); setIsAddingStaff(false); };
  const addBranch = (e) => { e.preventDefault(); const fd = new FormData(e.target); genericPost('/branches', { name: fd.get('name'), address: fd.get('address'), phone: fd.get('phone') }, "Sucursal Creada"); setIsAddingBranch(false); };

  const executeDelete = () => { const { type, id } = confirmModal; if (type === 'delete_product') genericDelete(`/inventory/${id}`, "Eliminado"); else if (type === 'delete_staff') genericDelete(`/users/${id}`, "Eliminado"); else if (type === 'delete_customer') genericDelete(`/customers/${id}`, "Eliminado"); else if (type === 'delete_supplier') genericDelete(`/suppliers/${id}`, "Eliminado"); else if (type === 'delete_branch') genericDelete(`/branches/${id}`, "Eliminado"); else if (type === 'void_order') handleVoidOrder(); else if (type === 'logout') { setIsLoggedIn(false); setCurrentUser(null); setCart([]); setActiveTab('Dashboard'); setConfirmModal({ isOpen: false }); showToast("Sesión Cerrada"); } };

  // UI
  const bgMain = theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-gray-900';
  const bgCard = theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200 shadow-sm';
  const inputClass = theme === 'dark' ? 'bg-black border-neutral-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900';

  if (!isLoggedIn) return (<div className={`min-h-screen flex flex-col items-center justify-center p-6 ${bgMain}`}><h1 className="text-3xl font-black mb-8">PharmaPro</h1><form onSubmit={handleLogin} className="w-full max-w-sm space-y-4"><input name="user" placeholder="Usuario" className={`w-full p-4 rounded-2xl border ${inputClass}`} /><input type="password" name="pass" placeholder="Contraseña" className={`w-full p-4 rounded-2xl border ${inputClass}`} /><button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">Entrar</button></form></div>);

  return (
    <div className={`h-screen flex flex-col font-sans max-w-md mx-auto relative overflow-hidden ${bgMain}`}>
      <style>{`@media print { body * { visibility: hidden; } #print-area, #print-area * { visibility: visible; } #print-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; background-color: white; color: black; } .no-print { display: none !important; } @page { size: auto; margin: 0mm; } }`}</style>
      {toast.visible && <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] bg-black text-white px-6 py-3 rounded-full font-bold shadow-2xl border border-neutral-800 animate-bounce">{toast.message}</div>}
      <header className={`flex-shrink-0 px-6 py-4 border-b flex items-center justify-between backdrop-blur-md z-40 ${theme === 'dark' ? 'border-neutral-900 bg-black/50' : 'border-gray-200 bg-white/50'}`}><div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><span className="text-xl font-bold italic text-white">P+</span></div><h1 className="text-lg font-bold">PharmaPro</h1></div><div className="text-xs text-right opacity-50"><p>{currentUser?.name}</p><p className="uppercase font-bold text-[10px]">{currentUser?.role}</p></div></header>
      
      <main className="flex-1 overflow-y-auto px-6 pt-6 pb-24 scroll-smooth">
        {activeTab === 'Dashboard' && ( <div className="space-y-6">
            {/* TARJETAS */}
            {['admin','owner'].includes(currentUser?.role?.toLowerCase()) && <StatCard label={t('todaySales')} value={`$${chartData.reduce((a,b)=>a+Number(b.v),0).toFixed(2)}`} variant="green" theme={theme} />}
            
            {/* --- GRID DE 3 BOTONES DE FILTRO (STOCK BAJO, VENCIDOS, POR VENCER) --- */}
            <div className="grid grid-cols-3 gap-2">
                <StatCard label={t('lowStock')} value={inventory.filter(i=>i.stock<=10).length} variant="orange" onClick={() => goToFilter('lowStock')} theme={theme} />
                <StatCard label={t('expiredCount')} value={inventory.filter(i=>getExpiryStatus(i.expiryDate)==='expired').length} variant="red" onClick={() => goToFilter('expired')} theme={theme} />
                <StatCard label={t('warningCount')} value={inventory.filter(i=>getExpiryStatus(i.expiryDate)==='warning').length} variant="yellow" onClick={() => goToFilter('warning')} theme={theme} />
            </div>
            
            {['admin','owner'].includes(currentUser?.role?.toLowerCase()) && (
                <>
                    {/* GRAFICA */}
                    <div className={`p-4 rounded-2xl border ${bgCard}`}><h3 className="text-xs font-bold mb-4 ml-2">Ventas Semanales</h3><ResponsiveContainer width="100%" height={220}><BarChart data={chartData} margin={{top:20}}><CartesianGrid strokeDasharray="3 3" opacity={0.1} /><XAxis dataKey="day" stroke="#555" fontSize={12} tickLine={false} axisLine={false} /><YAxis hide /><Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '8px', fontSize: '12px', color: '#fff' }} /><Bar dataKey="v" fill="#3b82f6" radius={[4, 4, 0, 0]}><LabelList dataKey="v" position="top" fill="#888" fontSize={10} formatter={(v)=>`$${v}`} /></Bar></BarChart></ResponsiveContainer></div>
                    
                    {/* --- ADMIN: BANDEJA DE SALIDA --- */}
                    <div className={`p-5 rounded-2xl border ${bgCard}`}>
                        <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Icons.Truck className="w-5 h-5 text-orange-500"/> Solicitudes de Stock (Admin)</h3>
                        {requests.filter(r => r.status === 'Pending').length === 0 ? (<p className="text-xs opacity-40 text-center py-4">No hay pedidos pendientes.</p>) : (
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                {requests.filter(r => r.status === 'Pending').map(req => (
                                    <div key={req.id} className="flex justify-between items-center p-3 border rounded-xl bg-orange-500/5 border-orange-500/20">
                                        <div><p className="font-bold text-sm text-orange-500">{req.item_name} (x{req.qty})</p><p className="text-[10px] opacity-60">De: {req.requested_by} • {req.branch_name}</p><p className="text-[9px] opacity-40">{new Date(req.date).toLocaleDateString()}</p></div>
                                        <div className="flex gap-2">
                                            <button onClick={async () => { 
                                                const sentQty = prompt(`Piden ${req.qty}. ¿Cuántos envías?`, req.qty);
                                                if(sentQty) await genericPut(`/branch-requests/${req.id}/send`, { status: 'Sent', sentQty: parseInt(sentQty) }, "Enviado"); 
                                            }} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">Enviar</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div> )}

        {/* --- INVENTARIO: BANDEJA DE ENTRADA (Farmacéutico SOLO) --- */}
        {activeTab === 'Inventory' && (
            <div className="space-y-4">
                {/* 1. BARRA DE FILTROS NUEVA (BOTONES DESLIZABLES) */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar">
                    <button onClick={resetFilters} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border ${filterCategory === 'All' && !filterLowStock && filterExpiry === 'All' ? 'bg-white text-black' : 'bg-transparent text-gray-500 border-gray-600'}`}>Todo</button>
                    <button onClick={() => { setFilterLowStock(!filterLowStock); setFilterCategory('All'); setFilterExpiry('All'); }} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border ${filterLowStock ? 'bg-orange-500 text-white border-orange-500' : 'bg-transparent text-gray-500 border-gray-600'}`}>⚠️ Stock Bajo</button>
                    {Object.keys(categoryTranslations).map(cat => (
                        <button key={cat} onClick={() => { setFilterCategory(cat); setFilterLowStock(false); setFilterExpiry('All'); }} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border ${filterCategory === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-gray-500 border-gray-600'}`}>
                            {categoryTranslations[cat][language]}
                        </button>
                    ))}
                </div>

                {/* CAJA DE RECEPCIÓN (Visible SOLO para Farmacéuticos/Staff) */}
                {!['admin','owner'].includes(currentUser?.role?.toLowerCase()) && requests.some(r => r.status === 'Sent') && (
                    <div className={`p-4 rounded-2xl border mb-4 border-emerald-500/30 bg-emerald-500/5`}>
                        <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-emerald-500"><Icons.Truck className="w-5 h-5"/> Envíos por Recibir</h3>
                        <div className="space-y-2">
                            {requests.filter(r => r.status === 'Sent').map(req => (
                                <div key={req.id} className="flex justify-between items-center p-2 bg-black/20 rounded-lg">
                                    <div className="text-xs"><span>📦 <b>{req.sent_qty}</b> x {req.item_name}</span> <span className="opacity-50 text-[10px]">(Pediste: {req.qty})</span></div>
                                    <button onClick={async () => { 
                                        const res = await fetch(`${API_URL}/branch-requests/${req.id}/receive`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ actingUser: currentUser }) });
                                        if (res.ok) { showToast(`✅ Stock sumado (+${req.sent_qty})`); loadAllData(); } else { alert("Error al recibir"); }
                                    }} className="px-3 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold">Recibir</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className={`flex items-center px-4 rounded-2xl border ${inputClass}`}><Icons.Search className="w-5 h-5 opacity-50" /><input placeholder="Buscar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-4 bg-transparent outline-none" /></div>
                <div className="space-y-2">{filteredInventory.map(item => (<div key={item.id} className={`flex justify-between items-center p-4 rounded-2xl border ${bgCard}`}><div><p className="font-bold">{item.name}</p><p className="text-xs text-blue-500">{item.category} • ${item.price}</p></div><div className="flex items-center gap-2"><span className={`font-bold mr-2 ${item.stock<=10?'text-red-500':''}`}>{item.stock}</span>{item.stock <= 10 && ['admin','owner','pharmacist'].includes(currentUser?.role?.toLowerCase()) && <button onClick={()=>requestStock(item)} className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded">Pedir</button>}{['admin','owner','pharmacist'].includes(currentUser?.role?.toLowerCase()) && <button onClick={() => setEditingItem(item)} className="p-2 bg-gray-500/10 rounded-lg"><Icons.Edit className="w-4 h-4"/></button>}</div></div>))}</div>
                {['admin', 'owner'].includes(currentUser?.role?.toLowerCase()) && <button onClick={() => setIsAddingMed(true)} className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl"><Icons.Plus className="w-8 h-8"/></button>}
            </div>
        )}

        {/* --- DEMÁS PESTAÑAS (POS, Orders, Clients, Settings...) SIN CAMBIOS --- */}
        {activeTab === 'POS' && (
          <div className="space-y-4 h-full flex flex-col">
            <button onClick={() => setCashModal({ isOpen: true, type: activeShift ? 'close' : 'open' })} className={`w-full py-3 rounded-xl font-bold border flex items-center justify-center gap-2 ${activeShift ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}><Icons.Cash className="w-5 h-5"/> {activeShift ? t('closeBox') : t('openBox')}</button>
            <div className="flex gap-2 items-center"><div className={`flex-1 flex items-center px-4 rounded-2xl border transition-all ${scannerMode ? 'ring-2 ring-blue-500 bg-blue-500/10' : inputClass}`}><Icons.Search className="w-5 h-5 opacity-50" /><input ref={searchInputRef} placeholder={scannerMode ? "ESCANEA..." : "Buscar..."} value={posSearch} onChange={(e) => setPosSearch(e.target.value)} onKeyDown={handleScannerInput} className="w-full p-4 bg-transparent outline-none" autoFocus /></div><button onClick={() => setScannerMode(!scannerMode)} className={`p-4 rounded-2xl border ${scannerMode ? 'bg-blue-600 text-white' : ''}`}><Icons.Bolt className="w-6 h-6" /></button></div>
            {posSearch && !scannerMode && <div className={`absolute z-50 p-2 rounded-2xl border max-h-60 overflow-y-auto shadow-2xl left-6 right-6 top-48 ${bgCard}`}>{inventory.filter(i => i.name.toLowerCase().includes(posSearch.toLowerCase())).map(i => (<div key={i.id} onClick={() => { addToCart(i); setPosSearch(''); }} className="p-3 hover:bg-neutral-800 rounded-xl flex justify-between"><span>{i.name}</span><span className="text-blue-500">${i.price}</span></div>))}</div>}
            <div className="flex-1 overflow-y-auto space-y-2">{cart.map(i => (<div key={i.id} className={`p-3 rounded-2xl flex justify-between items-center border ${bgCard}`}><div><p className="font-bold text-sm">{i.name}</p><p className="text-xs opacity-60">${i.price} x {i.qty} = <b>${(i.price*i.qty).toFixed(2)}</b></p></div><div className="flex items-center gap-2 bg-gray-500/10 rounded-lg p-1"><button onClick={() => updateCartQty(i.id, -1)} className="p-1"><Icons.Minus className="w-4 h-4"/></button><span className="font-bold text-sm w-4 text-center">{i.qty}</span><button onClick={() => updateCartQty(i.id, 1)} className="p-1"><Icons.Plus className="w-4 h-4"/></button></div><button onClick={() => removeFromCart(i.id)} className="text-red-500 ml-2"><Icons.Trash className="w-4 h-4"/></button></div>))}</div>
            <div className={`mt-auto pt-4 border-t ${theme === 'dark' ? 'border-neutral-800' : 'border-gray-200'}`}>
                {selectedCustomer ? (<div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 mb-3"><div className="flex items-center gap-2"><Icons.Users className="w-5 h-5 text-blue-500" /><div><p className="font-bold text-sm text-blue-500">{selectedCustomer.name}</p><p className="text-[10px] opacity-60">{selectedCustomer.phone || 'Sin teléfono'}</p></div></div><button onClick={() => {setSelectedCustomer(null); setPosCustomerSearch('')}} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg">✕</button></div>) : (<div className="relative mb-3 flex gap-2"><div className={`flex-1 flex items-center px-3 rounded-xl border ${inputClass}`}><Icons.Users className="w-5 h-5 opacity-30" /><input placeholder="Cliente (Opcional)" value={posCustomerSearch} onChange={(e) => setPosCustomerSearch(e.target.value)} className="w-full p-3 bg-transparent outline-none text-sm" /></div><button onClick={() => setIsAddingCustomer(true)} className="p-3 bg-blue-600 text-white rounded-xl"><Icons.Plus className="w-5 h-5" /></button>{posFilteredCustomers.length > 0 && (<div className={`absolute left-0 right-12 bottom-12 z-50 p-2 rounded-xl border shadow-xl max-h-40 overflow-y-auto ${theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'}`}>{posFilteredCustomers.map(c => (<div key={c.id} onClick={() => { setSelectedCustomer(c); setPosCustomerSearch(''); }} className={`p-2 rounded-lg cursor-pointer hover:bg-blue-500/10 flex justify-between`}><span className="font-bold text-xs">{c.name}</span><span className="text-[10px] opacity-50">{c.phone}</span></div>))}</div>)}</div>)}
                <div className="flex justify-between items-center mb-4"><span className="text-sm font-bold opacity-60">TOTAL</span><span className="text-3xl font-black text-blue-500">${cart.reduce((a,i)=>a+(i.price*i.qty),0).toFixed(2)}</span></div>
                <button onClick={handleCheckout} disabled={cart.length === 0} className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl active:scale-95 transition-transform ${cart.length === 0 ? 'bg-neutral-800 opacity-50' : 'bg-emerald-600'}`}>COBRAR</button>
            </div>
          </div>
        )}

        {activeTab === 'Suppliers' && ( <div className="space-y-4"><button onClick={() => setIsAddingSupplier(true)} className="w-full py-4 bg-blue-600 rounded-2xl font-bold text-white">+ Nuevo Proveedor</button><div className="space-y-2">{suppliers.map(s => (<div key={s.id} className={`p-4 rounded-2xl border flex justify-between ${bgCard}`}><div><p className="font-bold">{s.name}</p><p className="text-xs opacity-50">{s.contact} • {s.phone}</p></div><button onClick={() => { setConfirmModal({ isOpen: true, type: 'delete_supplier', id: s.id, message: "¿Borrar Proveedor?" }); }} className="text-rose-500"><Icons.Trash className="w-5 h-5"/></button></div>))}</div></div> )}
        {activeTab === 'Clients' && (<div className="space-y-4"><button onClick={() => setIsAddingCustomer(true)} className="w-full py-4 bg-blue-600 rounded-2xl font-bold text-white shadow-xl active:scale-95 transition-transform">+ {t('addClient')}</button><div className="space-y-2">{customers.map(c => (<div key={c.id} className={`p-4 rounded-2xl border flex justify-between items-center ${bgCard}`}><div><p className="font-bold text-sm">{c.name}</p></div><div className="flex gap-2"><button onClick={() => setEditingCustomer(c)} className="p-2"><Icons.Edit className="w-4 h-4"/></button>{['admin','owner'].includes(currentUser?.role?.toLowerCase()) && <button onClick={() => setConfirmModal({isOpen:true, type:'delete_customer', id:c.id, message:"¿Borrar?"})} className="text-rose-500"><Icons.Trash className="w-4 h-4"/></button>}</div></div>))}</div></div>)}
        {activeTab === 'Orders' && (<div className="space-y-4">{orders.map(order => (<div key={order.id} className={`p-4 border rounded-2xl flex justify-between items-center ${bgCard}`}><div><p className="font-bold text-sm">{order.patient}</p><p className={`text-[10px] font-bold uppercase ${order.status==='Voided'?'text-red-500':'text-green-500'}`}>{order.status === 'Voided' ? 'ANULADO' : 'COMPLETADO'}</p></div><div className="flex items-center gap-3"><span className="font-bold mr-2">${Number(order.total).toFixed(2)}</span><button onClick={() => {setIsTicketOpen(true); setLastOrder(order);}} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Icons.Print className="w-4 h-4"/></button><button onClick={() => setSelectedOrder(order)} className="p-2 bg-gray-500/10 text-gray-500 rounded-lg"><Icons.Eye className="w-4 h-4"/></button></div></div>))}</div>)}
        
        {activeTab === 'Settings' && (
            <div className="space-y-6">
                {['admin', 'owner', 'dueño'].includes((currentUser?.role || '').toLowerCase()) && (
                    <div className={`p-5 border rounded-3xl ${bgCard}`}>
                        <h3 className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] mb-4">Admin</h3>
                        <button onClick={exportToCSV} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3"><Icons.Download className="w-6 h-6" /> {t('exportCsv')}</button>
                        <button onClick={() => setIsStaffMgmt(true)} className={`w-full p-4 mt-2 rounded-2xl font-bold text-left flex justify-between items-center text-sm border ${theme==='dark'?'bg-black/40 border-neutral-800/50':'bg-gray-50 border-gray-200'}`}>{t('staffMgmt')} <span className="text-blue-500">→</span></button>
                        <button onClick={() => setIsBranchMgmt(true)} className={`w-full p-4 mt-2 rounded-2xl font-bold text-left flex justify-between items-center text-sm border ${theme==='dark'?'bg-black/40 border-neutral-800/50':'bg-gray-50 border-gray-200'}`}>Gestionar Sucursales <span className="text-blue-500">→</span></button>
                    </div>
                )}
                {/* CAMBIO DE CONTRASEÑA PARA TODOS */}
                <div className={`p-5 border rounded-3xl ${bgCard}`}><button onClick={() => setIsChangingPass(true)} className={`w-full p-4 rounded-2xl font-bold text-left flex justify-between items-center text-sm border ${theme==='dark'?'bg-black/40 border-neutral-800/50':'bg-gray-50 border-gray-200'}`}>{t('changePass')} <span className="text-blue-500">→</span></button></div>
                
                <div className={`p-5 border rounded-3xl ${bgCard}`}>
                    <h3 className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] mb-4">{t('language')}</h3>
                    <div className={`flex p-1 rounded-2xl border mb-3 ${theme==='dark'?'bg-black border-neutral-800':'bg-gray-100 border-gray-200'}`}><button onClick={() => setLanguage('EN')} className={`flex-1 py-3 rounded-xl font-bold text-xs ${language === 'EN' ? 'bg-blue-600 text-white' : 'opacity-40'}`}>English</button><button onClick={() => setLanguage('ES')} className={`flex-1 py-3 rounded-xl font-bold text-xs ${language === 'ES' ? 'bg-blue-600 text-white' : 'opacity-40'}`}>Español</button></div>
                    <div className={`flex p-1 rounded-2xl border ${theme==='dark'?'bg-black border-neutral-800':'bg-gray-100 border-gray-200'}`}><button onClick={() => setTheme('dark')} className={`flex-1 py-3 rounded-xl font-bold text-xs flex justify-center gap-2 ${theme === 'dark' ? 'bg-neutral-800 text-white' : 'opacity-40'}`}><Icons.Moon className="w-4 h-4"/> {t('darkMode')}</button><button onClick={() => setTheme('light')} className={`flex-1 py-3 rounded-xl font-bold text-xs flex justify-center gap-2 ${theme === 'light' ? 'bg-white text-black' : 'opacity-40'}`}><Icons.Sun className="w-4 h-4"/> {t('lightMode')}</button></div>
                </div>
                <div className={`p-5 border rounded-3xl ${bgCard}`}><button onClick={() => setConfirmModal({isOpen:true, type:'logout', message:t('logoutConfirm')})} className="w-full py-4 text-rose-500 font-bold border border-rose-500/20 rounded-2xl uppercase tracking-[0.15em] text-[10px] bg-rose-500/5 active:bg-rose-500/10">{t('logout')}</button></div>
            </div>
        )}
      </main>

      {/* --- MODAL DETALLES DEL PEDIDO (OJO) --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/90 z-[500] flex items-center justify-center p-6">
            <div className={`p-6 rounded-3xl border shadow-2xl max-w-sm w-full ${bgCard} relative`}>
                <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 p-2 bg-neutral-800/20 rounded-full">✕</button>
                <h2 className="text-xl font-bold mb-1">{t('orderDetails')}</h2>
                <p className="text-xs opacity-50 mb-4">ID: #{selectedOrder.id}</p>
                <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">{selectedOrder.items.map((item, i) => (<div key={i} className="flex justify-between text-sm border-b border-dashed border-neutral-700/30 pb-1"><span>{item.qty} x {item.name}</span><span className="font-bold">${(item.price * item.qty).toFixed(2)}</span></div>))}</div>
                <div className="flex justify-between items-center text-xl font-black mb-6"><span>Total</span><span>${Number(selectedOrder.total).toFixed(2)}</span></div>
                <div className="flex gap-2"><button onClick={() => { setIsTicketOpen(true); setLastOrder(selectedOrder); }} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm">Imprimir</button>{['admin','owner'].includes(currentUser?.role?.toLowerCase()) && selectedOrder.status !== 'Voided' && (<button onClick={() => setConfirmModal({isOpen:true, type:'void_order', id:selectedOrder.id, message:"¿ANULAR VENTA? Se devolverá el stock."})} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold">Anular</button>)}</div>
            </div>
        </div>
      )}

      {/* --- MODAL CONFIRMACIÓN LOGOUT GRANDE --- */}
      {confirmModal.isOpen && (<div className="fixed inset-0 bg-black/95 z-[600] flex items-center justify-center p-8"><div className={`p-8 rounded-3xl border text-center w-full max-w-sm ${bgCard}`}><h3 className="text-2xl font-bold mb-8">{confirmModal.message}</h3><div className="flex gap-4"><button onClick={() => setConfirmModal({...confirmModal, isOpen:false})} className="flex-1 py-4 bg-gray-600 rounded-2xl text-white font-bold">{t('no')}</button><button onClick={() => { if(confirmModal.type==='void_order') handleVoidOrder(); else if(confirmModal.type==='delete_supplier') genericDelete(`/suppliers/${confirmModal.id}`, "Eliminado"); else if(confirmModal.type==='delete_branch') genericDelete(`/branches/${confirmModal.id}`, "Eliminado"); else executeDelete(); }} className="flex-1 py-4 bg-red-600 rounded-2xl text-white font-bold">{t('yes')}</button></div></div></div>)}

      {/* --- MODAL SUCURSALES (NUEVO) --- */}
      {(isBranchMgmt || isAddingBranch) && (
        <div className="fixed inset-0 bg-black/95 z-[250] flex items-center justify-center p-6">
            <div className={`w-full max-w-sm p-6 rounded-3xl border ${bgCard}`}>
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => { setIsBranchMgmt(false); setIsAddingBranch(false); }} className="p-2 rounded-full bg-gray-500/20"><Icons.Back className="w-5 h-5"/></button>
                    <h2 className="text-xl font-bold">{isBranchMgmt ? "Sucursales" : "Nueva Sucursal"}</h2>
                </div>
                {isBranchMgmt ? (
                    <div><div className="space-y-2 mb-4 max-h-60 overflow-y-auto">{branches.map(b => (<div key={b.id} className="flex justify-between p-3 border rounded-xl items-center"><div><p className="font-bold text-sm">{b.name}</p><p className="text-[10px] opacity-50">{b.address}</p></div><button onClick={()=>setConfirmModal({isOpen:true, type:'delete_branch', id:b.id, message:"¿Borrar Sucursal?"})} className="p-2 bg-red-500/10 text-red-500 rounded-lg"><Icons.Trash className="w-4 h-4"/></button></div>))}</div><button type="button" onClick={()=>{setIsAddingBranch(true); setIsBranchMgmt(false);}} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg">+ Nueva Sucursal</button></div>
                ) : (
                    <form onSubmit={addBranch} className="space-y-4">
                        <input name="name" required placeholder="Nombre Sucursal" className={`w-full p-4 rounded-xl border outline-none ${inputClass}`} />
                        <input name="address" placeholder="Dirección" className={`w-full p-4 rounded-xl border outline-none ${inputClass}`} />
                        <input name="phone" placeholder="Teléfono" className={`w-full p-4 rounded-xl border outline-none ${inputClass}`} />
                        <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg">Guardar</button>
                    </form>
                )}
            </div>
        </div>
      )}

      {/* --- MODAL DE GESTION DE PERSONAL (MEJORADO) --- */}
      {(isStaffMgmt || isAddingStaff || editingStaff || isChangingPass) && (
        <div className="fixed inset-0 bg-black/95 z-[250] flex items-center justify-center p-6">
            <div className={`w-full max-w-sm p-6 rounded-3xl border ${bgCard}`}>
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => { setIsStaffMgmt(false); setIsAddingStaff(false); setEditingStaff(null); setIsChangingPass(false); }} className="p-2 rounded-full bg-gray-500/20"><Icons.Back className="w-5 h-5"/></button>
                    <h2 className="text-xl font-bold">{isChangingPass ? "Cambiar Contraseña" : (isStaffMgmt ? "Gestión de Personal" : (isAddingStaff ? "Nuevo Empleado" : "Editar Empleado"))}</h2>
                </div>
                {isStaffMgmt ? (
                    <div><div className="space-y-2 mb-4 max-h-60 overflow-y-auto">{staffList.map(s => (<div key={s.id} className="flex justify-between p-3 border rounded-xl items-center"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-xs">{s.name.charAt(0)}</div><div><p className="font-bold text-sm">{s.name}</p><p className="text-[10px] opacity-50 uppercase">{s.role}</p></div></div><div className="flex gap-2"><button onClick={()=>{setEditingStaff(s); setIsStaffMgmt(false);}} className="p-2 bg-gray-500/10 rounded-lg"><Icons.Edit className="w-4 h-4"/></button>{s.username !== 'admin' && <button onClick={()=>setConfirmModal({isOpen:true, type:'delete_staff', id:s.id, message:"¿Eliminar Empleado?"})} className="p-2 bg-red-500/10 text-red-500 rounded-lg"><Icons.Trash className="w-4 h-4"/></button>}</div></div>))}</div><button type="button" onClick={()=>{setIsAddingStaff(true); setIsStaffMgmt(false);}} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg">+ Añadir Empleado</button></div>
                ) : (
                    <form onSubmit={isAddingStaff ? addStaffMember : handleUpdateStaff} className="space-y-4">
                        {!isChangingPass && (<><input name="name" defaultValue={editingStaff?.name} required placeholder="Nombre Completo" className={`w-full p-4 rounded-xl border outline-none ${inputClass}`} /><select name="role" defaultValue={editingStaff?.role} className={`w-full p-4 rounded-xl border outline-none ${inputClass}`}><option value="Pharmacist">Farmacéutico</option><option value="Cashier">Cajero</option><option value="Staff">Personal</option></select><input name="username" defaultValue={editingStaff?.username} required placeholder="Nombre de Usuario" className={`w-full p-4 rounded-xl border outline-none ${inputClass}`} /></>)}
                        <input name="password" type="password" placeholder="Nueva Contraseña" className={`w-full p-4 rounded-xl border outline-none ${inputClass}`} />
                        <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg">Guardar Cambios</button>
                    </form>
                )}
            </div>
        </div>
      )}

      {/* --- OTROS MODALES --- */}
      {cashModal.isOpen && (<div className="fixed inset-0 bg-black/95 z-[500] flex items-center justify-center p-6"><form onSubmit={handleCashAction} className={`p-6 rounded-3xl border w-full max-w-xs ${bgCard}`}><h2 className="text-xl font-bold mb-2">{cashModal.type === 'open' ? '🟢 ABRIR TURNO' : '🔴 CERRAR TURNO'}</h2><input name="amount" type="number" step="0.01" autoFocus required className={`w-full p-4 text-2xl font-black text-center rounded-xl border mb-4 ${inputClass}`} /><button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold">CONFIRMAR</button><button type="button" onClick={() => setCashModal({isOpen:false})} className="w-full mt-2 py-3 text-sm opacity-50">Cancelar</button></form></div>)}
      {(isAddingSupplier || editingSupplier) && (<div className="fixed inset-0 bg-black/95 z-[250] flex items-center justify-center p-6"><form onSubmit={async (e) => { e.preventDefault(); const fd = new FormData(e.target); const body = { name: fd.get('name'), contact: fd.get('contact'), phone: fd.get('phone'), address: fd.get('address') }; if(editingSupplier) await genericPut(`/suppliers/${editingSupplier.id}`, body, "Actualizado"); else await genericPost('/suppliers', body, "Creado"); setIsAddingSupplier(false); setEditingSupplier(null); }} className={`w-full max-w-sm space-y-4 p-6 rounded-3xl border ${bgCard}`}><h2 className="text-xl font-bold">Proveedor</h2><input name="name" defaultValue={editingSupplier?.name} required placeholder="Empresa" className={`w-full p-4 rounded-xl border ${inputClass}`} /><input name="contact" defaultValue={editingSupplier?.contact} placeholder="Contacto" className={`w-full p-4 rounded-xl border ${inputClass}`} /><input name="phone" defaultValue={editingSupplier?.phone} placeholder="Teléfono" className={`w-full p-4 rounded-xl border ${inputClass}`} /><input name="address" defaultValue={editingSupplier?.address} placeholder="Dirección" className={`w-full p-4 rounded-xl border ${inputClass}`} /><div className="flex gap-2"><button type="button" onClick={()=>{setIsAddingSupplier(false);setEditingSupplier(null)}} className="flex-1 py-3 bg-gray-600 rounded-xl text-white">Cancelar</button><button className="flex-1 py-3 bg-blue-600 rounded-xl text-white font-bold">Guardar</button></div></form></div>)}
      {(isAddingMed || editingItem) && (<div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[250] flex items-center justify-center p-6"><form onSubmit={editingItem ? updateMedication : addMedication} className={`w-full max-w-sm space-y-4 p-6 rounded-3xl border shadow-2xl ${bgCard}`}><h2 className="text-xl font-bold">{editingItem ? "Editar" : "Nuevo"} Producto</h2><input name="name" defaultValue={editingItem?.name} required placeholder="Nombre" className={`w-full p-4 rounded-xl border ${inputClass}`} /><select name="category" defaultValue={editingItem?.category} className={`w-full p-4 rounded-xl border ${inputClass}`}>{Object.keys(categoryTranslations).map(cat => <option key={cat} value={cat}>{categoryTranslations[cat][language]}</option>)}</select><div className="grid grid-cols-2 gap-2"><input name="stock" defaultValue={editingItem?.stock} type="number" required placeholder="Stock" className={`w-full p-4 rounded-xl border ${inputClass}`} /><input name="price" defaultValue={editingItem?.price} type="number" step="0.01" required placeholder="Precio" className={`w-full p-4 rounded-xl border ${inputClass}`} /></div><input name="expiry" defaultValue={editingItem ? editingItem.expiryDate?.split('T')[0] : ''} type="date" required className={`w-full p-4 rounded-xl border ${inputClass}`} /><div className="flex gap-4 pt-2"><button type="button" onClick={() => {setIsAddingMed(false); setEditingItem(null)}} className="flex-1 py-4 font-bold opacity-40 text-sm">Cancelar</button><button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold text-sm">Guardar</button></div></form></div>)}
      {(isAddingCustomer || editingCustomer) && (<div className="fixed inset-0 bg-black/95 z-[250] flex items-center justify-center p-6"><form onSubmit={editingCustomer ? updateCustomer : addCustomer} className={`w-full max-w-sm space-y-4 p-6 rounded-3xl border ${bgCard}`}><h2 className="text-xl font-bold">{editingCustomer ? "Editar Cliente" : "Nuevo Cliente"}</h2><input name="name" defaultValue={editingCustomer?.name} required placeholder={t('name')} className={`w-full p-4 rounded-xl border ${inputClass}`} /><input name="phone" defaultValue={editingCustomer?.phone} placeholder="Teléfono" className={`w-full p-4 rounded-xl border ${inputClass}`} /><input name="address" defaultValue={editingCustomer?.address} placeholder="Dirección" className={`w-full p-4 rounded-xl border ${inputClass}`} /><input name="rnc" defaultValue={editingCustomer?.rnc} placeholder="RNC / Cédula" className={`w-full p-4 rounded-xl border ${inputClass}`} /><div className="flex gap-2"><button type="button" onClick={()=>{setIsAddingCustomer(false);setEditingCustomer(null)}} className="flex-1 py-3 bg-gray-600 text-white rounded-xl">Cancelar</button><button className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold">Guardar</button></div></form></div>)}
      
      {/* TICKET MODAL GRANDE (58mm reales en pantalla) */}
      {isTicketOpen && lastOrder && (
        <div className="fixed inset-0 bg-black/90 z-[500] flex items-center justify-center p-4">
          <div className="bg-white text-black w-full max-w-xs p-0 rounded-sm shadow-2xl relative">
            <button onClick={()=>setIsTicketOpen(false)} className="absolute -top-10 right-0 text-white no-print">X</button>
            <div id="print-area" className="font-mono p-4 text-[12px] leading-tight w-full mx-auto bg-white text-black">
              <div className="text-center mb-4 border-b-2 border-dashed border-black pb-2">
                  <h2 className="text-2xl font-black uppercase">PHARMAPRO</h2>
                  <p>Sucursal Centro</p>
                  <p>RNC: 101-555-999</p>
                  <p>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
              </div>
              <div className="mb-2 border-b-2 border-dashed border-black pb-2">
                  <p><b>Cliente:</b> {lastOrder.patient}</p>
                  <p><b>Ticket #:</b> {lastOrder.id}</p>
                  <p><b>Cajero:</b> {currentUser?.name}</p>
                  <p><b>DTE/Reg:</b> _________________</p>
              </div>
              <table className="w-full mb-4 border-b-2 border-dashed border-black pb-2">
                  <thead><tr className="text-left"><th>Cant</th><th>Item</th><th className="text-right">$$</th></tr></thead>
                  <tbody>{lastOrder.items.map((item, i) => (<tr key={i}><td className="align-top pt-1">{item.qty}</td><td className="align-top pt-1">{item.name.substring(0, 15)}</td><td className="text-right align-top pt-1">{(item.price * item.qty).toFixed(2)}</td></tr>))}</tbody>
              </table>
              <div className="flex justify-between text-2xl font-black mb-2"><span>TOTAL</span><span>${Number(lastOrder.total).toFixed(2)}</span></div>
              <div className="text-center mt-6 border-t-2 border-dashed border-black pt-2">
                  <p>*** GRACIAS POR SU COMPRA ***</p>
                  <p className="mt-2 text-[10px]">Sistema PharmaPro v10.1</p>
              </div>
            </div>
            <button onClick={()=>window.print()} className="w-full py-4 bg-black text-white font-bold no-print">IMPRIMIR</button>
          </div>
        </div>
      )}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} labels={translations[language]} theme={theme} role={currentUser?.role} />
    </div>
  );
};

export default App;