import React from 'react';
import { cn } from "@/lib/utils";
import { Activity, Moon } from 'lucide-react';

interface ResultCardProps {
  title: string;
  score: number;
  maxScore: number;
  classification: string;
  type: 'epworth' | 'insomnia';
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, score, maxScore, classification, type }) => {
  
  // Define cores baseadas na palavra-chave da classificação para feedback visual
  const getSeverityColor = (cls: string) => {
    const lowerCls = cls.toLowerCase();
    if (lowerCls.includes('normal') || lowerCls.includes('ausência')) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (lowerCls.includes('leve')) return 'text-amber-600 bg-amber-50 border-amber-200';
    if (lowerCls.includes('moderado') || lowerCls.includes('moderada')) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (lowerCls.includes('grave')) return 'text-rose-600 bg-rose-50 border-rose-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const colors = getSeverityColor(classification);
  const Icon = type === 'epworth' ? Moon : Activity;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-400">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
      
      <div className="flex items-baseline space-x-1 my-4">
        <span className="text-4xl font-bold text-slate-900">{score}</span>
        <span className="text-slate-400">/ {maxScore}</span>
      </div>

      <div className={cn("px-4 py-2 rounded-full border font-medium text-sm mt-2 w-full", colors)}>
        {classification}
      </div>
    </div>
  );
};