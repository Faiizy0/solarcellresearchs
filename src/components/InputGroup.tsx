import React from 'react';

interface InputProps {
  label: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  step?: string;
  placeholder?: string;
}

export function Input({ label, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
      <input
        className="bg-[#1A1A1A] border border-gray-800 rounded px-2 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        {...props}
      />
    </div>
  );
}

interface SelectProps {
  label: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function Select({ label, options, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
      <select
        className="bg-[#1A1A1A] border border-gray-800 rounded px-2 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none"
        {...props}
      >
        <option value="" disabled>Select...</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="mt-4 border-t border-gray-800 pt-3">
      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{title}</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {children}
      </div>
    </div>
  );
}
