import React, { useState } from 'react';
import { DEFAULT_INPUT_STATE } from './constants';
import { InputState, CalculationResult } from './types';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import { calculateSteamProperties } from './services/geminiService';
import { CloudIcon } from '@heroicons/react/24/solid';

function App() {
  const [inputState, setInputState] = useState<InputState>(DEFAULT_INPUT_STATE);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Create a descriptive string for the AI including Fluid State
      const description = `Fluid State: ${inputState.fluidState}, Input 1: ${inputState.value1} ${inputState.unit1}, Input 2: ${inputState.value2} ${inputState.unit2} (${inputState.mode})`;
      
      const data = await calculateSteamProperties(description);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during calculation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12 transition-colors duration-300">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
                <CloudIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                  SnapSteam
                </h1>
                <p className="text-xs text-gray-500 font-medium tracking-wide">INTELLIGENT STEAM TABLES</p>
              </div>
            </div>
            <div className="flex items-center">
              {/* Badge removed */}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <InputForm 
              inputState={inputState} 
              setInputState={setInputState} 
              onCalculate={handleCalculate}
              isLoading={isLoading}
            />
            
            {/* Simple IAPWS-97 Note */}
            <div className="text-center">
               <p className="text-xs text-gray-500 font-medium">
                 All calculations are estimated based on IAPWS-97 standards.
               </p>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7">
            <ResultsDisplay result={result} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;