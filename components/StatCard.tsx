
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  variant?: 'blue' | 'orange' | 'green' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subtext, variant = 'blue' }) => {
  const variantStyles = {
    blue: 'bg-blue-900/20 border-blue-800/50 text-blue-400',
    orange: 'bg-orange-900/20 border-orange-800/50 text-orange-400',
    green: 'bg-emerald-900/20 border-emerald-800/50 text-emerald-400',
    red: 'bg-rose-900/20 border-rose-800/50 text-rose-400'
  };

  const bgCircles = {
    blue: 'bg-blue-500/10',
    orange: 'bg-orange-500/10',
    green: 'bg-emerald-500/10',
    red: 'bg-rose-500/10'
  };

  return (
    <div className={`relative overflow-hidden p-4 rounded-2xl border ${variantStyles[variant]} transition-all duration-300 hover:shadow-lg hover:shadow-black/40`}>
      <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full ${bgCircles[variant]}`} />
      <p className="text-xs font-medium uppercase tracking-wider opacity-80 mb-1">{label}</p>
      <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
      {subtext && <p className="text-[10px] mt-1 opacity-60 font-medium">{subtext}</p>}
    </div>
  );
};

export default StatCard;
