import React from 'react';
import { ContactLayer } from '../types';
import { Input, Section } from './InputGroup';
import { Zap } from 'lucide-react';

interface Props {
  type: 'Front Contact' | 'Back Contact';
  data: ContactLayer;
  onChange: (data: ContactLayer) => void;
}

export function ContactCard({ type, data, onChange }: Props) {
  const handleChange = (field: keyof ContactLayer, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-[#111111] border border-gray-800 rounded-lg p-4 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-yellow-500/10 text-yellow-500 rounded-md">
          <Zap size={18} />
        </div>
        <h3 className="text-lg font-semibold text-gray-200">{type}</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Input 
          label="Material Name" 
          value={data.name} 
          onChange={e => handleChange('name', e.target.value)} 
          placeholder="e.g. FTO"
        />
        <Input 
          label="Work Function (eV)" 
          type="number" 
          step="any"
          value={data.workFunction} 
          onChange={e => handleChange('workFunction', e.target.value)} 
        />
        <Input 
          label="S.R.V. Electron (m/s)" 
          type="number" 
          step="any"
          value={data.srvElectron} 
          onChange={e => handleChange('srvElectron', e.target.value)} 
        />
        <Input 
          label="S.R.V. Hole (m/s)" 
          type="number" 
          step="any"
          value={data.srvHole} 
          onChange={e => handleChange('srvHole', e.target.value)} 
        />
      </div>
    </div>
  );
}
