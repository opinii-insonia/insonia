import React from 'react';
import { cn } from "@/lib/utils";

interface Option {
  value: number;
  label: string;
}

interface QuestionCardProps {
  question: string;
  options: Option[];
  selectedValue: number;
  onChange: (value: number) => void;
  index: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  options, 
  selectedValue, 
  onChange,
  index 
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6 transition-all hover:shadow-md">
      <h3 className="text-lg font-medium text-slate-800 mb-4">
        <span className="text-blue-500 mr-2">{index + 1}.</span>
        {question}
      </h3>
      <div className="space-y-3">
        {options.map((opt) => {
          const isSelected = selectedValue === opt.value;
          return (
            <label 
              key={opt.value} 
              className={cn(
                "flex items-center p-4 border rounded-xl cursor-pointer transition-colors",
                isSelected 
                  ? "border-blue-500 bg-blue-50/50" 
                  : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
              )}
            >
              <div className={cn(
                "w-5 h-5 rounded-full border flex items-center justify-center mr-3",
                isSelected ? "border-blue-500" : "border-slate-300"
              )}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
              </div>
              <input 
                type="radio" 
                name={`question-${index}`} 
                value={opt.value} 
                checked={isSelected}
                onChange={() => onChange(opt.value)}
                className="hidden"
              />
              <span className={cn(
                "text-base",
                isSelected ? "text-blue-900 font-medium" : "text-slate-600"
              )}>
                {opt.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};