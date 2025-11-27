import React, { useState, useMemo } from 'react';
import { useAppData } from './context/AppDataContext';
import { ViewState, StockItemSubmission, Product } from './types';
import { SmartInput } from './components/SmartInput';
import { Button } from './components/Button';
import { ApiService } from './services/api';
import { 
  ClipboardList, 
  ArrowRightLeft, 
  LogOut, 
  User, 
  Store, 
  AlertTriangle,
  ChevronLeft
} from 'lucide-react';

const App: React.FC = () => {
  const { config, isLoading, currentUser, setCurrentUser } = useAppData();
  const [view, setView] = useState<ViewState>('AUTH');
  const [submitting, setSubmitting] = useState(false);
  
  // Stocktake State
  const [stockLocation, setStockLocation] = useState('');
  const [session, setSession] = useState<'Opening' | 'Closing'>('Opening');
  const [stockItems, setStockItems] = useState<Record<string, number>>({});

  // Transfer State
  const [sourceLoc, setSourceLoc] = useState('');
  const [destLoc, setDestLoc] = useState('');
  const [transferItems, setTransferItems] = useState<Record<string, number>>({});

  // Reset Logic
  const resetForms = () => {
    setStockItems({});
    setTransferItems({});
    setStockLocation('');
    setSourceLoc('');
    setDestLoc('');
  };

  // Group Products for better UI
  const productsByCategory = useMemo((): Record<string, Product[]> => {
    if (!config) return {};
    const grouped: Record<string, Product[]> = {};
    config.products.forEach(p => {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    });
    return grouped;
  }, [config]);

  // Handlers
  const handleStocktakeSubmit = async () => {
    if (!currentUser || !stockLocation) return;
    setSubmitting(true);
    
    // Convert map to array
    const items: StockItemSubmission[] = (Object.entries(stockItems) as [string, number][])
      .filter(([_, qty]) => qty > 0)
      .map(([name, quantity]) => ({ productName: name, quantity }));

    if (items.length === 0) {
      alert("No items counted!");
      setSubmitting(false);
      return;
    }

    const success = await ApiService.submitStocktake({
      type: 'stocktake',
      timestamp: new Date().toISOString(),
      staffName: currentUser.name,
      barName: config?.locations.find(l => l.id === stockLocation)?.name || 'Unknown',
      session,
      items
    });

    if (success) {
      alert("Stocktake Saved Successfully!");
      resetForms();
      setView('DASHBOARD');
    } else {
      alert("Failed to save. Check connection.");
    }
    setSubmitting(false);
  };

  const handleTransferSubmit = async () => {
    if (!currentUser || !sourceLoc || !destLoc) return;
    setSubmitting(true);

    const items: StockItemSubmission[] = (Object.entries(transferItems) as [string, number][])
      .filter(([_, qty]) => qty > 0)
      .map(([name, quantity]) => ({ productName: name, quantity }));

    if (items.length === 0) {
      alert("No items selected for transfer!");
      setSubmitting(false);
      return;
    }

    const success = await ApiService.submitTransfer({
      type: 'transfer',
      timestamp: new Date().toISOString(),
      staffName: currentUser.name,
      source: config?.locations.find(l => l.id === sourceLoc)?.name || 'Unknown',
      destination: config?.locations.find(l => l.id === destLoc)?.name || 'Unknown',
      items
    });

    if (success) {
      alert("Transfer Recorded Successfully!");
      resetForms();
      setView('DASHBOARD');
    } else {
      alert("Failed to save. Check connection.");
    }
    setSubmitting(false);
  };

  // --- Views ---

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 flex-col gap-4">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-zinc-500 animate-pulse">Loading Config...</p>
      </div>
    );
  }

  if (!currentUser || view === 'AUTH') {
    return (
      <div className="min-h-screen flex flex-col justify-center px-6 bg-zinc-950 max-w-md mx-auto">
        <div className="mb-12 text-center">
          <div className="w-20 h-20 bg-zinc-900 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-zinc-800 shadow-2xl">
            <ClipboardList className="text-yellow-500 w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">CF25 Stock Logic</h1>
          <p className="text-zinc-500">Event Logistics Manager</p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-400">Select Current User</label>
          <div className="space-y-2">
            {config?.staff.map(staff => (
              <button
                key={staff.id}
                onClick={() => {
                  setCurrentUser(staff);
                  setView('DASHBOARD');
                }}
                className="w-full p-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-left flex items-center gap-3 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <User size={20} />
                </div>
                <span className="font-medium text-zinc-200">{staff.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'DASHBOARD') {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 flex flex-col max-w-md mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold text-white">Dashboard</h2>
            <p className="text-zinc-500 text-sm">Welcome, {currentUser.name}</p>
          </div>
          <button 
            onClick={() => {
              setCurrentUser(null as any);
              setView('AUTH');
            }}
            className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white"
          >
            <LogOut size={20} />
          </button>
        </header>

        <div className="grid gap-6 flex-1 content-center">
          <button
            onClick={() => setView('STOCKTAKE')}
            className="h-48 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-8 flex flex-col items-center justify-center gap-4 hover:scale-[1.02] transition-transform shadow-2xl"
          >
            <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
              <ClipboardList size={32} />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white">Stocktake</h3>
              <p className="text-zinc-500">Count Opening/Closing</p>
            </div>
          </button>

          <button
            onClick={() => setView('TRANSFER')}
            className="h-48 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-8 flex flex-col items-center justify-center gap-4 hover:scale-[1.02] transition-transform shadow-2xl"
          >
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <ArrowRightLeft size={32} />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white">Transfers</h3>
              <p className="text-zinc-500">Move Stock Between Bars</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // --- Reusable Item Renderer ---
  const renderItemInputs = (updateMap: React.Dispatch<React.SetStateAction<Record<string, number>>>) => (
    <div className="space-y-8 pb-32">
      {(Object.entries(productsByCategory) as [string, Product[]][]).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-yellow-500 font-bold text-sm uppercase tracking-widest mb-4 sticky top-16 bg-zinc-950 py-2 z-10 border-b border-zinc-800">
            {category}
          </h3>
          <div className="space-y-4">
            {items.map(product => (
              <SmartInput
                key={product.id}
                product={product}
                onUpdate={(total) => {
                  updateMap(prev => ({ ...prev, [product.name]: total }));
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  if (view === 'STOCKTAKE') {
    return (
      <div className="min-h-screen bg-zinc-950 text-white max-w-md mx-auto relative">
        <div className="sticky top-0 bg-zinc-950/95 backdrop-blur-sm z-20 border-b border-zinc-800 p-4">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => setView('DASHBOARD')} className="p-2 hover:bg-zinc-800 rounded-full">
              <ChevronLeft />
            </button>
            <h2 className="text-lg font-bold">New Stocktake</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <select 
              className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm focus:ring-2 ring-yellow-500 outline-none"
              value={stockLocation}
              onChange={(e) => setStockLocation(e.target.value)}
            >
              <option value="">Select Location...</option>
              {config?.locations.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
            
            <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-700">
              <button 
                className={`flex-1 rounded-md text-sm font-medium transition-colors ${session === 'Opening' ? 'bg-yellow-500 text-black' : 'text-zinc-400'}`}
                onClick={() => setSession('Opening')}
              >
                Open
              </button>
              <button 
                className={`flex-1 rounded-md text-sm font-medium transition-colors ${session === 'Closing' ? 'bg-yellow-500 text-black' : 'text-zinc-400'}`}
                onClick={() => setSession('Closing')}
              >
                Close
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          {stockLocation ? (
            renderItemInputs(setStockItems)
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
              <Store size={48} className="mb-4 opacity-50" />
              <p>Select a location to begin counting</p>
            </div>
          )}
        </div>

        {stockLocation && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-950 border-t border-zinc-800 max-w-md mx-auto z-30">
            <Button onClick={handleStocktakeSubmit} isLoading={submitting}>
              Submit Count
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (view === 'TRANSFER') {
    return (
      <div className="min-h-screen bg-zinc-950 text-white max-w-md mx-auto relative">
        <div className="sticky top-0 bg-zinc-950/95 backdrop-blur-sm z-20 border-b border-zinc-800 p-4">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => setView('DASHBOARD')} className="p-2 hover:bg-zinc-800 rounded-full">
              <ChevronLeft />
            </button>
            <h2 className="text-lg font-bold">New Transfer</h2>
          </div>
          
          <div className="space-y-3 bg-zinc-900 p-4 rounded-xl border border-zinc-800 mb-2">
            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold">From (Source)</label>
              <select 
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 mt-1 text-sm outline-none focus:border-blue-500"
                value={sourceLoc}
                onChange={(e) => setSourceLoc(e.target.value)}
              >
                <option value="">Select Source...</option>
                {config?.locations.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-center -my-2 relative z-10">
               <div className="bg-zinc-800 p-1 rounded-full border border-zinc-700">
                 <ArrowRightLeft size={16} className="text-zinc-400" />
               </div>
            </div>

            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold">To (Destination)</label>
              <select 
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 mt-1 text-sm outline-none focus:border-blue-500"
                value={destLoc}
                onChange={(e) => setDestLoc(e.target.value)}
              >
                <option value="">Select Destination...</option>
                {config?.locations.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-4">
          {(sourceLoc && destLoc) ? (
            renderItemInputs(setTransferItems)
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
              <AlertTriangle size={48} className="mb-4 opacity-50" />
              <p>Select both locations to start transfer</p>
            </div>
          )}
        </div>

        {(sourceLoc && destLoc) && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-950 border-t border-zinc-800 max-w-md mx-auto z-30">
            <Button onClick={handleTransferSubmit} isLoading={submitting} className="bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/20">
              Confirm Transfer
            </Button>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default App;