export enum FluidState {
  SubcooledSuperheated = 'Subcooled/Superheated',
  Saturated = 'Saturated',
}

export enum InputMode {
  PT = 'Pressure & Temperature',
  PH = 'Pressure & Enthalpy',
  PS = 'Pressure & Entropy',
  PX = 'Pressure & Quality',
  TX = 'Temperature & Quality',
  TH = 'Temperature & Enthalpy',
}

export enum PressureUnit {
  MPa = 'MPa',
  bar = 'bar',
  kPa = 'kPa',
  atm = 'atm',
  psia = 'psia',
}

export enum TemperatureUnit {
  C = '°C',
  K = 'K',
  F = '°F',
  R = '°R',
}

export enum EnergyUnit {
  kJkg = 'kJ/kg',
  Btulb = 'Btu/lb',
}

export enum EntropyUnit {
  kJkgK = 'kJ/(kg·K)',
  BtulbR = 'Btu/(lb·°R)',
}

export enum VolumeUnit {
  m3kg = 'm³/kg',
  ft3lb = 'ft³/lb',
}

export interface SteamProperties {
  pressure: number; // MPa
  temperature: number; // °C
  enthalpy: number; // kJ/kg
  entropy: number; // kJ/kgK
  specificVolume: number; // m^3/kg
  internalEnergy: number; // kJ/kg
  quality: number | null; // 0-1 or null if undefined/superheated/subcooled
  phase: string;
}

export interface CalculationResult {
  properties: SteamProperties;
  description: string;
}

export interface InputState {
  fluidState: FluidState;
  mode: InputMode;
  value1: string;
  value2: string;
  unit1: string;
  unit2: string;
}