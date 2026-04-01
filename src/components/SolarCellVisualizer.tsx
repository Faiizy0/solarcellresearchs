import React from 'react';
import { Simulation, IntermediateLayerType } from '../types';
import { Sun } from 'lucide-react';

const getLayerColor = (type: IntermediateLayerType | 'FrontContact' | 'BackContact') => {
  switch (type) {
    case 'FrontContact': return 'bg-slate-300 text-slate-800';
    case 'Window': return 'bg-[#4CAF50] text-white'; // Green
    case 'Buffer': return 'bg-[#E040FB] text-white'; // Purple
    case 'Absorber': return 'bg-[#FFE082] text-amber-900'; // Yellow
    case 'ETL': return 'bg-[#29B6F6] text-white'; // Blue
    case 'HTL': return 'bg-[#EF5350] text-white'; // Red
    case 'Interconnection': return 'bg-[#8D6E63] text-white'; // Brown
    case 'BackContact': return 'bg-[#546E7A] text-white'; // Dark Blue/Gray
    default: return 'bg-gray-500 text-white';
  }
};

export function SolarCellVisualizer({ simulation }: { simulation: Simulation }) {
  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-b from-yellow-900/10 to-[#111111] border border-gray-800 rounded-lg shadow-lg h-full min-h-[500px]">
      <div className="w-full flex justify-between items-start mb-8">
        <h3 className="text-lg font-semibold text-gray-200">Device Structure</h3>
        <div className="flex flex-col items-end text-yellow-500">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-wider">AM1.5G</span>
            <Sun size={28} className="animate-[spin_10s_linear_infinite]" />
          </div>
          <div className="flex gap-3 mt-2 mr-2">
            {/* Wavy arrows representing light spectrum */}
            <svg width="16" height="40" viewBox="0 0 16 40" className="text-yellow-400 stroke-current fill-none" strokeWidth="2.5">
              <path d="M8 0 Q16 6 8 13 T8 26 T8 35" />
              <path d="M4 30 L8 36 L12 30" />
            </svg>
            <svg width="16" height="40" viewBox="0 0 16 40" className="text-green-400 stroke-current fill-none mt-3" strokeWidth="2.5">
              <path d="M8 0 Q16 6 8 13 T8 26 T8 35" />
              <path d="M4 30 L8 36 L12 30" />
            </svg>
            <svg width="16" height="40" viewBox="0 0 16 40" className="text-blue-400 stroke-current fill-none mt-1" strokeWidth="2.5">
              <path d="M8 0 Q16 6 8 13 T8 26 T8 35" />
              <path d="M4 30 L8 36 L12 30" />
            </svg>
          </div>
        </div>
      </div>

      {/* 2D Layer Stack */}
      <div className="w-full max-w-[280px] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden border-x border-b border-gray-700 transform transition-transform hover:scale-105 duration-300">
        
        {/* Front Contact */}
        <div className={`w-full py-3 px-4 flex flex-col justify-center items-center text-center border-b border-black/20 ${getLayerColor('FrontContact')}`}>
          <span className="font-bold text-sm">{simulation.frontContact.name || 'Front Contact'}</span>
          <span className="text-[10px] uppercase tracking-wider opacity-70">Front Contact</span>
        </div>

        {/* Intermediate Layers */}
        {simulation.layers.map((layer) => (
          <div 
            key={layer.id} 
            className={`w-full py-5 px-4 flex flex-col justify-center items-center text-center border-b border-black/20 ${getLayerColor(layer.type)}`}
            style={{
              // Give slightly more height to Absorber layers to mimic reality visually
              paddingTop: layer.type === 'Absorber' ? '2rem' : '1.25rem',
              paddingBottom: layer.type === 'Absorber' ? '2rem' : '1.25rem',
            }}
          >
            <span className="font-bold text-sm drop-shadow-md">{layer.name || layer.type}</span>
            <span className="text-[10px] uppercase tracking-wider opacity-80 drop-shadow-md">{layer.type}</span>
            {layer.thickness && (
              <span className="text-[10px] mt-1 opacity-90 font-mono bg-black/10 px-1.5 rounded">
                {layer.thickness} µm
              </span>
            )}
          </div>
        ))}

        {/* Back Contact */}
        <div className={`w-full py-3 px-4 flex flex-col justify-center items-center text-center border-b border-black/20 ${getLayerColor('BackContact')}`}>
          <span className="font-bold text-sm">{simulation.backContact.name || 'Back Contact'}</span>
          <span className="text-[10px] uppercase tracking-wider opacity-70">Back Contact</span>
        </div>

        {/* Substrate (Visual only, common in these diagrams) */}
        <div className="w-full py-6 px-4 flex flex-col justify-center items-center text-center bg-[#1976D2] text-white">
          <span className="font-bold text-sm">Substrate</span>
          <span className="text-[10px] uppercase tracking-wider opacity-70">Glass / Flexible</span>
        </div>

      </div>
    </div>
  );
}
