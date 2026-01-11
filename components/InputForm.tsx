import React from 'react';
import { InputMode, InputState, FluidState } from '../types';
import { MODE_CONFIG, FLUID_STATE_MODES } from '../constants';
import { BeakerIcon, CalculatorIcon } from '@heroicons/react/24/outline';

interface InputFormProps {
  inputState: InputState;
  setInputState: React.Dispatch<React.SetStateAction<InputState>>;
  onCalculate: () => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ inputState, setInputState, onCalculate, isLoading }) => {
  const currentConfig = MODE_CONFIG[inputState.mode];

  const handleFluidStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value as FluidState;
    const availableModes = FLUID_STATE_MODES[newState];
    
    // Default to the first mode available for the new state
    const newMode = availableModes[0];
    const newConfig = MODE_CONFIG[newMode];

    setInputState({
      fluidState: newState,
      mode: newMode,
      value1: '',
      value2: '',
      unit1: newConfig.defaultUnit1,
      unit2: newConfig.defaultUnit2,
    });
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = e.target.value as InputMode;
    const newConfig = MODE_CONFIG[newMode];
    setInputState(prev => ({
      ...prev,
      mode: newMode,
      value1: '',
      value2: '',
      unit1: newConfig.defaultUnit1,
      unit2: newConfig.defaultUnit2,
    }));
  };

  const handleInputChange = (field: 'value1' | 'value2', value: string) => {
    setInputState(prev => ({ ...prev, [field]: value }));
  };

  const handleUnitChange = (field: 'unit1' | 'unit2', value: string) => {
    setInputState(prev => ({ ...prev, [field]: value }));
  };

  const availableModes = FLUID_STATE_MODES[inputState.fluidState];

  return (
    <div className="bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-900/30 rounded-lg text-blue-400">
          <BeakerIcon className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-100">State Configuration</h2>
      </div>

      <div className="space-y-6">
        {/* Fluid State Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Fluid State</label>
          <select
            value={inputState.fluidState}
            onChange={handleFluidStateChange}
            className="w-full bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 transition-colors placeholder-gray-400"
          >
            {Object.values(FluidState).map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            {inputState.fluidState === FluidState.SubcooledSuperheated 
              ? "For subcooled liquid or superheated steam regions."
              : "For saturated liquid/vapor mixtures (inside the vapor dome)."}
          </p>
        </div>

        {/* Input Mode Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Input Variables</label>
          <select
            value={inputState.mode}
            onChange={handleModeChange}
            className="w-full bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 transition-colors"
          >
            {availableModes.map((mode) => (
              <option key={mode} value={mode}>{mode}</option>
            ))}
          </select>
        </div>

        <div className="h-px bg-gray-700 my-2"></div>

        {/* Value 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">{currentConfig.label1}</label>
            <input
              type="number"
              value={inputState.value1}
              onChange={(e) => handleInputChange('value1', e.target.value)}
              placeholder="Enter value"
              className="w-full bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Unit</label>
            <select
              value={inputState.unit1}
              onChange={(e) => handleUnitChange('unit1', e.target.value)}
              disabled={currentConfig.units1.length === 1}
              className="w-full bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
            >
              {currentConfig.units1.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        {/* Value 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">{currentConfig.label2}</label>
            <input
              type="number"
              value={inputState.value2}
              onChange={(e) => handleInputChange('value2', e.target.value)}
              placeholder="Enter value"
              className="w-full bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Unit</label>
            <select
              value={inputState.unit2}
              onChange={(e) => handleUnitChange('unit2', e.target.value)}
              disabled={currentConfig.units2.length === 1}
              className="w-full bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
            >
              {currentConfig.units2.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={onCalculate}
          disabled={isLoading || !inputState.value1 || !inputState.value2}
          className={`w-full flex items-center justify-center gap-2 text-white font-medium rounded-lg text-sm px-5 py-3.5 text-center transition-all shadow-md hover:shadow-lg
            ${isLoading || !inputState.value1 || !inputState.value2 
              ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5'}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Calculating...
            </>
          ) : (
            <>
              <CalculatorIcon className="w-5 h-5" />
              Calculate Properties
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputForm;