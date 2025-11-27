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

      // MAPPING FIX: 
      // 1. The backend returns 'items', but frontend expects 'products'
      // 2. Real data lacks 'id', so we use 'name' as the 'id' to fix dropdowns
      // 3. Map new Role and AssignedLocation fields for Staff
      return {
        products: (data.items || []).map((p: any) => ({
          ...p,
          id: p.name 
        })),
        locations: (data.locations || []).map((l: any) => ({
          ...l,
          id: l.name 
        })),
        staff: (data.staff || []).map((s: any) => ({
          ...s,
          id: s.name,
          role: s.role,
          assignedLocation: s.assignedLocation
        }))
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
      // FIX: Map frontend keys to match Google Script expectations
      const backendPayload = {
        ...payload,
        staff: payload.staffName,
        bar: payload.barName,
        staffName: undefined,
        barName: undefined
      };

      // POST Request: Send as text/plain
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(backendPayload)
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
      // FIX: Map frontend keys to match Google Script expectations
      const backendPayload = {
        ...payload,
        staff: payload.staffName,
        staffName: undefined
      };

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(backendPayload)
      });
      return true;
    } catch (error) {
      console.error("Submission failed", error);
      return false;
    }
  }
};