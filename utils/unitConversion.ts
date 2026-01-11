import { PressureUnit, TemperatureUnit, EnergyUnit, EntropyUnit, VolumeUnit } from '../types';

export const convertPressure = (value: number, toUnit: string): number => {
  // Base unit is MPa
  switch (toUnit) {
    case PressureUnit.MPa: return value;
    case PressureUnit.bar: return value * 10;
    case PressureUnit.kPa: return value * 1000;
    case PressureUnit.atm: return value * 9.86923;
    case PressureUnit.psia: return value * 145.038;
    default: return value;
  }
};

export const convertTemperature = (value: number, toUnit: string): number => {
  // Base unit is Celsius
  switch (toUnit) {
    case TemperatureUnit.C: return value;
    case TemperatureUnit.K: return value + 273.15;
    case TemperatureUnit.F: return (value * 9/5) + 32;
    case TemperatureUnit.R: return (value + 273.15) * 1.8;
    default: return value;
  }
};

export const convertVolume = (value: number, toUnit: string): number => {
  // Base unit is m^3/kg
  switch (toUnit) {
    case VolumeUnit.m3kg: return value;
    case VolumeUnit.ft3lb: return value * 16.0185;
    default: return value;
  }
};

export const convertEnergy = (value: number, toUnit: string): number => {
  // Base unit is kJ/kg
  switch (toUnit) {
    case EnergyUnit.kJkg: return value;
    case EnergyUnit.Btulb: return value / 2.326;
    default: return value;
  }
};

export const convertEntropy = (value: number, toUnit: string): number => {
  // Base unit is kJ/(kg·K)
  switch (toUnit) {
    case EntropyUnit.kJkgK: return value;
    case EntropyUnit.BtulbR: return value / 4.1868;
    default: return value;
  }
};