import React, { useState, useMemo, useEffect, useRef } from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

// --- ICONOS ---
const Icons = {
  Edit: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Trash: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Dashboard: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" /></svg>,
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
  Print: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>,
  Users: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Phone: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Map: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Bolt: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> // Nuevo Icono Scanner
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
    <div onClick={onClick} className={`p-4 rounded-2xl border ${colors[variant]} flex flex-col ${onClick ? 'cursor-pointer active:scale-95 transition-transform hover:opacity-80' : ''}`}>
      <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</span>
      <span className="text-2xl font-black tracking-tight">{value}</span>
    </div>
  );
};

const BottomNav = ({ activeTab, onTabChange, labels, theme, role }) => {
  let tabs = [];
  if (!role) return null;

  const r = role.toLowerCase();

  if (r === 'cashier' || r === 'cajero' || r === 'staff') {
    tabs = [
      { id: 'POS', icon: Icons.Cart, label: "Caja" },
      { id: 'Clients', icon: Icons.Users, label: labels.Clients },
      { id: 'Settings', icon: Icons.Settings, label: labels.Settings },
    ];
  } else if (r === 'pharmacist' || r === 'farmaceutico' || r === 'farmacéutico') {
    tabs = [
      { id: 'POS', icon: Icons.Cart, label: "Caja" },
      { id: 'Inventory', icon: Icons.Inventory, label: labels.Inventory },
      { id: 'Orders', icon: Icons.Orders, label: labels.Orders },
      { id: 'Clients', icon: Icons.Users, label: labels.Clients }, 
      { id: 'Settings', icon: Icons.Settings, label: labels.Settings },
    ];
  } else {
    tabs = [
      { id: 'Dashboard', icon: Icons.Dashboard, label: labels.Dashboard },
      { id: 'POS', icon: Icons.Cart, label: "Caja" },
      { id: 'Inventory', icon: Icons.Inventory, label: labels.Inventory },
      { id: 'Clients', icon: Icons.Users, label: labels.Clients }, 
      { id: 'Orders', icon: Icons.Orders, label: labels.Orders },
      { id: 'Settings', icon: Icons.Settings, label: labels.Settings },
    ];
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto ${theme === 'dark' ? 'bg-black/90 border-neutral-800' : 'bg-white/90 border-gray-200'} backdrop-blur-xl border-t p-2 pb-6 flex justify-around items-center z-50`}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button key={tab.id} onClick={() => onTabChange(tab.id)} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${isActive ? 'text-blue-500 scale-110' : (theme === 'dark' ? 'text-neutral-500 hover:text-neutral-300' : 'text-gray-400 hover:text-gray-600')}`}>
            <Icon className="w-6 h-6" />
            <span className="text-[9px] font-bold uppercase tracking-wider">{tab.label}</span>
            {isActive && <div className="w-1 h-1 bg-blue-500 rounded-full mt-1 animate-pulse" />}
          </button>
        );
      })}
    </div>
  );
};

const categoryTranslations = { "Antibiotic": { EN: "Antibiotic", ES: "Antibiótico" }, "Analgesic": { EN: "Analgesic", ES: "Analgésico" }, "Cardiac": { EN: "Cardiac", ES: "Cardíaco" }, "Diabetes": { EN: "Diabetes", ES: "Diabetes" }, "Statins": { EN: "Statins", ES: "Estatinas" }, "Misc": { EN: "Misc", ES: "Varios" } };
const roleTranslations = { "Owner": { EN: "Owner", ES: "Dueño" }, "Pharmacist": { EN: "Pharmacist", ES: "Farmacéutico" }, "Cashier": { EN: "Cashier", ES: "Cajero" }, "Staff": { EN: "Staff", ES: "Personal" }, "Admin": { EN: "Admin", ES: "Admin" } };
const translations = {
  EN: { dashboard: "Dashboard", inventory: "Inventory", orders: "Orders", settings: "Settings", todaySales: "Total Sales", pendingPresc: "Pending Orders", lowStock: "Low Stock Alerts", addMed: "Add Medication", save: "Save Changes", login: "Login", username: "Username", password: "Password", invalid: "Invalid Credentials", searchPlaceholder: "Search medication...", units: "units", logout: "Sign Out", logoutConfirm: "Are you sure you want to log out?", cancel: "Cancel", manageStock: "MANAGE STOCK", details: "DETAILS", pending: "PENDING", changePass: "Change Password", currPass: "Current Password", newPass: "New Password", confirmPass: "Confirm New Password", passUpdated: "Password updated successfully!", passMismatch: "New passwords do not match!", wrongPass: "Incorrect current password!", staffMgmt: "Staff Permissions", security: "Security", addStaff: "Add New Employee", productDeleted: "Product deleted!", deleteConfirm: "Are you sure you want to delete this item?", removeStaffConfirm: "Remove this employee access?", price: "Price", medName: "Medication Name", exportCsv: "Export Inventory (CSV)", completeOrder: "Complete Order", orderCompleted: "Order Completed!", editStaff: "Edit Staff", role: "Role", name: "Name", orderDetails: "Order Details", items: "Items", qty: "Qty", subtotal: "Subtotal", salesHistory: "Sales History", userUser: "Username", userPass: "Password", darkMode: "Dark Mode", lightMode: "Light Mode", language: "Language", editMed: "Edit Medication", all: "All", lowStockFilter: "Low Stock Only", expired: "EXPIRED", expiresSoon: "Expires Soon", expiredCount: "Expired Items", warningCount: "Expiring Soon", criticalAlert: "CRITICAL ALERTS", checkout: "Checkout", cart: "Cart", emptyCart: "Empty Cart", addToCart: "Add", customer: "Customer Name", clients: "Clients", addClient: "Add Client", phone: "Phone", address: "Address", taxId: "Tax ID / RNC", noClients: "No registered clients", close: "Close", scannerMode: "Scanner Mode" },
  ES: { dashboard: "Panel", inventory: "Inventario", orders: "Pedidos", settings: "Ajustes", todaySales: "Ventas Totales", pendingPresc: "Pedidos Pendientes", lowStock: "Alertas Stock Bajo", addMed: "Añadir Medicamento", save: "Guardar Cambios", login: "Iniciar Sesión", username: "Usuario", password: "Contraseña", invalid: "Credenciales Inválidas", searchPlaceholder: "Buscar medicamento...", units: "unidades", logout: "Cerrar Sesión", logoutConfirm: "¿Cerrar sesión y salir?", cancel: "Cancelar", manageStock: "GESTIONAR STOCK", details: "DETALLES", pending: "PENDIENTE", changePass: "Cambiar Contraseña", currPass: "Contraseña Actual", newPass: "Nueva Contraseña", confirmPass: "Confirmar Nueva", passUpdated: "¡Contraseña actualizada!", passMismatch: "¡Las contraseñas no coinciden!", wrongPass: "¡Contraseña incorrecta!", staffMgmt: "Gestión de Personal", security: "Seguridad", addStaff: "Añadir Empleado", productDeleted: "¡Producto eliminado!", deleteConfirm: "¿Eliminar este medicamento?", removeStaffConfirm: "¿Eliminar acceso de empleado?", price: "Precio", medName: "Nombre Medicamento", exportCsv: "Exportar Inventario (CSV)", completeOrder: "Completar Pedido", orderCompleted: "¡Pedido Completado!", editStaff: "Editar Empleado", role: "Rol", name: "Nombre", orderDetails: "Detalles del Pedido", items: "Artículos", qty: "Cant", subtotal: "Subtotal", salesHistory: "Historial de Ventas", userUser: "Usuario Acceso", userPass: "Contraseña Acceso", darkMode: "Modo Oscuro", lightMode: "Modo Claro", language: "Idioma", editMed: "Editar Medicamento", all: "Todo", lowStockFilter: "Solo Stock Bajo", expired: "VENCIDO", expiresSoon: "Vence pronto", expiredCount: "Vencidos", warningCount: "Por Vencer", criticalAlert: "ALERTAS CRÍTICAS", checkout: "Cobrar", cart: "Carrito", emptyCart: "Carrito Vacío", addToCart: "Agregar", customer: "Nombre Cliente (Opcional)", clients: "Clientes", addClient: "Añadir Cliente", phone: "Teléfono", address: "Dirección", taxId: "RNC / Cédula", noClients: "No hay clientes registrados", close: "Cerrar", scannerMode: "Modo Escáner" }
};

