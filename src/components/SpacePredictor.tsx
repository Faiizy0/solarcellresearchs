import React, { useState } from 'react';
import { Simulation } from '../types';
import { GoogleGenAI, Type } from '@google/genai';
import { Sparkles, AlertTriangle, CheckCircle, Info, Loader2 } from 'lucide-react';

interface SpacePrediction {
  predictedPerformance: {
    voc: string;
    jsc: string;
    ff: string;
    pce: string;
  };
  pros: string[];
  cons: string[];
  suggestions: string;
}

export function SpacePredictor({ simulation }: { simulation: Simulation }) {
  const [prediction, setPrediction] = useState<SpacePrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `
        You are an expert Space Environment Predictor for solar cells.
        I have a solar cell simulation designed for Earth. I need you to predict its performance and behavior in a space environment (e.g., AM0 spectrum, high radiation, extreme temperature cycling, vacuum).
        
        Current Earth Simulation Data:
        - Name: ${simulation.name}
        - Front Contact: ${JSON.stringify(simulation.frontContact)}
        - Back Contact: ${JSON.stringify(simulation.backContact)}
        - Layers: ${JSON.stringify(simulation.layers.map(l => ({ type: l.type, material: l.name, thickness: l.thickness, bandgap: l.bandgap })))}
        - Current Earth Performance: ${JSON.stringify(simulation.performance)}
        
        Please provide:
        1. Predicted Performance (Voc, Jsc, FF, PCE) in space (AM0).
        2. Pros of this specific cell design in space.
        3. Cons or vulnerabilities of this design in space (e.g., radiation degradation, thermal stress).
        4. Comments and suggestions for improving this cell for space applications.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              predictedPerformance: {
                type: Type.OBJECT,
                properties: {
                  voc: { type: Type.STRING, description: 'Predicted Voc with units (e.g., "1.1 V")' },
                  jsc: { type: Type.STRING, description: 'Predicted Jsc with units (e.g., "40 mA/cm²")' },
                  ff: { type: Type.STRING, description: 'Predicted Fill Factor (e.g., "82%")' },
                  pce: { type: Type.STRING, description: 'Predicted Power Conversion Efficiency (e.g., "28%")' }
                },
                required: ['voc', 'jsc', 'ff', 'pce']
              },
              pros: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of pros for this cell in space'
              },
              cons: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of cons or vulnerabilities for this cell in space'
              },
              suggestions: {
                type: Type.STRING,
                description: 'Detailed comments and suggestions for improvement'
              }
            },
            required: ['predictedPerformance', 'pros', 'cons', 'suggestions']
          }
        }
      });

      if (response.text) {
        const result = JSON.parse(response.text) as SpacePrediction;
        setPrediction(result);
      } else {
        throw new Error('No response from AI');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to generate prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111111] border border-purple-500/30 rounded-xl overflow-hidden shadow-lg mt-6">
      <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 p-4 border-b border-purple-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-400" size={20} />
          <h2 className="text-lg font-bold text-purple-100">Space Environment Predictor (AI)</h2>
        </div>
        <button
          onClick={handlePredict}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {loading ? 'Analyzing...' : 'Predict Space Performance'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border-b border-red-500/30 text-red-400 text-sm flex items-start gap-2">
          <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {prediction && (
        <div className="p-6 space-y-6">
          {/* Performance Comparison */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Info size={16} className="text-blue-400" />
              Predicted AM0 Performance
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#1A1A1A] p-3 rounded-lg border border-gray-800">
                <div className="text-xs text-gray-500 mb-1">Voc</div>
                <div className="text-lg font-bold text-purple-300">{prediction.predictedPerformance.voc}</div>
              </div>
              <div className="bg-[#1A1A1A] p-3 rounded-lg border border-gray-800">
                <div className="text-xs text-gray-500 mb-1">Jsc</div>
                <div className="text-lg font-bold text-purple-300">{prediction.predictedPerformance.jsc}</div>
              </div>
              <div className="bg-[#1A1A1A] p-3 rounded-lg border border-gray-800">
                <div className="text-xs text-gray-500 mb-1">Fill Factor</div>
                <div className="text-lg font-bold text-purple-300">{prediction.predictedPerformance.ff}</div>
              </div>
              <div className="bg-[#1A1A1A] p-3 rounded-lg border border-gray-800">
                <div className="text-xs text-gray-500 mb-1">PCE</div>
                <div className="text-lg font-bold text-purple-300">{prediction.predictedPerformance.pce}</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Pros */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                Pros in Space
              </h3>
              <ul className="space-y-2">
                {prediction.pros.map((pro, i) => (
                  <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-400" />
                Cons & Vulnerabilities
              </h3>
              <ul className="space-y-2">
                {prediction.cons.map((con, i) => (
                  <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-blue-900/10 border border-blue-500/20 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wider mb-2">
              Suggestions for Improvement
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {prediction.suggestions}
            </p>
          </div>
        </div>
      )}
      
      {!prediction && !loading && !error && (
        <div className="p-8 text-center text-gray-500 text-sm">
          Click the button above to generate an AI prediction for how this solar cell design would perform in a space environment (AM0).
        </div>
      )}
    </div>
  );
}
