import React from 'react';
import { IntermediateLayer, DefectType, EnergeticDistribution } from '../types';
import { Input, Section, Select } from './InputGroup';
import { Layers, Trash2 } from 'lucide-react';

interface Props {
  data: IntermediateLayer;
  index: number;
  onChange: (data: IntermediateLayer) => void;
  onDelete: () => void;
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

export function LayerCard({ data, index, onChange, onDelete }: Props) {
  const handleChange = (field: keyof IntermediateLayer, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-[#111111] border border-gray-800 rounded-lg p-4 shadow-lg relative group transition-all hover:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 text-blue-500 rounded-md">
            <Layers size={18} />
          </div>
          <h3 className="text-lg font-semibold text-gray-200">
            Layer {index}: {data.type}
          </h3>
        </div>
        <button 
          onClick={onDelete}
          className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
          title="Delete Layer"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Input 
          label="Material Name" 
          value={data.name} 
          onChange={e => handleChange('name', e.target.value)} 
          placeholder="e.g. Perovskite"
        />
        <Input 
          label="Thickness (µm)" 
          type="number" 
          step="any"
          value={data.thickness} 
          onChange={e => handleChange('thickness', e.target.value)} 
        />
        <Input 
          label="Bandgap (eV)" 
          type="number" 
          step="any"
          value={data.bandgap} 
          onChange={e => handleChange('bandgap', e.target.value)} 
        />
        <Input 
          label="Electron Affinity (eV)" 
          type="number" 
          step="any"
          value={data.electronAffinity} 
          onChange={e => handleChange('electronAffinity', e.target.value)} 
        />
        <Input 
          label="Dielectric Permittivity" 
          type="number" 
          step="any"
          value={data.dielectricPermittivity} 
          onChange={e => handleChange('dielectricPermittivity', e.target.value)} 
        />
      </div>

      <Section title="Mobility & DOS">
        <Input 
          label="CB DOS (cm⁻³)" 
          type="number" 
          step="any"
          value={data.cbDos} 
          onChange={e => handleChange('cbDos', e.target.value)} 
        />
        <Input 
          label="VB DOS (cm⁻³)" 
          type="number" 
          step="any"
          value={data.vbDos} 
          onChange={e => handleChange('vbDos', e.target.value)} 
        />
        <Input 
          label="e⁻ Mobility (cm²/Vs)" 
          type="number" 
          step="any"
          value={data.eMobility} 
          onChange={e => handleChange('eMobility', e.target.value)} 
        />
        <Input 
          label="h⁺ Mobility (cm²/Vs)" 
          type="number" 
          step="any"
          value={data.hMobility} 
          onChange={e => handleChange('hMobility', e.target.value)} 
        />
      </Section>

      <Section title="Doping">
        <Input 
          label="Donor Density (cm⁻³)" 
          type="number" 
          step="any"
          value={data.donorDensity} 
          onChange={e => handleChange('donorDensity', e.target.value)} 
        />
        <Input 
          label="Acceptor Density (cm⁻³)" 
          type="number" 
          step="any"
          value={data.acceptorDensity} 
          onChange={e => handleChange('acceptorDensity', e.target.value)} 
        />
      </Section>

      <Section title="Bulk Defect">
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
          label="Defect Density (cm⁻³)" 
          type="number" 
          step="any"
          value={data.defectDensity} 
          onChange={e => handleChange('defectDensity', e.target.value)} 
        />
      </Section>
    </div>
  );
}
