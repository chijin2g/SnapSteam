
import React, { useState, useEffect } from 'react';
import { DEFAULT_INPUT_STATE } from './constants';
import { InputState, CalculationResult } from './types';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import { calculateSteamProperties } from './services/geminiService';
import { CloudIcon, KeyIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

function App() {
  const [inputState, setInputState] = useState<InputState>(DEFAULT_INPUT_STATE);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showKeyWarning, setShowKeyWarning] = useState(false);

  useEffect(() => {
    // Check if running in an environment that supports dynamic key selection
    const checkKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setShowKeyWarning(!hasKey);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setShowKeyWarning(!hasKey);
      // Clear previous error if key is now selected
      if (hasKey && error?.includes('API Key')) {
        setError(null);
      }
    }
  };

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
               {showKeyWarning && (
                 <button
                   onClick={handleSelectKey}
                   className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-md text-xs font-semibold border border-yellow-200 transition-colors"
                 >
                   <KeyIcon className="w-4 h-4" />
                   Set API Key
                 </button>
               )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm animate-fade-in">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
              </div>
              <div className="ml-3 w-full">
                <h3 className="text-sm font-medium text-red-800">Calculation Failed</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                {(error.includes("API Key") || error.includes("Netlify")) && (
                   <div className="mt-4 p-3 bg-red-100 rounded-md text-xs text-red-800 border border-red-200">
                     <p className="font-bold mb-1">Troubleshooting Netlify Deployment:</p>
                     <ol className="list-decimal list-inside space-y-1 ml-1">
                       <li>Go to <strong>Site configuration &gt; Environment variables</strong> in Netlify.</li>
                       <li>Ensure a key named <code>API_KEY</code> exists with your Gemini API Key value.</li>
                       <li className="font-bold text-red-900">Crucial: Trigger a new deploy (Rebuild) after adding the variable.</li>
                     </ol>
                     <p className="mt-2">Environment variables are only applied during the build process.</p>
                   </div>
                )}
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
