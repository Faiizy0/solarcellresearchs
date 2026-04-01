import React from 'react';
import { InterfaceDefect, DefectType, EnergeticDistribution } from '../types';
import { Input, Select } from './InputGroup';
import { Link2 } from 'lucide-react';

interface Props {
  data: InterfaceDefect;
  index: number;
  onChange: (data: InterfaceDefect) => void;
}

const DEFECT_TYPES = [
  { value: 'Neutral', label: 'Neutral' },
  { value: 'Donor', label: 'Donor' },
  { value: 'Acceptor', label: 'Acceptor' }
];

const ENERGETIC_DISTRIBUTIONS = [
  { value: 'Single', label: 'Single' },
  { value: 'Uniform', label: 'Uniform' },
  { value: 'Gau', label: 'Gaussian' },
  { value: 'CB tail', label: 'CB tail' },
  { value: 'VB tail', label: 'VB tail' }
];

export function InterfaceCard({ data, index, onChange }: Props) {
  const handleChange = (field: keyof InterfaceDefect, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="mx-8 my-2 bg-[#1A1A1A] border border-gray-800 rounded-lg p-3 shadow-md relative">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1A1A1A] px-2 text-gray-500">
        <Link2 size={16} />
      </div>
      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 text-center">
        Interface Defect {index}
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Select 
          label="Defect Type" 
          options={DEFECT_TYPES}
          value={data.defectType} 
          onChange={e => handleChange('defectType', e.target.value as DefectType)} 
        />
        <Select 
          label="Energetic Dist." 
          options={ENERGETIC_DISTRIBUTIONS}
          value={data.energeticDistribution} 
          onChange={e => handleChange('energeticDistribution', e.target.value as EnergeticDistribution)} 
        />
        <Input 
          label="Capture e⁻ (cm²)" 
          type="number" 
          step="any"
          value={data.captureE} 
          onChange={e => handleChange('captureE', e.target.value)} 
        />
        <Input 
          label="Capture h⁺ (cm²)" 
          type="number" 
          step="any"
          value={data.captureH} 
          onChange={e => handleChange('captureH', e.target.value)} 
        />
        <Input 
          label="Energy Level (eV)" 
          type="number" 
          step="any"
          value={data.energyLevel} 
          onChange={e => handleChange('energyLevel', e.target.value)} 
        />
        <Input 
          label="Defect Density (cm⁻²)" 
          type="number" 
          step="any"
          value={data.defectDensity} 
          onChange={e => handleChange('defectDensity', e.target.value)} 
        />
      </div>
    </div>
  );
}
