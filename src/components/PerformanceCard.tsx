import React from 'react';
import { Performance } from '../types';
import { Input } from './InputGroup';
import { Activity } from 'lucide-react';

interface Props {
  data: Performance;
  onChange: (data: Performance) => void;
}

export function PerformanceCard({ data, onChange }: Props) {
  const handleChange = (field: keyof Performance, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-[#111111] border border-green-900/50 rounded-lg p-4 shadow-lg mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-green-500/10 text-green-500 rounded-md">
          <Activity size={18} />
        </div>
        <h3 className="text-lg font-semibold text-gray-200">Performance Results</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Input 
          label="Voc (V)" 
          type="number" 
          step="any"
          value={data.voc} 
          onChange={e => handleChange('voc', e.target.value)} 
        />
        <Input 
          label="Jsc (mA/cm²)" 
          type="number" 
          step="any"
          value={data.jsc} 
          onChange={e => handleChange('jsc', e.target.value)} 
        />
        <Input 
          label="FF (%)" 
          type="number" 
          step="any"
          value={data.ff} 
          onChange={e => handleChange('ff', e.target.value)} 
        />
        <Input 
          label="PCE (%)" 
          type="number" 
          step="any"
          value={data.pce} 
          onChange={e => handleChange('pce', e.target.value)} 
        />
      </div>
    </div>
  );
}
