
import React from 'react';
import { Icons } from '../constants';
import { InventoryItem } from '../types';

interface InventoryItemRowProps {
  item: InventoryItem;
  onEdit: (id: string) => void;
}

const InventoryItemRow: React.FC<InventoryItemRowProps> = ({ item, onEdit }) => {
  const isLow = item.stock <= item.threshold;
  
  return (
    <div className="flex items-center justify-between p-4 bg-neutral-900/50 border-b border-neutral-800/50 hover:bg-neutral-800/40 transition-colors">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-gray-100">{item.name}</span>
        <div className="flex items-center gap-2">
           <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-medium">
            {item.category}
          </span>
          <span className="text-[10px] text-neutral-500">Exp: {item.expiryDate}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className={`text-sm font-bold ${isLow ? 'text-rose-500' : 'text-emerald-500'}`}>
            {item.stock}
          </span>
          <span className="text-[10px] text-neutral-500">units</span>
        </div>
        
        <button 
          onClick={() => onEdit(item.id)}
          className="p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:bg-blue-600 hover:text-white transition-all active:scale-95"
        >
          <Icons.Edit className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default InventoryItemRow;
