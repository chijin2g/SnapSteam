
import { GoogleGenAI, Type } from "@google/genai";
import { CalculationResult } from "../types";

export const calculateSteamProperties = async (
  inputDescription: string
): Promise<CalculationResult> => {
  let apiKey: string | undefined;
  
  try {
    apiKey = process.env.API_KEY;
  } catch (e) {
    // Handle cases where process is undefined in browser environments
    console.warn("process.env is not accessible");
  }

  if (!apiKey) {
    throw new Error("API Key is missing. Please add 'API_KEY' to your Environment Variables.\nGet your key here: https://aistudio.google.com/app/apikey");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

  const prompt = `
    Act as an expert thermodynamicist and steam table calculator based on IAPWS-97 standards.
    
    Calculate the thermodynamic properties of water/steam for the following user-defined state:
    ${inputDescription}

    If the user selected "Saturated", treat the inputs as saturation properties (e.g. Saturation Pressure or Saturation Temperature) combined with Quality.
    If the user selected "Subcooled/Superheated", determine the phase (Subcooled, Superheated, or Mixture) based on the two inputs.

    If the state is impossible (e.g., negative pressure, temperature below absolute zero, quality < 0 or > 1 in saturated mode), return sensible error-like values or handle gracefully in the description.
    
    IMPORTANT RULES:
    1. Standardize all output units to:
       - Pressure: MPa
       - Temperature: °C (Celsius)
       - Specific Volume: m³/kg
       - Internal Energy: kJ/kg
       - Enthalpy: kJ/kg
       - Entropy: kJ/(kg·K)
       - Quality: 0 to 1 (if saturated), -1 (if subcooled liquid), 2 (if superheated vapor).
    
    2. Provide a short description of the phase (e.g., "Compressed Liquid", "Saturated Mixture", "Superheated Vapor", "Supercritical Fluid") and the calculation context.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview', // Using Pro for better mathematical/logic reasoning
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          properties: {
            type: Type.OBJECT,
            properties: {
              pressure: { type: Type.NUMBER, description: "Pressure in MPa" },
              temperature: { type: Type.NUMBER, description: "Temperature in Celsius" },
              specificVolume: { type: Type.NUMBER, description: "Specific Volume in m^3/kg" },
              internalEnergy: { type: Type.NUMBER, description: "Internal Energy in kJ/kg" },
              enthalpy: { type: Type.NUMBER, description: "Enthalpy in kJ/kg" },
              entropy: { type: Type.NUMBER, description: "Entropy in kJ/(kg K)" },
              quality: { type: Type.NUMBER, description: "Vapor quality (x). Use -1 for Subcooled, 2 for Superheated, 0-1 for Saturated." },
              phase: { type: Type.STRING, description: "Phase description (e.g. Superheated Vapor)" },
            },
            required: ["pressure", "temperature", "specificVolume", "internalEnergy", "enthalpy", "entropy", "phase"],
          },
          description: { type: Type.STRING, description: "A brief explanation of the state." },
        },
      },
    },
  });

  const jsonText = response.text;
  if (!jsonText) {
    throw new Error("No data returned from Gemini.");
  }

  try {
    const result = JSON.parse(jsonText) as CalculationResult;
    return result;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    throw new Error("Failed to process calculation results.");
  }
};
