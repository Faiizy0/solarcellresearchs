import React, { useState } from 'react';
import { useSimulations } from './store';
import { ContactCard } from './components/ContactCard';
import { LayerCard } from './components/LayerCard';
import { InterfaceCard } from './components/InterfaceCard';
import { PerformanceCard } from './components/PerformanceCard';
import { SolarCellVisualizer } from './components/SolarCellVisualizer';
import { SpacePredictor } from './components/SpacePredictor';
import { defaultLayer, defaultInterface, defaultPerformance, IntermediateLayerType } from './types';
import { Plus, Trash2, Menu, X, FileJson } from 'lucide-react';

const LAYER_TYPES: IntermediateLayerType[] = [
  'Window', 'Buffer', 'Absorber', 'ETL', 'HTL', 'Interconnection'
];

function AddLayerDivider({ onAdd }: { onAdd: (type: IntermediateLayerType) => void }) {
  return (
    <div className="flex justify-center relative group z-10 py-2">
      <div className="absolute inset-0 flex items-center pointer-events-none">
        <div className="w-full border-t border-gray-800 group-hover:border-blue-500/50 border-dashed transition-colors"></div>
      </div>
      <div className="relative">
        <button className="flex items-center gap-1 px-3 py-1.5 bg-[#0A0A0A] group-hover:bg-blue-600 text-gray-500 group-hover:text-white rounded-full text-xs font-medium transition-colors border border-gray-800 group-hover:border-blue-500 shadow-sm">
          <Plus size={14} />
          <span className="hidden group-hover:inline">Add Layer</span>
        </button>
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#1A1A1A] border border-gray-700 rounded-lg shadow-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-40">
          {LAYER_TYPES.map(type => (
            <button
              key={type}
              onClick={() => onAdd(type)}
              className="w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-blue-500/10 hover:text-blue-400 rounded transition-colors"
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const {
    simulations,
    activeSimulation,
    activeId,
    setActiveId,
    updateSimulation,
    addSimulation,
    deleteSimulation,
    loading: simsLoading
  } = useSimulations();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (simsLoading) {
    return <div className="flex h-screen items-center justify-center bg-[#0A0A0A] text-gray-400">Loading simulations...</div>;
  }

  if (!activeSimulation) return null;

  const handleAddLayer = (type: IntermediateLayerType, insertIndex?: number) => {
    const newLayer = defaultLayer(type);
    const newLayers = [...activeSimulation.layers];
    let newInterfaces = [...activeSimulation.interfaces];

    if (insertIndex !== undefined) {
      newLayers.splice(insertIndex, 0, newLayer);
      if (newLayers.length > 1) {
        const interfaceIndex = Math.min(insertIndex, newInterfaces.length);
        newInterfaces.splice(interfaceIndex, 0, defaultInterface());
      }
    } else {
      newLayers.push(newLayer);
      if (newLayers.length > 1) {
        newInterfaces.push(defaultInterface());
      }
    }
    
    updateSimulation(activeId, { layers: newLayers, interfaces: newInterfaces });
  };

  const handleDeleteLayer = (index: number) => {
    const newLayers = [...activeSimulation.layers];
    newLayers.splice(index, 1);
    
    const newInterfaces = [...activeSimulation.interfaces];
    if (newInterfaces.length > 0) {
      // Remove the interface before this layer, or the one after if it's the first
      const interfaceIndex = index === 0 ? 0 : index - 1;
      newInterfaces.splice(interfaceIndex, 1);
    }
    
    updateSimulation(activeId, { layers: newLayers, interfaces: newInterfaces });
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-gray-200 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} flex-shrink-0 bg-[#111111] border-r border-gray-800 transition-all duration-300 overflow-hidden flex flex-col`}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h1 className="font-bold text-gray-200 flex items-center gap-2">
            <FileJson size={18} className="text-blue-500" />
            Simulations
          </h1>
          <button onClick={addSimulation} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
            <Plus size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {simulations.map(sim => (
            <div 
              key={sim.id}
              className={`flex items-center justify-between p-2 rounded cursor-pointer group ${activeId === sim.id ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-gray-800 text-gray-400'}`}
              onClick={() => setActiveId(sim.id)}
            >
              <span className="truncate text-sm font-medium">{sim.name || 'Untitled'}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteSimulation(sim.id); }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 rounded"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-gray-800 bg-[#111111] flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 hover:bg-gray-800 rounded text-gray-400">
              <Menu size={20} />
            </button>
            <input 
              type="text"
              value={activeSimulation.name}
              onChange={e => updateSimulation(activeId, { name: e.target.value })}
              className="bg-transparent border-none text-lg font-bold focus:outline-none focus:ring-0 w-64"
              placeholder="Simulation Name"
            />
          </div>
        </header>

        {/* Editor Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col lg:flex-row gap-6">
          <div className="flex-1 max-w-4xl space-y-6 pb-20">
            {/* Performance Results */}
            <PerformanceCard 
              data={activeSimulation.performance || defaultPerformance()} 
              onChange={data => updateSimulation(activeId, { performance: data })} 
            />

            {/* Space Predictor */}
            <SpacePredictor simulation={activeSimulation} />

            {/* Front Contact */}
            <ContactCard 
              type="Front Contact" 
              data={activeSimulation.frontContact} 
              onChange={data => updateSimulation(activeId, { frontContact: data })} 
            />

            <AddLayerDivider onAdd={(type) => handleAddLayer(type, 0)} />

            {/* Intermediate Layers and Interfaces */}
            {activeSimulation.layers.map((layer, index) => (
              <React.Fragment key={layer.id}>
                {index > 0 && (
                  <>
                    <InterfaceCard 
                      index={index}
                      data={activeSimulation.interfaces[index - 1]}
                      onChange={data => {
                        const newInterfaces = [...activeSimulation.interfaces];
                        newInterfaces[index - 1] = data;
                        updateSimulation(activeId, { interfaces: newInterfaces });
                      }}
                    />
                    <AddLayerDivider onAdd={(type) => handleAddLayer(type, index)} />
                  </>
                )}
                <LayerCard 
                  index={index + 1}
                  data={layer}
                  onDelete={() => handleDeleteLayer(index)}
                  onChange={data => {
                    const newLayers = [...activeSimulation.layers];
                    newLayers[index] = data;
                    updateSimulation(activeId, { layers: newLayers });
                  }}
                />
              </React.Fragment>
            ))}

            {activeSimulation.layers.length > 0 && (
              <AddLayerDivider onAdd={(type) => handleAddLayer(type, activeSimulation.layers.length)} />
            )}

            {/* Back Contact */}
            <ContactCard 
              type="Back Contact" 
              data={activeSimulation.backContact} 
              onChange={data => updateSimulation(activeId, { backContact: data })} 
            />
          </div>

          {/* Visualizer Panel */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
            <div className="sticky top-0">
              <SolarCellVisualizer simulation={activeSimulation} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
