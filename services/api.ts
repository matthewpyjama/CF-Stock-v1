import { AppConfig, StocktakePayload, TransferPayload } from '../types';
import { GOOGLE_SCRIPT_URL, MOCK_CONFIG } from '../constants';

// Simple delay helper for mock
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ApiService = {
  fetchConfig: async (): Promise<AppConfig> => {
    if (!GOOGLE_SCRIPT_URL) {
      console.warn("Using Mock Data (No API URL provided)");
      await delay(800);
      return MOCK_CONFIG;
    }

    try {
      // GET Request: Simple fetch, no headers to avoid Preflight/CORS issues
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const data = await response.json();

      // MAPPING FIX: The backend returns 'items', but frontend expects 'products'
      return {
        products: data.items || [], // <--- This fixes the 'forEach' crash
        locations: data.locations || [],
        staff: data.staff || []
      };
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
      // POST Request: Send as text/plain (default) to avoid OPTIONS preflight
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
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
        body: JSON.stringify(payload)
      });
      return true;
    } catch (error) {
      console.error("Submission failed", error);
      return false;
    }
  }
};