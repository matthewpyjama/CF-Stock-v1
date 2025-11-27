import React, { useState } from 'react';
import { X, Delete, Lock } from 'lucide-react';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  targetPin: string;
  userName: string;
}

export const PinModal: React.FC<PinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetPin,
  userName
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleNumClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      
      // Auto-submit on 4th digit
      if (newPin.length === 4) {
        if (newPin === targetPin) {
          setTimeout(() => {
            onSuccess();
            setPin('');
          }, 200);
        } else {
          setError(true);
          setTimeout(() => setPin(''), 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm bg-zinc-900 sm:rounded-2xl border-t sm:border border-zinc-800 p-6 pb-12 sm:pb-6 shadow-2xl">
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Lock size={20} className="text-yellow-500"/> Enter PIN
            </h2>
            <p className="text-zinc-500 text-sm">Hello, {userName}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* PIN Display */}
        <div className="flex justify-center gap-4 mb-8">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-4 h-4 rounded-full transition-all ${
              pin.length > i 
                ? (error ? 'bg-red-500' : 'bg-yellow-500 scale-125') 
                : 'bg-zinc-800'
            }`} />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-center text-sm font-medium mb-4 animate-pulse">
            Incorrect PIN. Try again.
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleNumClick(num.toString())}
              className="h-16 rounded-xl bg-zinc-800 text-2xl font-bold text-zinc-200 hover:bg-zinc-700 active:bg-yellow-500 active:text-black transition-colors"
            >
              {num}
            </button>
          ))}
          <div className="h-16"></div>
          <button
            onClick={() => handleNumClick('0')}
            className="h-16 rounded-xl bg-zinc-800 text-2xl font-bold text-zinc-200 hover:bg-zinc-700 active:bg-yellow-500 active:text-black transition-colors"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-16 rounded-xl bg-zinc-800/50 flex items-center justify-center text-zinc-400 hover:bg-zinc-700 active:text-red-400 transition-colors"
          >
            <Delete size={24} />
          </button>
        </div>

      </div>
    </div>
  );
};