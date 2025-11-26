import { AppConfig, StocktakePayload, TransferPayload } from '../types';
import { GOOGLE_SCRIPT_URL, MOCK_CONFIG } from '../constants';

// Simple delay helper for mock
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ApiService = {
  fetchConfig: async (): Promise<AppConfig> => {
    if (!GOOGLE_SCRIPT_URL) {
      console.warn("Using Mock Data (No API URL provided in constants.ts)");
      await delay(800); // Simulate network
      return MOCK_CONFIG;
    }

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch config, falling back to mock", error);
      return MOCK_CONFIG;
    }
  },

  submitStocktake: async (payload: StocktakePayload): Promise<boolean> => {
    console.log("Submitting Stocktake:", payload);
    
    if (!GOOGLE_SCRIPT_URL) {
      await delay(1500);
      return true;
    }

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script requires no-cors for simple posts usually, or careful CORS setup
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return true;
    } catch (error) {
      console.error("Submission failed", error);
      return false;
    }
  },

  submitTransfer: async (payload: TransferPayload): Promise<boolean> => {
    console.log("Submitting Transfer:", payload);

    if (!GOOGLE_SCRIPT_URL) {
      await delay(1500);
      return true;
    }

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return true;
    } catch (error) {
      console.error("Submission failed", error);
      return false;
    }
  }
};