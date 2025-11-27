import { AppConfig } from './types';

// The URL you provided from your deployment
export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxjKeag6uX7TAN9mjx-HYILKnMld-hDfXHtEdgman_9566guWHo66WrIgeP4qwDid_9Tw/exec";

// Fallback Mock Data (used if fetch fails)
export const MOCK_CONFIG: AppConfig = {
  products: [
    { id: 'p1', category: 'Spirits', name: 'Bombay Sapphire Gin', caseSize: 6 },
    { id: 'p2', category: 'Spirits', name: 'Jack Daniels Bourbon', caseSize: 6 },
    { id: 'p3', category: 'Soft Drinks', name: 'Coke 330ml', caseSize: 24 },
  ],
  locations: [
    { id: 'l1', name: 'Bar 1A', type: 'Bar' },
    { id: 'l2', name: 'Main Storage', type: 'Storage' },
  ],
  staff: [
    { id: 's1', name: 'Admin User' },
  ]
};