const App = () => {
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
  const [chartData, setChartData] = useState([]); 
  const [currentUser, setCurrentUser] = useState(null);

  const [cart, setCart] = useState([]);
  const [posSearch, setPosSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null); 
  const [posCustomerSearch, setPosCustomerSearch] = useState('');
  const [scannerMode, setScannerMode] = useState(false); // --- NUEVO: MODO ESCANER
  
  const [lastOrder, setLastOrder] = useState(null);

  const [editingItem, setEditingItem] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null); 
  const [isAddingMed, setIsAddingMed] = useState(false);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false); 
  const [isStaffMgmt, setIsStaffMgmt] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, id: null, message: '' });

  const searchInputRef = useRef(null); // Ref para el foco del scanner

  const t = (key) => translations[language][key] || key;
  const showToast = (message) => { setToast({ message, visible: true }); setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000); };

  const resetFilters = () => { setFilterCategory('All'); setFilterLowStock(false); setFilterExpiry('All'); setSearchQuery(''); };

  // --- FUNCIÓN EXPORTAR CSV (MOVIDA A SETTINGS) ---
  const exportToCSV = () => {
    const headers = ["Nombre,Categoria,Stock,Precio,Vencimiento"];
    const rows = inventory.map(item =>
        `"${item.name}","${item.category}",${item.stock},${item.price},${item.expiryDate ? item.expiryDate.split('T')[0] : ''}`
    );
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `inventario_pharmapro_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getExpiryStatus = (dateString) => {
    if (!dateString) return 'good';
    const today = new Date();
    const expiry = new Date(dateString);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'expired';
    if (diffDays < 90) return 'warning';
    return 'good';
  };

  const loadAllData = () => {
    fetch(`${API_URL}/inventory`).then(r => r.json()).then(setInventory).catch(console.error);
    fetch(`${API_URL}/users`).then(r => r.json()).then(setStaffList).catch(console.error);
    fetch(`${API_URL}/orders`).then(r => r.json()).then(setOrders).catch(console.error);
    fetch(`${API_URL}/customers`).then(r => r.json()).then(setCustomers).catch(console.error); 
    fetch(`${API_URL}/stats/weekly`).then(r => r.json()).then(setChartData).catch(console.error);
  };

  useEffect(() => { if(isLoggedIn) loadAllData(); }, [isLoggedIn]);

  // --- EFECTO PARA MANTENER FOCO EN ESCANER ---
  useEffect(() => {
    if (activeTab === 'POS' && scannerMode && searchInputRef.current) {
        searchInputRef.current.focus();
    }
  }, [activeTab, scannerMode, cart]);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        if (exists.qty >= product.stock) { showToast("¡Stock insuficiente!"); return prev; }
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
  const updateCartQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        if (newQty < 1) return item;
        const original = inventory.find(i => i.id === id);
        if (newQty > original.stock) { showToast("¡Stock máximo alcanzado!"); return item; }
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  // --- LOGICA DEL ESCANER ---
  const handleScannerInput = (e) => {
    if (e.key === 'Enter' && scannerMode) {
        // Buscar el producto que coincida (asumiendo que escanea el nombre o un ID exacto)
        // Nota: Idealmente en el futuro agregar campo 'barcode' a la DB
        const match = inventory.find(i => i.name.toLowerCase() === posSearch.toLowerCase() || i.id.toString() === posSearch);
        
        if (match) {
            addToCart(match);
            setPosSearch(''); // Limpiar para el siguiente escaneo
            showToast(`Escanedo: ${match.name}`);
        } else {
            // Si no es exacto, intentar tomar el primero de la lista filtrada
            if (posFilteredInventory.length > 0) {
                addToCart(posFilteredInventory[0]);
                setPosSearch('');
                showToast(`Escanedo: ${posFilteredInventory[0].name}`);
            } else {
                showToast("Producto no encontrado");
            }
        }
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const patientName = selectedCustomer ? selectedCustomer.name : (posCustomerSearch || "Cliente General");
    const orderData = { 
        patient: patientName, 
        customerId: selectedCustomer ? selectedCustomer.id : null,
        items: cart, 
        total 
    };
    try {
      const res = await fetch(`${API_URL}/sale`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      if (data.success) {
        setLastOrder({ ...orderData, id: Math.floor(Math.random() * 10000), date: new Date().toLocaleDateString() });
        setCart([]); setSelectedCustomer(null); setPosCustomerSearch(''); setIsTicketOpen(true); loadAllData(); showToast("¡Venta Exitosa!");
      } else { alert("Error en la venta: " + JSON.stringify(data)); }
    } catch (err) { alert("Error de conexión"); }
  };

  const handleReprint = (order) => { setLastOrder(order); setIsTicketOpen(true); };

  const handleLogin = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: fd.get('user'), pass: fd.get('pass') })
        });
        const data = await res.json();
        if (data.success) {
            setIsLoggedIn(true);
            setCurrentUser(data.user);
            const r = (data.user.role || '').toLowerCase();
            if (r === 'cashier' || r === 'cajero' || r === 'staff') { setActiveTab('POS'); } else { setActiveTab('Dashboard'); }
            showToast(`Bienvenido ${data.user.name}`);
        } else { alert(t('invalid')); }
    } catch (err) { alert('Error de conexión'); }
  };

  const updateMedication = async (e) => { e.preventDefault(); const fd = new FormData(e.target); await fetch(`${API_URL}/inventory/${editingItem.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: fd.get('name'), category: fd.get('category'), stock: parseInt(fd.get('stock')), price: parseFloat(fd.get('price')), expiryDate: fd.get('expiry') }) }); loadAllData(); setEditingItem(null); showToast(t('save')); };
  const addMedication = async (e) => { e.preventDefault(); const fd = new FormData(e.target); await fetch(`${API_URL}/inventory`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: fd.get('name'), category: fd.get('category'), stock: parseInt(fd.get('stock')), price: parseFloat(fd.get('price')), expiryDate: fd.get('expiry') }) }); loadAllData(); setIsAddingMed(false); showToast(t('save')); };
  
  const addCustomer = async (e) => { e.preventDefault(); const fd = new FormData(e.target); await fetch(`${API_URL}/customers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: fd.get('name'), phone: fd.get('phone'), address: fd.get('address'), rnc: fd.get('rnc') }) }); loadAllData(); setIsAddingCustomer(false); 
    if(activeTab === 'POS') { setPosCustomerSearch(fd.get('name')); }
    showToast("Cliente Agregado"); 
  };
  const updateCustomer = async (e) => { e.preventDefault(); const fd = new FormData(e.target); await fetch(`${API_URL}/customers/${editingCustomer.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: fd.get('name'), phone: fd.get('phone'), address: fd.get('address'), rnc: fd.get('rnc') }) }); loadAllData(); setEditingCustomer(null); showToast("Cliente Actualizado"); };

  const handleUpdateStaff = async (e) => { e.preventDefault(); const fd = new FormData(e.target); const userId = editingStaff ? (editingStaff.id || editingStaff.ID) : (currentUser.id || currentUser.ID); await fetch(`${API_URL}/users/${userId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: fd.get('name') || currentUser.name, role: fd.get('role') || currentUser.role, username: fd.get('username') || currentUser.username, password: fd.get('password') }) }); loadAllData(); setEditingStaff(null); setIsChangingPass(false); showToast(t('passUpdated')); };
  const addStaffMember = async (e) => { e.preventDefault(); const fd = new FormData(e.target); await fetch(`${API_URL}/users`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: fd.get('name'), role: fd.get('role'), username: fd.get('username'), password: fd.get('password') }) }); loadAllData(); setIsAddingStaff(false); showToast("Empleado Registrado"); };
  
  const executeDelete = async () => { 
      const { type, id } = confirmModal; 
      if (type === 'delete_product') { await fetch(`${API_URL}/inventory/${id}`, { method: 'DELETE' }); showToast(t('productDeleted')); } 
      else if (type === 'delete_staff') { await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' }); showToast("Personal eliminado"); } 
      else if (type === 'delete_customer') { await fetch(`${API_URL}/customers/${id}`, { method: 'DELETE' }); showToast("Cliente eliminado"); }
      else if (type === 'complete_order') { await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' }); showToast(t('orderCompleted')); } 
      else if (type === 'logout') { setIsLoggedIn(false); setActiveTab('Dashboard'); } 
      loadAllData(); setConfirmModal({ isOpen: false, type: null }); 
  };

  const goToFilter = (type) => { setActiveTab('Inventory'); resetFilters(); if (type === 'expired') setFilterExpiry('expired'); if (type === 'warning') setFilterExpiry('warning'); if (type === 'lowStock') setFilterLowStock(true); };
  const goToItem = (itemName) => { setActiveTab('Inventory'); resetFilters(); setSearchQuery(itemName); };

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      if (!item) return false;
      const q = searchQuery.toLowerCase();
      const itemName = (item.name || '').toLowerCase();
      const matchesSearch = itemName.includes(q);
      const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
      const matchesStock = filterLowStock ? item.stock <= (item.threshold || 10) : true;
      const matchesExpiry = filterExpiry === 'All' || getExpiryStatus(item.expiryDate) === filterExpiry;
      return matchesSearch && matchesCategory && matchesStock && matchesExpiry;
    });
  }, [inventory, searchQuery, filterCategory, filterLowStock, filterExpiry, language]);

  const posFilteredInventory = useMemo(() => {
    if (!posSearch) return [];
    return inventory.filter(item => (item.name || '').toLowerCase().includes(posSearch.toLowerCase()) && item.stock > 0);
  }, [inventory, posSearch]);

  const posFilteredCustomers = useMemo(() => {
    if (!posCustomerSearch || selectedCustomer) return [];
    return customers.filter(c => c.name.toLowerCase().includes(posCustomerSearch.toLowerCase()));
  }, [customers, posCustomerSearch, selectedCustomer]);

  const bgMain = theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-gray-900';
  const bgCard = theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200 shadow-sm';
  const inputClass = theme === 'dark' ? 'bg-black border-neutral-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900';

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 font-sans ${bgMain}`}>
        <div className="w-full max-w-sm space-y-8 text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl mb-6"><span className="text-4xl font-black italic text-white">P+</span></div>
          <h1 className="text-2xl font-bold">{t('login')}</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input name="user" required placeholder={t('username')} className={`w-full p-4 rounded-2xl border outline-none focus:border-blue-500 ${inputClass}`} />
            <input name="pass" type="password" required placeholder={t('password')} className={`w-full p-4 rounded-2xl border outline-none focus:border-blue-500 ${inputClass}`} />
            <button type="submit" className="w-full py-4 bg-blue-600 rounded-2xl font-bold text-white shadow-lg active:scale-95">{t('login')}</button>
          </form>
          <div className="flex justify-center gap-6 text-[10px] font-black opacity-60">
            <button onClick={() => setLanguage('EN')}>ENGLISH</button><button onClick={() => setLanguage('ES')}>ESPAÑOL</button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-white gap-4"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div><p className="font-bold animate-pulse">Cargando...</p></div>;
  }

  const expiredItems = inventory.filter(i => getExpiryStatus(i.expiryDate) === 'expired');
  const warningItems = inventory.filter(i => getExpiryStatus(i.expiryDate) === 'warning');
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className={`h-screen flex flex-col font-sans max-w-md mx-auto relative overflow-hidden ${bgMain}`}>
      <style>{`@media print { body * { visibility: hidden; } #print-area, #print-area * { visibility: visible; } #print-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; background-color: white; color: black; } .no-print, button { display: none !important; } @page { size: auto; margin: 0mm; } }`}</style>
      <header className={`flex-shrink-0 px-6 py-4 border-b flex items-center justify-between backdrop-blur-md z-40 ${theme === 'dark' ? 'border-neutral-900 bg-black/50' : 'border-gray-200 bg-white/50'}`}>
        <div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><span className="text-xl font-bold italic text-white">P+</span></div><h1 className="text-lg font-bold">PharmaPro</h1></div>
        <div className="text-xs text-right opacity-50"><p>{currentUser?.name}</p><p className="uppercase font-bold text-[10px]">{roleTranslations[currentUser?.role]?.[language] || currentUser?.role}</p></div>
      </header>
      <main className="flex-1 overflow-y-auto px-6 pt-6 pb-24 scroll-smooth">
        {activeTab === 'Dashboard' && (
          <div className="space-y-6">
            <StatCard label={t('todaySales')} value={`$${chartData.length > 0 ? chartData[chartData.length - 1].v : '0'}`} variant="green" theme={theme} />
            <div className="grid grid-cols-2 gap-4">
              <StatCard label={t('expiredCount')} value={expiredItems.length} variant="red" onClick={() => goToFilter('expired')} theme={theme} />
              <StatCard label={t('warningCount')} value={warningItems.length} variant="yellow" onClick={() => goToFilter('warning')} theme={theme} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StatCard label={t('pendingPresc')} value={orders.length} variant="blue" onClick={() => setActiveTab('Orders')} theme={theme} />
              <StatCard label={t('lowStock')} value={inventory.filter(i => i.stock <= (i.threshold || 10)).length} variant="orange" onClick={() => goToFilter('lowStock')} theme={theme} />
            </div>
            <div className={`p-4 rounded-2xl border ${bgCard}`}><h3 className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-4">{t('salesHistory')}</h3><ResponsiveContainer width="100%" height={180}><BarChart data={chartData.length > 0 ? chartData : [{day:'-',v:0}]}><XAxis dataKey="day" stroke={theme === 'dark' ? '#555' : '#ccc'} fontSize={12} tickLine={false} axisLine={false} /><Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: theme === 'dark' ? '#171717' : '#fff', border: '1px solid #333', borderRadius: '8px', fontSize: '12px', color: theme === 'dark' ? '#fff' : '#000' }} /><Bar dataKey="v" fill="#3b82f6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
          </div>
        )}

        {activeTab === 'POS' && (
          <div className="space-y-4 h-full flex flex-col">
            {/* BUSCADOR CON MODO ESCANER */}
            <div className="flex gap-2 items-center">
                <div className={`flex-1 flex items-center px-4 rounded-2xl border flex-shrink-0 transition-all ${scannerMode ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-500/10' : inputClass}`}>
                    <Icons.Search className={`w-5 h-5 ${scannerMode ? 'text-blue-500' : 'opacity-50'}`} />
                    <input 
                        ref={searchInputRef}
                        placeholder={scannerMode ? "ESCANEA CÓDIGO AHORA..." : "Buscar para vender..."} 
                        value={posSearch} 
                        onChange={(e) => setPosSearch(e.target.value)} 
                        onKeyDown={handleScannerInput} // ESCUCHA EL ENTER DEL ESCANER
                        className="w-full p-4 bg-transparent outline-none" 
                        autoFocus 
                    />
                </div>
                <button onClick={() => setScannerMode(!scannerMode)} className={`p-4 rounded-2xl border transition-all ${scannerMode ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105' : 'bg-transparent text-gray-500 border-gray-500/30'}`}>
                    <Icons.Bolt className="w-6 h-6" />
                </button>
            </div>
            
            {posSearch && !scannerMode && (
              <div className={`absolute left-6 right-6 top-32 z-50 p-2 rounded-2xl border max-h-60 overflow-y-auto shadow-2xl ${theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'}`}>
                {posFilteredInventory.map(item => (
                  <div key={item.id} onClick={() => { addToCart(item); setPosSearch(''); }} className={`p-3 rounded-xl flex justify-between items-center cursor-pointer mb-1 ${theme === 'dark' ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'}`}><div><p className="font-bold text-sm">{item.name}</p><p className="text-[10px] opacity-60">Stock: {item.stock}</p></div><span className="font-bold text-blue-500">${item.price}</span></div>
                ))}
                {posFilteredInventory.length === 0 && <p className="text-center text-xs opacity-50 p-2">No encontrado</p>}
              </div>
            )}
            <div className="flex-1 flex flex-col overflow-hidden"><h3 className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-2">{t('cart')}</h3><div className={`flex-1 overflow-y-auto space-y-2 p-1`}>{cart.length === 0 ? (<div className="flex flex-col items-center justify-center h-full opacity-30"><Icons.Cart className="w-12 h-12 mb-2"/><p className="text-xs font-bold uppercase">{t('emptyCart')}</p></div>) : (cart.map(item => (<div key={item.id} className={`p-3 rounded-2xl flex justify-between items-center border ${bgCard}`}><div className="flex-1"><p className="font-bold text-sm">{item.name}</p><p className="text-xs opacity-60">${item.price} x {item.qty} = <b>${(item.price * item.qty).toFixed(2)}</b></p></div><div className="flex items-center gap-2 bg-neutral-800/50 rounded-lg p-1"><button onClick={() => updateCartQty(item.id, -1)} className="p-1 hover:text-red-500"><Icons.Minus className="w-4 h-4"/></button><span className="text-xs font-bold w-4 text-center">{item.qty}</span><button onClick={() => updateCartQty(item.id, 1)} className="p-1 hover:text-green-500"><Icons.Plus className="w-4 h-4"/></button></div><button onClick={() => removeFromCart(item.id)} className="ml-3 text-red-500"><Icons.Trash className="w-4 h-4"/></button></div>)))}</div></div>
            <div className={`mt-auto pt-4 border-t ${theme === 'dark' ? 'border-neutral-800' : 'border-gray-200'}`}>
                {selectedCustomer ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 mb-3">
                        <div className="flex items-center gap-2"><Icons.Users className="w-5 h-5 text-blue-500" /><div><p className="font-bold text-sm text-blue-500">{selectedCustomer.name}</p><p className="text-[10px] opacity-60">{selectedCustomer.phone || 'Sin teléfono'}</p></div></div>
                        <button onClick={() => {setSelectedCustomer(null); setPosCustomerSearch('')}} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg">✕</button>
                    </div>
                ) : (
                    <div className="relative mb-3 flex gap-2">
                        <div className={`flex-1 flex items-center px-3 rounded-xl border ${inputClass}`}><Icons.Users className="w-5 h-5 opacity-30" /><input placeholder={t('customer')} value={posCustomerSearch} onChange={(e) => setPosCustomerSearch(e.target.value)} className="w-full p-3 bg-transparent outline-none text-sm" /></div>
                        <button onClick={() => setIsAddingCustomer(true)} className="p-3 bg-blue-600 text-white rounded-xl"><Icons.Plus className="w-5 h-5" /></button>
                        {posFilteredCustomers.length > 0 && (<div className={`absolute left-0 right-12 bottom-12 z-50 p-2 rounded-xl border shadow-xl max-h-40 overflow-y-auto ${theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'}`}>{posFilteredCustomers.map(c => (<div key={c.id} onClick={() => { setSelectedCustomer(c); setPosCustomerSearch(''); }} className={`p-2 rounded-lg cursor-pointer hover:bg-blue-500/10 flex justify-between`}><span className="font-bold text-xs">{c.name}</span><span className="text-[10px] opacity-50">{c.phone}</span></div>))}</div>)}
                    </div>
                )}
                <div className="flex justify-between items-center mb-4"><span className="text-sm font-bold opacity-60">TOTAL</span><span className="text-3xl font-black text-blue-500">${cartTotal.toFixed(2)}</span></div>
                <button onClick={handleCheckout} disabled={cart.length === 0} className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl active:scale-95 transition-transform ${cart.length === 0 ? 'bg-neutral-800 opacity-50' : 'bg-emerald-600'}`}>{t('checkout')}</button>
            </div>
          </div>
        )}

        {activeTab === 'Clients' && (
            <div className="space-y-4">
                <button onClick={() => setIsAddingCustomer(true)} className="w-full py-4 bg-blue-600 rounded-2xl font-bold text-white shadow-xl active:scale-95 transition-transform">+ {t('addClient')}</button>
                <div className="space-y-2">
                    {customers.length === 0 ? <p className="text-center opacity-40 py-10 text-xs">{t('noClients')}</p> : customers.map(c => (
                        <div key={c.id} className={`p-4 rounded-2xl border flex justify-between items-center ${bgCard}`}>
                            <div><p className="font-bold text-sm">{c.name}</p>{c.phone && <div className="flex items-center gap-1 opacity-60 text-xs"><Icons.Phone className="w-3 h-3"/> {c.phone}</div>}{c.address && <div className="flex items-center gap-1 opacity-60 text-xs"><Icons.Map className="w-3 h-3"/> {c.address}</div>}</div>
                            <div className="flex gap-2">
                                <button onClick={() => setEditingCustomer(c)} className={`p-2 rounded-lg ${theme==='dark'?'bg-neutral-800 text-neutral-400':'bg-gray-100 text-gray-500'}`}><Icons.Edit className="w-4 h-4"/></button>
                                {['admin', 'owner', 'dueño'].includes((currentUser?.role || '').toLowerCase()) && (
                                    <button onClick={() => setConfirmModal({isOpen:true, type:'delete_customer', id:c.id, message:"¿Borrar Cliente?"})} className="p-2 bg-rose-500/10 text-rose-500 rounded-lg"><Icons.Trash className="w-4 h-4" /></button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* INVENTORY */}
        {activeTab === 'Inventory' && (
          <div className="space-y-4">
            <div className={`flex items-center px-4 rounded-2xl border ${inputClass}`}><Icons.Search className="w-5 h-5 opacity-50" /><input placeholder={t('searchPlaceholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-4 bg-transparent outline-none" /></div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar"><button onClick={resetFilters} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${(filterCategory === 'All' && !filterLowStock && filterExpiry === 'All') ? 'bg-blue-600 text-white' : (theme === 'dark' ? 'bg-neutral-900 text-neutral-400' : 'bg-gray-200 text-gray-600')}`}>{t('all')}</button>{Object.keys(categoryTranslations).map(cat => (<button key={cat} onClick={() => setFilterCategory(cat)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${filterCategory === cat ? 'bg-blue-600 text-white' : (theme === 'dark' ? 'bg-neutral-900 text-neutral-400' : 'bg-gray-200 text-gray-600')}`}>{categoryTranslations[cat][language]}</button>))}</div>
            <button onClick={() => setFilterLowStock(!filterLowStock)} className={`w-full py-3 px-4 rounded-xl flex items-center justify-between border ${filterLowStock ? 'bg-orange-500/10 border-orange-500 text-orange-500' : (theme === 'dark' ? 'bg-neutral-900 border-neutral-800 text-neutral-400' : 'bg-gray-100 border-gray-200 text-gray-500')}`}><span className="text-xs font-bold uppercase tracking-wider">{t('lowStockFilter')}</span><div className={`w-10 h-5 rounded-full relative transition-colors ${filterLowStock ? 'bg-orange-500' : 'bg-neutral-600'}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${filterLowStock ? 'left-6' : 'left-1'}`} /></div></button>
            <div className="space-y-2">
              {filteredInventory.map(item => {
                const status = getExpiryStatus(item.expiryDate);
                const statusColor = status === 'expired' ? 'border-l-4 border-l-red-500 bg-red-500/5' : (status === 'warning' ? 'border-l-4 border-l-yellow-500 bg-yellow-500/5' : '');
                const r = (currentUser?.role || '').toLowerCase();
                const canEdit = ['admin', 'owner', 'pharmacist', 'dueño', 'farmacéutico', 'farmaceutico'].includes(r);
                return (<div key={item.id} className={`flex items-center justify-between p-4 rounded-2xl border ${bgCard} ${statusColor}`}><div><div className="flex items-center gap-2"><p className="font-bold text-sm">{item.name}</p>{status === 'expired' && <span className="text-[9px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">{t('expired')}</span>}{status === 'warning' && <span className="text-[9px] bg-yellow-500 text-black px-2 py-0.5 rounded-full font-bold">{t('expiresSoon')}</span>}</div><p className="text-[10px] text-blue-500 font-bold uppercase">{categoryTranslations[item.category]?.[language] || item.category}</p></div><div className="flex items-center gap-2"><span className={`text-sm font-black mr-2 ${item.stock <= 10 ? 'text-rose-500' : 'text-emerald-500'}`}>{item.stock}</span>{canEdit && <button onClick={() => setEditingItem(item)} className={`p-2 rounded-lg ${theme==='dark'?'bg-neutral-800 text-neutral-400':'bg-gray-100 text-gray-500'}`}><Icons.Edit className="w-4 h-4"/></button>}{canEdit && <button onClick={() => setConfirmModal({isOpen:true, type:'delete_product', id:item.id, message:t('deleteConfirm')})} className="p-2 bg-rose-500/10 text-rose-500 rounded-lg"><Icons.Trash className="w-4 h-4" /></button>}</div></div>);
              })}
            </div>
            {['admin', 'owner', 'pharmacist', 'dueño', 'farmacéutico', 'farmaceutico'].includes((currentUser?.role || '').toLowerCase()) && (<div className="flex gap-2 mt-4"><button onClick={() => setIsAddingMed(true)} className="flex-1 py-4 bg-blue-600 rounded-2xl font-bold text-white shadow-xl shadow-blue-500/10 active:scale-95 transition-transform">+ {t('addMed')}</button></div>)}
          </div>
        )}
        {activeTab === 'Orders' && (<div className="space-y-4">{orders.length === 0 ? <div className="text-center py-20 opacity-40"><Icons.Orders className="w-12 h-12 mx-auto mb-2 text-blue-500" /><p className="font-bold uppercase tracking-widest text-[10px]">No {t('pending')}</p></div> : orders.map(order => (<div key={order.id} onClick={() => setSelectedOrder(order)} className={`p-4 border rounded-2xl flex justify-between items-center cursor-pointer ${bgCard}`}><div><p className="font-bold text-sm">{order.patient}</p><p className="text-xs opacity-60">{order.items.length} {t('items')}</p></div><div className="flex flex-col items-end gap-1"><span className="font-bold text-lg">${Number(order.total).toFixed(2)}</span><span className="text-[10px] opacity-50">{new Date(order.date).toLocaleDateString()}</span><div className="flex gap-2 mt-1"><button onClick={(e) => { e.stopPropagation(); handleReprint(order); }} className={`p-2 rounded-lg ${theme==='dark'?'bg-blue-900/30 text-blue-400':'bg-blue-100 text-blue-600'}`}><Icons.Print className="w-4 h-4" /></button><div className={`p-2 rounded-lg ${theme==='dark'?'bg-neutral-800 text-neutral-400':'bg-gray-100 text-gray-500'}`}><Icons.Eye className="w-4 h-4" /></div></div></div></div>))}</div>)}
        {activeTab === 'Settings' && (
            <div className="space-y-6">
                {/* BOTÓN DE EXPORTAR CSV (SOLO ADMIN) */}
                {['admin', 'owner', 'dueño'].includes((currentUser?.role || '').toLowerCase()) && (
                    <div className={`p-5 border rounded-3xl ${bgCard}`}>
                        <h3 className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] mb-4">Administración</h3>
                        <button onClick={exportToCSV} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-transform">
                            <Icons.Download className="w-6 h-6" /> Exportar Inventario (CSV)
                        </button>
                    </div>
                )}

                <div className={`p-5 border rounded-3xl ${bgCard}`}><h3 className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] mb-4">{t('security')}</h3><div className="space-y-3">{['admin', 'owner', 'dueño'].includes((currentUser?.role || '').toLowerCase()) && (<button onClick={() => setIsStaffMgmt(true)} className={`w-full p-4 rounded-2xl font-bold text-left flex justify-between items-center text-sm border ${theme==='dark'?'bg-black/40 border-neutral-800/50':'bg-gray-50 border-gray-200'}`}>{t('staffMgmt')} <span className="text-blue-500">→</span></button>)}<button onClick={() => setIsChangingPass(true)} className={`w-full p-4 rounded-2xl font-bold text-left flex justify-between items-center text-sm border ${theme==='dark'?'bg-black/40 border-neutral-800/50':'bg-gray-50 border-gray-200'}`}>{t('changePass')} <span className="text-blue-500">→</span></button><button onClick={() => setConfirmModal({isOpen:true, type:'logout', message:t('logoutConfirm')})} className="w-full py-4 text-rose-500 font-bold border border-rose-500/20 rounded-2xl uppercase tracking-[0.15em] text-[10px] bg-rose-500/5 active:bg-rose-500/10">{t('logout')}</button></div></div><div className={`p-5 border rounded-3xl ${bgCard}`}><h3 className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] mb-4">{t('language')} & Theme</h3><div className={`flex p-1 rounded-2xl border mb-3 ${theme==='dark'?'bg-black border-neutral-800':'bg-gray-100 border-gray-200'}`}><button onClick={() => setLanguage('EN')} className={`flex-1 py-3 rounded-xl font-bold transition-all text-xs ${language === 'EN' ? 'bg-blue-600 text-white' : 'opacity-40'}`}>English</button><button onClick={() => setLanguage('ES')} className={`flex-1 py-3 rounded-xl font-bold transition-all text-xs ${language === 'ES' ? 'bg-blue-600 text-white' : 'opacity-40'}`}>Español</button></div><div className={`flex p-1 rounded-2xl border ${theme==='dark'?'bg-black border-neutral-800':'bg-gray-100 border-gray-200'}`}><button onClick={() => setTheme('dark')} className={`flex-1 py-3 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-neutral-800 text-white' : 'opacity-40'}`}><Icons.Moon className="w-4 h-4"/> {t('darkMode')}</button><button onClick={() => setTheme('light')} className={`flex-1 py-3 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-2 ${theme === 'light' ? 'bg-white text-black shadow-sm' : 'opacity-40'}`}><Icons.Sun className="w-4 h-4"/> {t('lightMode')}</button></div></div>
            </div>
        )}
      </main>

      {/* --- MODAL DETALLES DEL PEDIDO (NUEVO) --- */}
      {selectedOrder && !isTicketOpen && (
        <div className="fixed inset-0 bg-black/90 z-[500] flex items-center justify-center p-6">
            <div className={`p-6 rounded-3xl border shadow-2xl max-w-sm w-full ${bgCard} relative`}>
                <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 p-2 bg-neutral-800/20 rounded-full">✕</button>
                <h2 className="text-xl font-bold mb-1">{t('orderDetails')}</h2>
                <p className="text-xs opacity-50 mb-4">ID: #{selectedOrder.id} • {new Date(selectedOrder.date).toLocaleDateString()}</p>
                <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <p className="text-[10px] uppercase font-bold text-blue-500 mb-1">Cliente</p>
                    <p className="font-bold">{selectedOrder.patient}</p>
                </div>
                <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                    {selectedOrder.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm border-b border-dashed border-neutral-700/30 pb-1">
                            <span>{item.qty} x {item.name}</span>
                            <span className="font-bold">${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center text-xl font-black mb-6">
                    <span>Total</span>
                    <span>${Number(selectedOrder.total).toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => { setIsTicketOpen(true); setLastOrder(selectedOrder); }} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2"><Icons.Print className="w-4 h-4"/> Imprimir Ticket</button>
                    <button onClick={() => setSelectedOrder(null)} className="py-3 px-4 bg-neutral-800 text-white rounded-xl font-bold text-sm">{t('close')}</button>
                </div>
            </div>
        </div>
      )}

      {/* TICKET MODAL */}
      {isTicketOpen && lastOrder && (
        <div className="fixed inset-0 bg-black/90 z-[500] flex items-center justify-center p-4">
          <div className="bg-white text-black w-full max-w-xs p-0 rounded-sm shadow-2xl relative">
            <button onClick={() => setIsTicketOpen(false)} className="absolute -top-10 right-0 text-white font-bold bg-white/20 p-2 rounded-full no-print">✕ CERRAR</button>
            <div id="print-area" className="font-mono p-2 text-[10px] leading-tight w-[48mm] mx-auto bg-white text-black">
              <div className="text-center mb-4 border-b-2 border-dashed border-black pb-2"><h2 className="text-xl font-black uppercase">PharmaPro</h2><p>Sucursal Centro</p><p>RNC: 101-555-999</p><p>Tel: (555) 123-4567</p><p>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p></div>
              <div className="mb-2 border-b-2 border-dashed border-black pb-2"><p><b>Cliente:</b> {lastOrder.patient}</p><p><b>Ticket #:</b> {lastOrder.id}</p><p><b>Cajero:</b> {currentUser?.name}</p></div>
              <table className="w-full mb-4 border-b-2 border-dashed border-black pb-2"><thead><tr className="text-left"><th>Cant</th><th>Item</th><th className="text-right">$$</th></tr></thead><tbody>{lastOrder.items.map((item, i) => (<tr key={i}><td className="align-top pt-1">{item.qty}</td><td className="align-top pt-1">{item.name.substring(0, 15)}</td><td className="text-right align-top pt-1">{(item.price * item.qty).toFixed(2)}</td></tr>))}</tbody></table>
              <div className="flex justify-between text-xl font-black mb-2"><span>TOTAL</span><span>${Number(lastOrder.total).toFixed(2)}</span></div>
              <div className="text-center mt-6 border-t-2 border-dashed border-black pt-2"><p>*** GRACIAS POR SU COMPRA ***</p><p>No se aceptan devoluciones</p><p>después de 30 días</p><p className="mt-2 text-[10px]">Sistema PharmaPro v1.0</p></div>
            </div>
            <button onClick={() => window.print()} className="w-full py-4 bg-black text-white font-bold flex items-center justify-center gap-2 no-print hover:bg-neutral-800"><Icons.Print className="w-4 h-4"/> IMPRIMIR TICKET</button>
          </div>
        </div>
      )}

      {/* MODALES CLASICOS */}
      {confirmModal.isOpen && (<div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[400] flex items-center justify-center p-6"><div className={`p-6 rounded-3xl border shadow-2xl max-w-xs w-full text-center space-y-4 ${bgCard}`}><div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto"><Icons.Trash className="w-6 h-6" /></div><h3 className="text-lg font-bold">{confirmModal.message}</h3><div className="flex gap-3 pt-2"><button onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })} className="flex-1 py-3 font-bold opacity-60 text-sm">{t('cancel')}</button><button onClick={executeDelete} className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold text-sm active:scale-95">Confirmar</button></div></div></div>)}
      {(isAddingMed || editingItem) && (<div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[250] flex items-center justify-center p-6"><form onSubmit={editingItem ? updateMedication : addMedication} className={`w-full max-w-sm space-y-4 p-6 rounded-3xl border shadow-2xl ${bgCard}`}><h2 className="text-xl font-bold mb-4">{editingItem ? t('editMed') : t('addMed')}</h2><input name="name" defaultValue={editingItem?.name} required placeholder={t('medName')} className={`w-full p-4 rounded-xl border outline-none focus:border-blue-500 ${inputClass}`} /><select name="category" defaultValue={editingItem?.category} className={`w-full p-4 rounded-xl border outline-none focus:border-blue-500 ${inputClass}`}>{Object.keys(categoryTranslations).map(cat => <option key={cat} value={cat}>{categoryTranslations[cat][language]}</option>)}</select><div className="grid grid-cols-2 gap-2"><input name="stock" defaultValue={editingItem?.stock} type="number" required placeholder="Stock" className={`w-full p-4 rounded-xl border outline-none focus:border-blue-500 ${inputClass}`} /><input name="price" defaultValue={editingItem?.price} type="number" step="0.01" required placeholder={t('price')} className={`w-full p-4 rounded-xl border outline-none focus:border-blue-500 ${inputClass}`} /></div><input name="expiry" defaultValue={editingItem ? editingItem.expiryDate?.split('T')[0] : ''} type="date" required className={`w-full p-4 rounded-xl border outline-none focus:border-blue-500 ${inputClass}`} /><div className="flex gap-4 pt-2"><button type="button" onClick={() => {setIsAddingMed(false); setEditingItem(null)}} className="flex-1 py-4 font-bold opacity-40 text-sm">{t('cancel')}</button><button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold text-sm active:scale-95">{t('save')}</button></div></form></div>)}
      {(isAddingStaff || editingStaff || isChangingPass) && (<div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[250] flex items-center justify-center p-6"><form onSubmit={isAddingStaff ? addStaffMember : handleUpdateStaff} className={`w-full max-w-sm space-y-4 p-6 rounded-3xl border shadow-2xl ${bgCard}`}><h2 className="text-xl font-bold mb-4">{isAddingStaff ? t('addStaff') : (isChangingPass ? t('changePass') : t('editStaff'))}</h2>{(!isChangingPass) && (<><input name="name" defaultValue={editingStaff?.name} required placeholder={t('name')} className={`w-full p-4 rounded-xl border outline-none focus:border-blue-500 ${inputClass}`} /><select name="role" defaultValue={editingStaff?.role} className={`w-full p-4 rounded-xl border outline-none focus:border-blue-500 ${inputClass}`}><option value="Pharmacist">Farmacéutico</option><option value="Cashier">Cajero</option><option value="Staff">Personal</option></select><input name="username" defaultValue={editingStaff?.username} required placeholder={t('userUser')} className={`w-full p-4 rounded-xl border outline-none focus:border-blue-500 ${inputClass}`} /></>)}<input name="password" type="password" placeholder={t('userPass')} className={`w-full p-4 rounded-xl border outline-none focus:border-blue-500 ${inputClass}`} />{isChangingPass && <p className="text-xs opacity-50">Escribe tu nueva contraseña</p>}<div className="flex gap-4 pt-2"><button type="button" onClick={() => { setIsAddingStaff(false); setEditingStaff(null); setIsChangingPass(false); }} className="flex-1 py-4 font-bold opacity-40 text-sm">{t('cancel')}</button><button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold text-sm active:scale-95">{t('save')}</button></div></form></div>)}
      
      {/* --- FORMULARIO NUEVO CLIENTE (MODAL) --- */}
      {(isAddingCustomer || editingCustomer) && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[250] flex items-center justify-center p-6">
            <form onSubmit={editingCustomer ? updateCustomer : addCustomer} className={`w-full max-w-sm space-y-4 p-6 rounded-3xl border shadow-2xl ${bgCard}`}>
                <h2 className="text-xl font-bold mb-4">{editingCustomer ? "Editar Cliente" : "Nuevo Cliente"}</h2>
                <input name="name" defaultValue={editingCustomer?.name} required placeholder={t('customer')} className={`w-full p-4 rounded-xl border outline-none focus:border-blue-500 ${inputClass}`} />
                <input name="phone" defaultValue={editingCustomer?.phone} placeholder={t('phone')} className={`w-full p-4 rounded-xl border outline-none focus:border-blue-500 ${inputClass}`} />
                <input name="address" defaultValue={editingCustomer?.address} placeholder={t('address')} className={`w-full p-4 rounded-xl border outline-none focus:border-blue-500 ${inputClass}`} />
                <input name="rnc" defaultValue={editingCustomer?.rnc} placeholder={t('taxId')} className={`w-full p-4 rounded-xl border outline-none focus:border-blue-500 ${inputClass}`} />
                <div className="flex gap-4 pt-2">
                    <button type="button" onClick={() => { setIsAddingCustomer(false); setEditingCustomer(null); }} className="flex-1 py-4 font-bold opacity-40 text-sm">{t('cancel')}</button>
                    <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold text-sm active:scale-95">{t('save')}</button>
                </div>
            </form>
        </div>
      )}
      
      {isStaffMgmt && (
        <div className={`fixed inset-0 z-[200] p-6 flex flex-col ${theme==='dark'?'bg-black':'bg-white'}`}>
            <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-bold">{t('staffMgmt')}</h2><button onClick={() => setIsStaffMgmt(false)} className={`w-10 h-10 rounded-full flex items-center justify-center ${theme==='dark'?'bg-neutral-900':'bg-gray-100'}`}>✕</button></div>
            <div className="flex-1 space-y-4 overflow-y-auto">
                {staffList.map(staff => (
                    <div key={staff.id || staff.ID} className={`p-4 border rounded-2xl flex justify-between items-center ${bgCard}`}>
                        <div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-600/20 text-blue-500 rounded-xl flex items-center justify-center font-bold">{(staff.name || staff.NAME)[0]}</div><div><p className="font-bold text-sm">{staff.name || staff.NAME}</p><p className="text-[10px] opacity-50 uppercase font-bold">{staff.role || staff.ROLE}</p></div></div>
                        {(staff.username !== 'admin') && (<div className="flex gap-2"><button onClick={() => setEditingStaff(staff)} className={`p-2 rounded-lg ${theme==='dark'?'bg-neutral-800 text-neutral-400':'bg-gray-100 text-gray-500'}`}><Icons.Edit className="w-4 h-4"/></button><button onClick={() => setConfirmModal({isOpen:true, type:'delete_staff', id:(staff.id || staff.ID), message:t('removeStaffConfirm')})} className="p-2 text-rose-500 bg-rose-500/10 rounded-lg"><Icons.Trash className="w-4 h-4" /></button></div>)}
                    </div>
                ))}
            </div>
            <button onClick={() => setIsAddingStaff(true)} className="w-full py-4 bg-blue-600 rounded-2xl font-bold text-white mt-4 shadow-xl active:scale-95">+ {t('addStaff')}</button>
        </div>
      )}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} labels={{Dashboard: t('dashboard'), Inventory: t('inventory'), Orders: t('orders'), Settings: t('settings'), Clients: t('clients')}} theme={theme} role={currentUser?.role} />
    </div>
  );
};

export default App;
