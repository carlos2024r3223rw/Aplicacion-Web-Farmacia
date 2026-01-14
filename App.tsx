import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

// --- ICONOS ---
const Icons = {
  Edit: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Trash: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Dashboard: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
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
};

// --- COMPONENTES UI ---

const StatCard = ({ label, value, variant = 'blue', onClick, theme }) => {
  const colors = {
    blue: theme === 'dark' ? 'bg-blue-600/10 text-blue-500 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-200',
    green: theme === 'dark' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200',
    orange: theme === 'dark' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-orange-50 text-orange-600 border-orange-200',
  };
  return (
    <div onClick={onClick} className={`p-4 rounded-2xl border ${colors[variant]} flex flex-col ${onClick ? 'cursor-pointer active:scale-95 transition-transform hover:opacity-80' : ''}`}>
      <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</span>
      <span className="text-2xl font-black tracking-tight">{value}</span>
    </div>
  );
};

// MENÚ FIJO ABAJO (NO SE ROMPE AL SCROLLEAR)
const BottomNav = ({ activeTab, onTabChange, labels, theme }) => {
  const tabs = [
    { id: 'Dashboard', icon: Icons.Dashboard, label: labels.Dashboard },
    { id: 'Inventory', icon: Icons.Inventory, label: labels.Inventory },
    { id: 'Orders', icon: Icons.Orders, label: labels.Orders },
    { id: 'Settings', icon: Icons.Settings, label: labels.Settings },
  ];
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

// --- DATOS Y TRADUCCIONES ---

const categoryTranslations = { 
  "Antibiotic": { EN: "Antibiotic", ES: "Antibiótico" }, 
  "Analgesic": { EN: "Analgesic", ES: "Analgésico" }, 
  "Cardiac": { EN: "Cardiac", ES: "Cardíaco" }, 
  "Diabetes": { EN: "Diabetes", ES: "Diabetes" }, 
  "Statins": { EN: "Statins", ES: "Estatinas" }, 
  "Misc": { EN: "Misc", ES: "Varios" } 
};

const translations = {
  EN: { dashboard: "Dashboard", inventory: "Inventory", orders: "Orders", settings: "Settings", todaySales: "Total Sales", pendingPresc: "Pending Orders", lowStock: "Low Stock Alerts", addMed: "Add Medication", save: "Save Changes", login: "Login", username: "Username", password: "Password", invalid: "Invalid Credentials", searchPlaceholder: "Search medication...", units: "units", logout: "Sign Out", logoutConfirm: "Are you sure you want to log out?", cancel: "Cancel", manageStock: "MANAGE STOCK", details: "DETAILS", pending: "PENDING", changePass: "Change Password", currPass: "Current Password", newPass: "New Password", confirmPass: "Confirm New Password", passUpdated: "Password updated successfully!", passMismatch: "New passwords do not match!", wrongPass: "Incorrect current password!", staffMgmt: "Staff Permissions", security: "Security", addStaff: "Add New Employee", productDeleted: "Product deleted!", deleteConfirm: "Are you sure you want to delete this item?", removeStaffConfirm: "Remove this employee access?", price: "Price", medName: "Medication Name", exportCsv: "Export Inventory (CSV)", completeOrder: "Complete Order", orderCompleted: "Order Completed!", editStaff: "Edit Staff", role: "Role", name: "Name", orderDetails: "Order Details", items: "Items", qty: "Qty", subtotal: "Subtotal", salesHistory: "Sales History (Last 5 Days)", userUser: "Username", userPass: "Password", darkMode: "Dark Mode", lightMode: "Light Mode", language: "Language", editMed: "Edit Medication", all: "All", lowStockFilter: "Low Stock Only" },
  ES: { dashboard: "Panel", inventory: "Inventario", orders: "Pedidos", settings: "Ajustes", todaySales: "Ventas Totales", pendingPresc: "Pedidos Pendientes", lowStock: "Alertas Stock Bajo", addMed: "Añadir Medicamento", save: "Guardar Cambios", login: "Iniciar Sesión", username: "Usuario", password: "Contraseña", invalid: "Credenciales Inválidas", searchPlaceholder: "Buscar medicamento...", units: "unidades", logout: "Cerrar Sesión", logoutConfirm: "¿Cerrar sesión y salir?", cancel: "Cancelar", manageStock: "GESTIONAR STOCK", details: "DETALLES", pending: "PENDIENTE", changePass: "Cambiar Contraseña", currPass: "Contraseña Actual", newPass: "Nueva Contraseña", confirmPass: "Confirmar Nueva", passUpdated: "¡Contraseña actualizada!", passMismatch: "¡Las contraseñas no coinciden!", wrongPass: "¡Contraseña incorrecta!", staffMgmt: "Gestión de Personal", security: "Seguridad", addStaff: "Añadir Empleado", productDeleted: "¡Producto eliminado!", deleteConfirm: "¿Eliminar este medicamento?", removeStaffConfirm: "¿Eliminar acceso de empleado?", price: "Precio", medName: "Nombre Medicamento", exportCsv: "Exportar Inventario (CSV)", completeOrder: "Completar Pedido", orderCompleted: "¡Pedido Completado!", editStaff: "Editar Empleado", role: "Rol", name: "Nombre", orderDetails: "Detalles del Pedido", items: "Artículos", qty: "Cant", subtotal: "Subtotal", salesHistory: "Historial de Ventas (5 Días)", userUser: "Usuario Acceso", userPass: "Contraseña Acceso", darkMode: "Modo Oscuro", lightMode: "Modo Claro", language: "Idioma", editMed: "Editar Medicamento", all: "Todo", lowStockFilter: "Solo Stock Bajo" }
};

const App = () => {
  // ---------------------------------------------------------
  // ⚠️ TU IP AQUÍ ⚠️
  const API_URL = 'http://192.168.1.177:3001';
  // ---------------------------------------------------------

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [language, setLanguage] = useState('ES');
  const [theme, setTheme] = useState('dark');
  
  // FILTROS
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterLowStock, setFilterLowStock] = useState(false);
  
  const [inventory, setInventory] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [editingItem, setEditingItem] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [isAddingMed, setIsAddingMed] = useState(false);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [isStaffMgmt, setIsStaffMgmt] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, id: null, message: '' });

  const t = (key) => translations[language][key] || key;
  const showToast = (message) => { setToast({ message, visible: true }); setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000); };

  const loadAllData = () => {
    fetch(`${API_URL}/inventory`).then(r => r.json()).then(setInventory).catch(console.error);
    fetch(`${API_URL}/users`).then(r => r.json()).then(setStaffList).catch(console.error);
    fetch(`${API_URL}/orders`).then(r => r.json()).then(setOrders).catch(console.error);
  };

  useEffect(() => { if(isLoggedIn) loadAllData(); }, [isLoggedIn]);

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
        showToast(`Bienvenido ${data.user.name}`);
      } else {
        alert(t('invalid'));
      }
    } catch (err) { alert('Error de conexión'); }
  };

  const updateMedication = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    await fetch(`${API_URL}/inventory/${editingItem.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fd.get('name'), category: fd.get('category'),
        stock: parseInt(fd.get('stock')), price: parseFloat(fd.get('price')), expiryDate: fd.get('expiry')
      })
    });
    loadAllData();
    setEditingItem(null);
    showToast(t('save'));
  };

  const addMedication = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    await fetch(`${API_URL}/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fd.get('name'), category: fd.get('category'),
        stock: parseInt(fd.get('stock')), price: parseFloat(fd.get('price')), expiryDate: fd.get('expiry')
      })
    });
    loadAllData();
    setIsAddingMed(false);
    showToast(t('save'));
  };

  // ... (Resto de funciones: addStaff, updateStaff, delete se mantienen igual) ...
  const handleUpdateStaff = async (e) => { e.preventDefault(); const fd = new FormData(e.target); const userId = editingStaff ? editingStaff.id : currentUser.id; await fetch(`${API_URL}/users/${userId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: fd.get('name') || currentUser.name, role: fd.get('role') || currentUser.role, username: fd.get('username') || currentUser.username, password: fd.get('password') }) }); loadAllData(); setEditingStaff(null); setIsChangingPass(false); showToast(t('passUpdated')); };
  const addStaffMember = async (e) => { e.preventDefault(); const fd = new FormData(e.target); await fetch(`${API_URL}/users`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: fd.get('name'), role: fd.get('role'), username: fd.get('username'), password: fd.get('password') }) }); loadAllData(); setIsAddingStaff(false); showToast("Empleado Registrado"); };
  const executeDelete = async () => { const { type, id } = confirmModal; if (type === 'delete_product') { await fetch(`${API_URL}/inventory/${id}`, { method: 'DELETE' }); showToast(t('productDeleted')); } else if (type === 'delete_staff') { await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' }); showToast("Personal eliminado"); } else if (type === 'complete_order') { await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' }); showToast(t('orderCompleted')); } else if (type === 'logout') { setIsLoggedIn(false); setActiveTab('Dashboard'); } loadAllData(); setConfirmModal({ isOpen: false, type: null }); };

  // --- LOGICA DE FILTRADO AVANZADO (BILINGÜE) ---
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const q = searchQuery.toLowerCase();
      // Traducción al vuelo para búsqueda
      const catEN = item.category.toLowerCase();
      const catES = categoryTranslations[item.category]?.ES.toLowerCase() || '';

      const matchesSearch = item.name.toLowerCase().includes(q) || catEN.includes(q) || catES.includes(q);
      const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
      const matchesStock = filterLowStock ? item.stock <= (item.threshold || 10) : true;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [inventory, searchQuery, filterCategory, filterLowStock, language]);

  // ESTILOS DINAMICOS
  const bgMain = theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-gray-900';
  const bgCard = theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200 shadow-sm';
  const inputClass = theme === 'dark' ? 'bg-black border-neutral-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900';

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 font-sans ${bgMain}`}>
         {/* ... LOGIN FORM (Igual que antes) ... */}
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

  return (
    // CAMBIO IMPORTANTE: h-screen y overflow-hidden para layout fijo
    <div className={`h-screen flex flex-col font-sans max-w-md mx-auto relative overflow-hidden ${bgMain}`}>
      
      {/* HEADER FIJO */}
      <header className={`flex-shrink-0 px-6 py-4 border-b flex items-center justify-between backdrop-blur-md z-40 ${theme === 'dark' ? 'border-neutral-900 bg-black/50' : 'border-gray-200 bg-white/50'}`}>
        <div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><span className="text-xl font-bold italic text-white">P+</span></div><h1 className="text-lg font-bold">PharmaPro Admin</h1></div>
      </header>

      {/* CONTENIDO SCROLLEABLE INDEPENDIENTE */}
      <main className="flex-1 overflow-y-auto px-6 pt-6 pb-24 scroll-smooth">
        
        {/* ... DASHBOARD (Igual) ... */}
        {activeTab === 'Dashboard' && (
          <div className="space-y-6">
            <StatCard label={t('todaySales')} value="$4,820" variant="green" theme={theme} />
            <div className="grid grid-cols-2 gap-4">
              <StatCard label={t('pendingPresc')} value={orders.length} variant="blue" onClick={() => setActiveTab('Orders')} theme={theme} />
              <StatCard label={t('lowStock')} value={inventory.filter(i => i.stock <= (i.threshold || 10)).length} variant="orange" onClick={() => { setActiveTab('Inventory'); setFilterLowStock(true); }} theme={theme} />
            </div>
          </div>
        )}

        {/* INVENTARIO CON NUEVOS FILTROS */}
        {activeTab === 'Inventory' && (
          <div className="space-y-4">
            {/* BARRA DE BÚSQUEDA */}
            <div className={`flex items-center px-4 rounded-2xl border ${inputClass}`}>
               <Icons.Search className="w-5 h-5 opacity-50" />
               <input placeholder={t('searchPlaceholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-4 bg-transparent outline-none" />
            </div>

            {/* CHIPS DE CATEGORÍAS (SCROLL HORIZONTAL) */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              <button onClick={() => setFilterCategory('All')} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${filterCategory === 'All' ? 'bg-blue-600 text-white' : (theme === 'dark' ? 'bg-neutral-900 text-neutral-400' : 'bg-gray-200 text-gray-600')}`}>
                 {t('all')}
              </button>
              {Object.keys(categoryTranslations).map(cat => (
                <button key={cat} onClick={() => setFilterCategory(cat)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${filterCategory === cat ? 'bg-blue-600 text-white' : (theme === 'dark' ? 'bg-neutral-900 text-neutral-400' : 'bg-gray-200 text-gray-600')}`}>
                   {categoryTranslations[cat][language]}
                </button>
              ))}
            </div>

            {/* TOGGLE STOCK BAJO */}
            <button onClick={() => setFilterLowStock(!filterLowStock)} className={`w-full py-3 px-4 rounded-xl flex items-center justify-between border ${filterLowStock ? 'bg-orange-500/10 border-orange-500 text-orange-500' : (theme === 'dark' ? 'bg-neutral-900 border-neutral-800 text-neutral-400' : 'bg-gray-100 border-gray-200 text-gray-500')}`}>
               <span className="text-xs font-bold uppercase tracking-wider">{t('lowStockFilter')}</span>
               <div className={`w-10 h-5 rounded-full relative transition-colors ${filterLowStock ? 'bg-orange-500' : 'bg-neutral-600'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${filterLowStock ? 'left-6' : 'left-1'}`} />
               </div>
            </button>

            {/* LISTA DE MEDICAMENTOS */}
            <div className="space-y-2">
              {filteredInventory.map(item => (
                <div key={item.id} className={`flex items-center justify-between p-4 rounded-2xl border ${bgCard}`}>
                  <div><p className="font-bold text-sm">{item.name}</p><p className="text-[10px] text-blue-500 font-bold uppercase">{categoryTranslations[item.category]?.[language]}</p></div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-black mr-2 ${item.stock <= 10 ? 'text-rose-500' : 'text-emerald-500'}`}>{item.stock}</span>
                    <button onClick={() => setEditingItem(item)} className={`p-2 rounded-lg ${theme==='dark'?'bg-neutral-800 text-neutral-400':'bg-gray-100 text-gray-500'}`}><Icons.Edit className="w-4 h-4"/></button>
                    <button onClick={() => setConfirmModal({isOpen:true, type:'delete_product', id:item.id, message:t('deleteConfirm')})} className="p-2 bg-rose-500/10 text-rose-500 rounded-lg"><Icons.Trash className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
              {filteredInventory.length === 0 && <p className="text-center opacity-40 text-sm py-10">No se encontraron medicamentos.</p>}
            </div>
            <button onClick={() => setIsAddingMed(true)} className="w-full py-4 bg-blue-600 rounded-2xl font-bold text-white shadow-xl shadow-blue-500/10 active:scale-95 transition-transform mt-4">+ {t('addMed')}</button>
          </div>
        )}

        {/* ... (Orders y Settings sin cambios mayores) ... */}
        {activeTab === 'Orders' && (
          <div className="space-y-4">
             {orders.length === 0 ? <div className="text-center py-20 opacity-40"><Icons.Orders className="w-12 h-12 mx-auto mb-2 text-blue-500" /><p className="font-bold uppercase tracking-widest text-[10px]">No {t('pending')}</p></div> : 
               orders.map(order => (
                 <div key={order.id} onClick={() => setSelectedOrder(order)} className={`p-4 border rounded-2xl flex justify-between items-center cursor-pointer ${bgCard}`}>
                   <div><p className="font-bold text-sm">{order.patient}</p><p className="text-xs opacity-60">{order.items.length} {t('items')}</p></div>
                   <div className="flex flex-col items-end gap-2"><span className="font-bold text-lg">${order.total}</span><div className={`p-2 rounded-full ${theme==='dark'?'bg-neutral-800 text-neutral-400':'bg-gray-100 text-gray-500'}`}><Icons.Eye className="w-4 h-4" /></div></div>
                 </div>
               ))
             }
          </div>
        )}

        {activeTab === 'Settings' && (
          <div className="space-y-6">
            <div className={`p-5 border rounded-3xl ${bgCard}`}>
              <h3 className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] mb-4">{t('security')}</h3>
              <div className="space-y-3">
                <button onClick={() => setIsStaffMgmt(true)} className={`w-full p-4 rounded-2xl font-bold text-left flex justify-between items-center text-sm border ${theme==='dark'?'bg-black/40 border-neutral-800/50':'bg-gray-50 border-gray-200'}`}>{t('staffMgmt')} <span className="text-blue-500">→</span></button>
                <button onClick={() => setIsChangingPass(true)} className={`w-full p-4 rounded-2xl font-bold text-left flex justify-between items-center text-sm border ${theme==='dark'?'bg-black/40 border-neutral-800/50':'bg-gray-50 border-gray-200'}`}>{t('changePass')} <span className="text-blue-500">→</span></button>
                <button onClick={() => setConfirmModal({isOpen:true, type:'logout', message:t('logoutConfirm')})} className="w-full py-4 text-rose-500 font-bold border border-rose-500/20 rounded-2xl uppercase tracking-[0.15em] text-[10px] bg-rose-500/5 active:bg-rose-500/10">{t('logout')}</button>
              </div>
            </div>
             <div className={`p-5 border rounded-3xl ${bgCard}`}>
              <h3 className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] mb-4">{t('language')} & Theme</h3>
              <div className={`flex p-1 rounded-2xl border mb-3 ${theme==='dark'?'bg-black border-neutral-800':'bg-gray-100 border-gray-200'}`}>
                <button onClick={() => setLanguage('EN')} className={`flex-1 py-3 rounded-xl font-bold transition-all text-xs ${language === 'EN' ? 'bg-blue-600 text-white' : 'opacity-40'}`}>English</button>
                <button onClick={() => setLanguage('ES')} className={`flex-1 py-3 rounded-xl font-bold transition-all text-xs ${language === 'ES' ? 'bg-blue-600 text-white' : 'opacity-40'}`}>Español</button>
              </div>
              <div className={`flex p-1 rounded-2xl border ${theme==='dark'?'bg-black border-neutral-800':'bg-gray-100 border-gray-200'}`}>
                <button onClick={() => setTheme('dark')} className={`flex-1 py-3 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-neutral-800 text-white' : 'opacity-40'}`}><Icons.Moon className="w-4 h-4"/> {t('darkMode')}</button>
                <button onClick={() => setTheme('light')} className={`flex-1 py-3 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-2 ${theme === 'light' ? 'bg-white text-black shadow-sm' : 'opacity-40'}`}><Icons.Sun className="w-4 h-4"/> {t('lightMode')}</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODALES (MISMOS DE ANTES, OMITIDOS PARA BREVEDAD PERO NECESARIOS) */}
      {/* ... (Pega aquí los mismos bloques de modales de tu código anterior: isAddingMed, isStaffMgmt, etc) ... */}
      
      {/* RE-INSERTO MODALES CLAVE PARA QUE COPIES TODO JUNTO SI QUIERES */}
      {confirmModal.isOpen && (<div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[400] flex items-center justify-center p-6"><div className={`p-6 rounded-3xl border shadow-2xl max-w-xs w-full text-center space-y-4 ${bgCard}`}><div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto"><Icons.Trash className="w-6 h-6" /></div><h3 className="text-lg font-bold">{confirmModal.message}</h3><div className="flex gap-3 pt-2"><button onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })} className="flex-1 py-3 font-bold opacity-60 text-sm">{t('cancel')}</button><button onClick={executeDelete} className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold text-sm active:scale-95">Confirmar</button></div></div></div>)}

      {(isAddingMed || editingItem) && (<div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[250] flex items-center justify-center p-6"><form onSubmit={editingItem ? updateMedication : addMedication} className={`w-full max-w-sm space-y-4 p-6 rounded-3xl border shadow-2xl ${bgCard}`}><h2 className="text-xl font-bold mb-4">{editingItem ? t('editMed') : t('addMed')}</h2><input name="name" defaultValue={editingItem?.name} required placeholder={t('medName')} className={`w-full p-4 rounded-xl border outline-none focus:border-blue-500 ${inputClass}`} /><select name="category" defaultValue={editingItem?.category} className={`w-full p-4 rounded-xl border outline-none focus:border-blue-500 ${inputClass}`}>{Object.keys(categoryTranslations).map(cat => <option key={cat} value={cat}>{categoryTranslations[cat][language]}</option>)}</select><div className="grid grid-cols-2 gap-2"><input name="stock" defaultValue={editingItem?.stock} type="number" required placeholder="Stock" className={`w-full p-4 rounded-xl border outline-none focus:border-blue-500 ${inputClass}`} /><input name="price" defaultValue={editingItem?.price} type="number" step="0.01" required placeholder={t('price')} className={`w-full p-4 rounded-xl border outline-none focus:border-blue-500 ${inputClass}`} /></div><input name="expiry" defaultValue={editingItem ? editingItem.expiryDate?.split('T')[0] : ''} type="date" required className={`w-full p-4 rounded-xl border outline-none focus:border-blue-500 ${inputClass}`} /><div className="flex gap-4 pt-2"><button type="button" onClick={() => {setIsAddingMed(false); setEditingItem(null)}} className="flex-1 py-4 font-bold opacity-40 text-sm">{t('cancel')}</button><button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold text-sm active:scale-95">{t('save')}</button></div></form></div>)}

      {isStaffMgmt && (<div className={`fixed inset-0 z-[200] p-6 flex flex-col animate-in slide-in-from-right duration-300 ${theme==='dark'?'bg-black':'bg-white'}`}><div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-bold">{t('staffMgmt')}</h2><button onClick={() => setIsStaffMgmt(false)} className={`w-10 h-10 rounded-full flex items-center justify-center ${theme==='dark'?'bg-neutral-900':'bg-gray-100'}`}>✕</button></div><div className="flex-1 space-y-4 overflow-y-auto">{staffList.map(staff => (<div key={staff.id} className={`p-4 border rounded-2xl flex justify-between items-center ${bgCard}`}><div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-600/20 text-blue-500 rounded-xl flex items-center justify-center font-bold">{staff.name[0]}</div><div><p className="font-bold text-sm">{staff.name}</p><p className="text-[10px] opacity-50 uppercase font-bold">{staff.role}</p></div></div>{staff.username !== 'admin' && (<div className="flex gap-2"><button onClick={() => setEditingStaff(staff)} className={`p-2 rounded-lg ${theme==='dark'?'bg-neutral-800 text-neutral-400':'bg-gray-100 text-gray-500'}`}><Icons.Edit className="w-4 h-4"/></button><button onClick={() => setConfirmModal({isOpen:true, type:'delete_staff', id:staff.id, message:t('removeStaffConfirm')})} className="p-2 text-rose-500 bg-rose-500/10 rounded-lg"><Icons.Trash className="w-4 h-4" /></button></div>)}</div>))}</div><button onClick={() => setIsAddingStaff(true)} className="w-full py-4 bg-blue-600 rounded-2xl font-bold text-white mt-4 shadow-xl active:scale-95">+ {t('addStaff')}</button></div>)}

      {(isAddingStaff || editingStaff || isChangingPass) && (<div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[250] flex items-center justify-center p-6"><form onSubmit={isAddingStaff ? addStaffMember : handleUpdateStaff} className={`w-full max-w-sm space-y-4 p-6 rounded-3xl border shadow-2xl ${bgCard}`}><h2 className="text-xl font-bold mb-4">{isAddingStaff ? t('addStaff') : (isChangingPass ? t('changePass') : t('editStaff'))}</h2>{(!isChangingPass) && (<><input name="name" defaultValue={editingStaff?.name} required placeholder={t('name')} className={`w-full p-4 rounded-xl border outline-none focus:border-blue-500 ${inputClass}`} /><select name="category" defaultValue={editingStaff?.role} className={`w-full p-4 rounded-xl border outline-none focus:border-blue-500 ${inputClass}`}><option value="Pharmacist">Farmacéutico</option><option value="Cashier">Cajero</option><option value="Staff">Personal</option></select><input name="username" defaultValue={editingStaff?.username} required placeholder={t('userUser')} className={`w-full p-4 rounded-xl border outline-none focus:border-blue-500 ${inputClass}`} /></>)}<input name="password" type="password" placeholder={t('userPass')} className={`w-full p-4 rounded-xl border outline-none focus:border-blue-500 ${inputClass}`} />{isChangingPass && <p className="text-xs opacity-50">Escribe tu nueva contraseña</p>}<div className="flex gap-4 pt-2"><button type="button" onClick={() => { setIsAddingStaff(false); setEditingStaff(null); setIsChangingPass(false); }} className="flex-1 py-4 font-bold opacity-40 text-sm">{t('cancel')}</button><button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold text-sm active:scale-95">{t('save')}</button></div></form></div>)}

      {selectedOrder && (<div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[250] flex items-center justify-center p-6"><div className={`w-full max-w-sm p-6 rounded-3xl border shadow-2xl flex flex-col max-h-[80vh] ${bgCard}`}><div className="flex justify-between items-start mb-6"><div><h2 className="text-xl font-bold">{t('orderDetails')}</h2><p className="text-sm opacity-60">#{selectedOrder.id} • {selectedOrder.patient}</p></div><button onClick={() => setSelectedOrder(null)} className={`p-2 rounded-full ${theme==='dark'?'bg-neutral-800':'bg-gray-100'}`}>✕</button></div><div className="flex-1 overflow-y-auto space-y-3 mb-6">{selectedOrder.items.map((item, idx) => (<div key={idx} className={`flex justify-between items-center p-3 rounded-xl border ${theme==='dark'?'bg-black border-neutral-800':'bg-gray-50 border-gray-200'}`}><div><p className="font-bold text-sm">{item.name}</p><p className="text-xs opacity-50">x{item.qty}</p></div><span className="font-bold">${(item.price * item.qty).toFixed(2)}</span></div>))}</div><div className={`flex justify-between items-center mb-6 pt-4 border-t ${theme==='dark'?'border-neutral-800':'border-gray-200'}`}><span className="text-sm font-bold opacity-60">TOTAL</span><span className="text-2xl font-black text-blue-500">${selectedOrder.total}</span></div><button onClick={() => setConfirmModal({isOpen:true, type:'complete_order', id:selectedOrder.id, message:t('orderCompleted')})} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg active:scale-95 flex items-center justify-center gap-2"><Icons.Check className="w-5 h-5" /> {t('completeOrder')}</button></div></div>)}
      
      {/* MENU FIJO */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} labels={{Dashboard: t('dashboard'), Inventory: t('inventory'), Orders: t('orders'), Settings: t('settings')}} theme={theme} />
    </div>
  );
};

export default App;