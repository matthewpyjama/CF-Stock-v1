import { AppConfig } from './types';

// Updated to the latest deployment URL provided
export const GOOGLE_SCRIPT_URL = (import.meta as any).env?.VITE_GOOGLE_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbx3IOqnRynj4ufg7SlJ3afdaud1jl08hXWVLpn9oCRWECJNIh0kX1vVgsKXS8hXAUuSfQ/exec";

export const MOCK_CONFIG: AppConfig = {
  products: [
    { id: 'p1', category: 'Spirits', name: 'Bombay Sapphire Gin', caseSize: 6 },
    { id: 'p2', category: 'Spirits', name: 'Jack Daniels Bourbon', caseSize: 6 },
    { id: 'p3', category: 'Spirits', name: 'Absolut 1L', caseSize: 6 },
    { id: 'p4', category: 'Soft Drinks', name: 'RedBull', caseSize: 24 },
    { id: 'p5', category: 'Soft Drinks', name: 'Coke 330ml', caseSize: 24 },
    { id: 'p6', category: 'Soft Drinks', name: 'Soda 330ml', caseSize: 24 },
    { id: 'p7', category: 'Soft Drinks', name: 'Tonic 200ml', caseSize: 24 },
    { id: 'p8', category: 'Mixers', name: 'Lime Cordial', caseSize: 12 },
    { id: 'p9', category: 'Wines', name: 'House Red', caseSize: 6 },
    { id: 'p10', category: 'Wines', name: 'House White', caseSize: 6 },
  ],
  locations: [
    { id: 'l1', name: 'Bar 1A', type: 'Bar' },
    { id: 'l2', name: 'Bar 1B', type: 'Bar' },
    { id: 'l3', name: 'Bar 2', type: 'Bar' },
    { id: 'l4', name: 'Promoter Box', type: 'Satellite' },
    { id: 'l5', name: 'VIP', type: 'Satellite' },
    { id: 'l6', name: 'Main Storage', type: 'Storage' },
  ],
  staff: [
    { id: 's1', name: 'Manager Dave', role: 'Admin', pin: '1234' },
    { id: 's2', name: 'Sarah Lead', role: 'Staff', assignedLocation: 'Bar 1A, Bar 1B', pin: '0000' },
    { id: 's3', name: 'Bar Staff 1', role: 'Staff', assignedLocation: 'Bar 2' },
    { id: 's4', name: 'Logistics Team', role: 'Logistics' },
  ],
  openingSnapshot: {
    'Bar 1A': {
      'Bombay Sapphire Gin': 5,
      'Coke 330ml': 24
    }
  }
};