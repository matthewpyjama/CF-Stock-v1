import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Package } from 'lucide-react';

interface SmartInputProps {
  product: Product;
  onUpdate: (totalUnits: number) => void;
}

export const SmartInput: React.FC<SmartInputProps> = ({ product, onUpdate }) => {
  const [cases, setCases] = useState<string>('');
  const [loose, setLoose] = useState<string>('');
  
  // Calculate total units whenever inputs change
  useEffect(() => {
    const caseCount = parseInt(cases) || 0;
    const looseCount = parseInt(loose) || 0;
    // Ensure we don't send negative totals even if state somehow gets them
    const total = Math.max(0, (caseCount * product.caseSize) + looseCount);
    onUpdate(total);
  }, [cases, loose, product.caseSize, onUpdate]);

  // Prevent typing minus signs or 'e'
  const preventNegativeInput = (e: React.KeyboardEvent) => {
    if (['-', 'e', '+'].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 shadow-sm mb-3">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-zinc-100 font-medium text-lg">{product.name}</h3>
          <p className="text-zinc-500 text-xs uppercase tracking-wider flex items-center gap-1">
            <Package size={12} /> Case Size: {product.caseSize}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-yellow-500">
            {Math.max(0, ((parseInt(cases) || 0) * product.caseSize) + (parseInt(loose) || 0))}
          </div>
          <div className="text-zinc-600 text-xs">Total Units</div>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs text-zinc-400 mb-1">Cases</label>
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              min="0"
              onKeyDown={preventNegativeInput}
              value={cases}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || parseInt(val) >= 0) {
                  setCases(val);
                }
              }}
              placeholder="0"
              className="w-full bg-zinc-950 border border-zinc-700 rounded p-3 text-lg focus:border-yellow-500 focus:outline-none text-white placeholder-zinc-700"
            />
          </div>
        </div>
        
        <div className="flex-1">
          <label className="block text-xs text-zinc-400 mb-1">Loose</label>
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              min="0"
              onKeyDown={preventNegativeInput}
              value={loose}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || parseInt(val) >= 0) {
                  setLoose(val);
                }
              }}
              placeholder="0"
              className="w-full bg-zinc-950 border border-zinc-700 rounded p-3 text-lg focus:border-yellow-500 focus:outline-none text-white placeholder-zinc-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
};