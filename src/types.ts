export type DefectType = 'Neutral' | 'Donor' | 'Acceptor' | '';
export type EnergeticDistribution = 'Single' | 'Uniform' | 'Gau' | 'CB tail' | 'VB tail' | '';
export type IntermediateLayerType = 'Window' | 'Buffer' | 'Absorber' | 'ETL' | 'HTL' | 'Interconnection';

export interface ContactLayer {
  name: string;
  workFunction: string;
  srvElectron: string;
  srvHole: string;
}

export interface IntermediateLayer {
  id: string;
  type: IntermediateLayerType;
  name: string;
  thickness: string;
  bandgap: string;
  electronAffinity: string;
  dielectricPermittivity: string;
  cbDos: string;
  vbDos: string;
  eMobility: string;
  hMobility: string;
  donorDensity: string;
  acceptorDensity: string;
  defectType: DefectType;
  energeticDistribution: EnergeticDistribution;
  captureE: string;
  captureH: string;
  energyLevel: string;
  defectDensity: string;
}

export interface InterfaceDefect {
  id: string;
  defectType: DefectType;
  energeticDistribution: EnergeticDistribution;
  captureE: string;
  captureH: string;
  energyLevel: string;
  defectDensity: string;
}

export interface Performance {
  voc: string;
  jsc: string;
  ff: string;
  pce: string;
}

export interface Simulation {
  id: string;
  userId?: string;
  name: string;
  frontContact: ContactLayer;
  backContact: ContactLayer;
  layers: IntermediateLayer[];
  interfaces: InterfaceDefect[];
  performance?: Performance;
  updatedAt: number;
}

export const defaultFrontContact = (): ContactLayer => ({
  name: '',
  workFunction: '',
  srvElectron: '1.00E+7',
  srvHole: '1.00E+5'
});

export const defaultBackContact = (): ContactLayer => ({
  name: '',
  workFunction: '',
  srvElectron: '1.00E+5',
  srvHole: '1.00E+7'
});

export const defaultLayer = (type: IntermediateLayerType): IntermediateLayer => ({
  id: crypto.randomUUID(),
  type,
  name: '',
  thickness: '',
  bandgap: '',
  electronAffinity: '',
  dielectricPermittivity: '',
  cbDos: '',
  vbDos: '',
  eMobility: '',
  hMobility: '',
  donorDensity: '',
  acceptorDensity: '',
  defectType: 'Neutral',
  energeticDistribution: 'Single',
  captureE: '1E-15',
  captureH: '1E-15',
  energyLevel: '0.6',
  defectDensity: '1E+10'
});

export const defaultInterface = (): InterfaceDefect => ({
  id: crypto.randomUUID(),
  defectType: 'Neutral',
  energeticDistribution: 'Single',
  captureE: '1E-15',
  captureH: '1E-15',
  energyLevel: '0.6',
  defectDensity: '1E+10'
});

export const defaultPerformance = (): Performance => ({
  voc: '',
  jsc: '',
  ff: '',
  pce: ''
});

export const defaultSimulation = (): Simulation => ({
  id: crypto.randomUUID(),
  name: 'New Simulation',
  frontContact: defaultFrontContact(),
  backContact: defaultBackContact(),
  layers: [],
  interfaces: [],
  performance: defaultPerformance(),
  updatedAt: Date.now()
});
