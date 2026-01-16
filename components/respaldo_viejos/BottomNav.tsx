
import React from 'react';
import { Icons } from '../constants';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  labels: Record<TabType, string>;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, labels }) => {
  const tabs: { id: TabType; icon: React.FC<any> }[] = [
    { id: 'Dashboard', icon: Icons.Dashboard },
    { id: 'Inventory', icon: Icons.Inventory },
    { id: 'Orders', icon: Icons.Orders },
    { id: 'Settings', icon: Icons.Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800/60 pb-safe shadow-2xl z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center w-full h-full transition-all group"
            >
              <Icon className={`w-5 h-5 mb-1 transition-all ${isActive ? 'text-blue-500 scale-110' : 'text-neutral-500 group-hover:text-neutral-300'}`} />
              <span className={`text-[9px] font-bold uppercase tracking-tighter ${isActive ? 'text-blue-500' : 'text-neutral-500'}`}>
                {labels[tab.id]}
              </span>
              {isActive && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
