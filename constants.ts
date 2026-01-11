import { InputMode, FluidState, PressureUnit, TemperatureUnit, EnergyUnit, EntropyUnit } from './types';

export const DEFAULT_INPUT_STATE = {
  fluidState: FluidState.SubcooledSuperheated,
  mode: InputMode.PT,
  value1: '0.101325', // Default 1 atm in MPa
  value2: '100', // Default 100 C
  unit1: PressureUnit.MPa,
  unit2: TemperatureUnit.C,
};

// Map each FluidState to a list of available InputModes
export const FLUID_STATE_MODES: Record<FluidState, InputMode[]> = {
  [FluidState.SubcooledSuperheated]: [
    InputMode.PT,
    InputMode.PH,
    InputMode.PS,
    InputMode.TH
  ],
  [FluidState.Saturated]: [
    InputMode.PX,
    InputMode.TX
  ],
};

export const MODE_CONFIG: Record<InputMode, { 
  label1: string; 
  label2: string; 
  defaultUnit1: string; 
  defaultUnit2: string; 
  units1: string[]; 
  units2: string[] 
}> = {
  [InputMode.PT]: {
    label1: 'Pressure',
    label2: 'Temperature',
    defaultUnit1: PressureUnit.MPa,
    defaultUnit2: TemperatureUnit.C,
    units1: Object.values(PressureUnit),
    units2: Object.values(TemperatureUnit),
  },
  [InputMode.PH]: {
    label1: 'Pressure',
    label2: 'Enthalpy',
    defaultUnit1: PressureUnit.MPa,
    defaultUnit2: EnergyUnit.kJkg,
    units1: Object.values(PressureUnit),
    units2: Object.values(EnergyUnit),
  },
  [InputMode.PS]: {
    label1: 'Pressure',
    label2: 'Entropy',
    defaultUnit1: PressureUnit.MPa,
    defaultUnit2: EntropyUnit.kJkgK,
    units1: Object.values(PressureUnit),
    units2: Object.values(EntropyUnit),
  },
  [InputMode.PX]: {
    label1: 'Pressure (Saturation)',
    label2: 'Quality (x)',
    defaultUnit1: PressureUnit.MPa,
    defaultUnit2: '-',
    units1: Object.values(PressureUnit),
    units2: ['-'],
  },
  [InputMode.TX]: {
    label1: 'Temperature (Saturation)',
    label2: 'Quality (x)',
    defaultUnit1: TemperatureUnit.C,
    defaultUnit2: '-',
    units1: Object.values(TemperatureUnit),
    units2: ['-'],
  },
  [InputMode.TH]: {
    label1: 'Temperature',
    label2: 'Enthalpy',
    defaultUnit1: TemperatureUnit.C,
    defaultUnit2: EnergyUnit.kJkg,
    units1: Object.values(TemperatureUnit),
    units2: Object.values(EnergyUnit),
  },
};