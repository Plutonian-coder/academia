'use client';

import { Card } from '@tremor/react';
import { LucideIcon } from 'lucide-react';

interface ModernStatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    icon: LucideIcon;
    color?: 'emerald' | 'blue' | 'amber' | 'red' | 'purple' | 'cyan';
}

const colorStyles = {
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-200' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-200' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-200' },
    red: { bg: 'bg-red-500/10', text: 'text-red-600', border: 'border-red-200' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-200' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-600', border: 'border-cyan-200' },
};

export default function ModernStatsCard({
    title,
    value,
    subtitle,
    trend,
    trendValue,
    icon: Icon,
    color = 'blue',
}: ModernStatsCardProps) {
    const styles = colorStyles[color];

    return (
        <div className={`p-6 rounded-2xl bg-white border ${styles.border} shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group`}>
            {/* Background decoration */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${styles.bg} opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out`} />

            <div className="flex justify-between items-start relative z-10">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${styles.bg} ${styles.text}`}>
                    <Icon size={24} />
                </div>
            </div>

            {(subtitle || trendValue) && (
                <div className="mt-4 flex items-center gap-2 relative z-10">
                    {trend && trendValue && (
                        <span className={`
              text-xs font-semibold px-2 py-1 rounded-full
              ${trend === 'up' ? 'bg-emerald-100 text-emerald-700' :
                                trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}
            `}>
                            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {trendValue}
                        </span>
                    )}
                    {subtitle && (
                        <span className="text-xs text-slate-400 font-medium">
                            {subtitle}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
