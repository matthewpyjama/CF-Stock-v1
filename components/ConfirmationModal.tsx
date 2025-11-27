import React from 'react';
import { Button } from './Button';
import { X, Check } from 'lucide-react';
import { StockItemSubmission } from '../types';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  details: { label: string; value: string }[];
  items: StockItemSubmission[];
  isLoading: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  details,
  items,
  isLoading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} disabled={isLoading} className="p-2 text-zinc-400 hover:text-white bg-zinc-800 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
            {details.map((detail, idx) => (
              <div key={idx}>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{detail.label}</p>
                <p className="font-medium text-white break-words">{detail.value}</p>
              </div>
            ))}
          </div>

          {/* Item List */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-zinc-400 uppercase">Items to Submit</h3>
              <span className="text-xs text-yellow-500 font-mono">{items.length} items</span>
            </div>
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-zinc-800/50 rounded-lg border border-zinc-800/50">
                  <span className="text-zinc-200 font-medium">{item.productName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500 font-bold text-lg">{item.quantity}</span>
                    <span className="text-xs text-zinc-500">units</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/50 rounded-b-2xl space-y-3">
          <p className="text-xs text-center text-zinc-500">
            Please double check your count. This cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} disabled={isLoading}>
              Back to Edit
            </Button>
            <Button onClick={onConfirm} isLoading={isLoading}>
              <Check size={20} />
              Confirm & Submit
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};