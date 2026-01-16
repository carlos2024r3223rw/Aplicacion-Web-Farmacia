import React from 'react';
import Icons from './Icons';

export const StatCard = ({ label, value, variant = 'blue', onClick, theme }: any) => {
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

export const BottomNav = ({ activeTab, onTabChange, labels, theme, role }: any) => {
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