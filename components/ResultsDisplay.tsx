import React, { useState, useEffect } from 'react';
import { CalculationResult, PressureUnit, TemperatureUnit, VolumeUnit, EnergyUnit, EntropyUnit } from '../types';
import { CubeTransparentIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { convertPressure, convertTemperature, convertVolume, convertEnergy, convertEntropy } from '../utils/unitConversion';

interface ResultsDisplayProps {
  result: CalculationResult | null;
}

const ResultRow: React.FC<{ 
  label: string; 
  value: number; 
  currentUnit: string;
  availableUnits?: string[];
  onUnitChange?: (unit: string) => void;
  description?: string;
  displayValueOverride?: string;
}> = ({ label, value, currentUnit, availableUnits, onUnitChange, description, displayValueOverride }) => {
  
  const formattedValue = displayValueOverride 
    ? displayValueOverride 
    : (Math.abs(value) < 0.0001 || Math.abs(value) > 10000) 
      ? value.toExponential(5) 
      : value.toFixed(5);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-700 last:border-0 hover:bg-gray-700/50 transition-colors px-2 rounded-md group">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-400">{label}</span>
        {description && <span className="text-xs text-gray-500">{description}</span>}
      </div>
      <div className="flex items-center gap-2 mt-1 sm:mt-0">
        <span className="text-lg font-bold text-gray-100 font-mono tracking-tight">{formattedValue}</span>
        
        {availableUnits && onUnitChange ? (
          <select 
            value={currentUnit}
            onChange={(e) => onUnitChange(e.target.value)}
            className="text-xs font-medium text-blue-400 bg-gray-700 border border-gray-600 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            {availableUnits.map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        ) : (
          <span className="text-xs font-medium text-gray-500 w-16 text-right">{currentUnit}</span>
        )}
      </div>
    </div>
  );
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const [pUnit, setPUnit] = useState<string>(PressureUnit.MPa);
  const [tUnit, setTUnit] = useState<string>(TemperatureUnit.C);
  const [vUnit, setVUnit] = useState<string>(VolumeUnit.m3kg);
  const [eUnit, setEUnit] = useState<string>(EnergyUnit.kJkg); // For Internal Energy & Enthalpy
  const [sUnit, setSUnit] = useState<string>(EntropyUnit.kJkgK);

  if (!result) {
    return (
      <div className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700 h-full flex flex-col items-center justify-center text-center">
        <div className="bg-gray-700 p-6 rounded-full mb-4">
          <CubeTransparentIcon className="w-12 h-12 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">Waiting for Input</h3>
        <p className="text-gray-500 text-sm max-w-xs">
          Select fluid state and input variables on the left panel, then click Calculate.
        </p>
      </div>
    );
  }

  const { properties } = result;

  // Format quality for display (Quality is unitless, so no conversion needed)
  let qualityDisplay = "-";
  if (properties.quality !== null && properties.quality !== undefined) {
      if (properties.quality >= 0 && properties.quality <= 1) {
          qualityDisplay = properties.quality.toFixed(4);
      } else if (properties.quality === -1) {
          qualityDisplay = "N/A (Subcooled)";
      } else if (properties.quality === 2) {
          qualityDisplay = "N/A (Superheated)";
      } else {
          qualityDisplay = properties.quality.toFixed(2);
      }
  }

  return (
    <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden flex flex-col h-full">
        {/* Header with Phase Status */}
        <div className="bg-gradient-to-br from-gray-900 to-black p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-600 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-indigo-600 rounded-full opacity-20 blur-xl"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 opacity-90">
                    <SparklesIcon className="w-5 h-5" />
                    <span className="text-sm font-medium tracking-wide uppercase">Calculated State</span>
                </div>
                <h2 className="text-3xl font-bold mb-1">{properties.phase}</h2>
            </div>
        </div>

        {/* Data Grid */}
        <div className="p-6 flex-1 overflow-auto">
            <div className="grid grid-cols-1 gap-1">
                <ResultRow 
                    label="Pressure (P)" 
                    value={convertPressure(properties.pressure, pUnit)} 
                    currentUnit={pUnit}
                    availableUnits={Object.values(PressureUnit)}
                    onUnitChange={setPUnit}
                />
                <ResultRow 
                    label="Temperature (T)" 
                    value={convertTemperature(properties.temperature, tUnit)} 
                    currentUnit={tUnit}
                    availableUnits={Object.values(TemperatureUnit)}
                    onUnitChange={setTUnit}
                />
                <ResultRow 
                    label="Specific Volume (v)" 
                    value={convertVolume(properties.specificVolume, vUnit)} 
                    currentUnit={vUnit}
                    availableUnits={Object.values(VolumeUnit)}
                    onUnitChange={setVUnit}
                    description="Volume per unit mass"
                />
                <ResultRow 
                    label="Internal Energy (u)" 
                    value={convertEnergy(properties.internalEnergy, eUnit)} 
                    currentUnit={eUnit}
                    availableUnits={Object.values(EnergyUnit)}
                    onUnitChange={setEUnit}
                />
                <ResultRow 
                    label="Enthalpy (h)" 
                    value={convertEnergy(properties.enthalpy, eUnit)} 
                    currentUnit={eUnit}
                    availableUnits={Object.values(EnergyUnit)}
                    onUnitChange={setEUnit}
                    description="Total heat content"
                />
                <ResultRow 
                    label="Entropy (s)" 
                    value={convertEntropy(properties.entropy, sUnit)} 
                    currentUnit={sUnit}
                    availableUnits={Object.values(EntropyUnit)}
                    onUnitChange={setSUnit}
                    description="Measure of disorder"
                />
                <ResultRow 
                    label="Quality (x)" 
                    value={0}
                    displayValueOverride={qualityDisplay}
                    currentUnit="-" 
                    description="Mass fraction of vapor"
                />
            </div>
        </div>
    </div>
  );
};

export default ResultsDisplay;