import { AppConfig, StocktakePayload, TransferPayload } from '../types';
import { GOOGLE_SCRIPT_URL, MOCK_CONFIG } from '../constants';

export const ApiService = {
  fetchConfig: async (): Promise<AppConfig> => {
    console.log("Fetching config from:", GOOGLE_SCRIPT_URL);
    
    if (!GOOGLE_SCRIPT_URL) {
      console.warn("No API URL, using mock");
      return MOCK_CONFIG;
    }

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const json = await response.json();

      if (json.status !== 'success' || !json.data) {
        throw new Error(json.message || "Invalid backend response");
      }

      const { products, locations, staff } = json.data;

      // Transform backend data (Arrays) into Frontend Types (adding generated IDs)
      // Backend returns: { name, category, caseSize }
      // Frontend needs: { id, name, category, caseSize }
      
      const mappedProducts = Array.isArray(products) 
        ? products.map((p: any, index: number) => ({
            id: `p-${index}-${p.name.replace(/\s+/g, '').toLowerCase()}`,
            category: p.category || 'Uncategorized',
            name: p.name,
            caseSize: Number(p.caseSize) || 1
          }))
        : MOCK_CONFIG.products;

      const mappedLocations = Array.isArray(locations)
        ? locations.map((l: any, index: number) => ({
            id: `l-${index}`,
            name: l.name,
            type: l.type || 'Bar'
          }))
        : MOCK_CONFIG.locations;

      const mappedStaff = Array.isArray(staff)
        ? staff.map((s: any, index: number) => ({
            id: `s-${index}`,
            name: s.name
          }))
        : MOCK_CONFIG.staff;

      return {
        products: mappedProducts,
        locations: mappedLocations,
        staff: mappedStaff
      };

    } catch (error) {
      console.error("Failed to fetch config, falling back to mock", error);
      return MOCK_CONFIG;
    }
  },

  submitStocktake: async (payload: StocktakePayload): Promise<boolean> => {
    // Transform Frontend Payload to Backend "Action" format
    const backendPayload = {
      action: "submitStock",
      data: {
        session: payload.session,
        location: payload.barName,
        staff: payload.staffName,
        items: payload.items
      }
    };
    
    return ApiService.sendToBackend(backendPayload);
  },

  submitTransfer: async (payload: TransferPayload): Promise<boolean> => {
    // Transform Frontend Payload to Backend "Action" format
    const backendPayload = {
      action: "submitTransfer",
      data: {
        source: payload.source,
        destination: payload.destination,
        staff: payload.staffName,
        items: payload.items
      }
    };

    return ApiService.sendToBackend(backendPayload);
  },

  // Helper to handle the "text/plain" hack for Google Apps Script CORS
  sendToBackend: async (payload: any): Promise<boolean> => {
    if (!GOOGLE_SCRIPT_URL) return true;

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        // CRITICAL: Use text/plain to avoid CORS "Preflight" OPTIONS request
        // The backend still parses it as JSON because we use JSON.parse(e.postData.contents)
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      return true;
    } catch (error) {
      console.error("Submission failed", error);
      return false;
    }
  }
};