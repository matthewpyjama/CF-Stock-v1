import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppConfig, Staff } from '../types';
import { ApiService } from '../services/api';

interface AppDataContextType {
  config: AppConfig | null;
  isLoading: boolean;
  currentUser: Staff | null;
  setCurrentUser: (staff: Staff) => void;
  refreshConfig: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Staff | null>(null);

  const refreshConfig = async () => {
    setIsLoading(true);
    try {
      const data = await ApiService.fetchConfig();
      setConfig(data);
    } catch (error) {
      console.error("Failed to load app data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshConfig();
  }, []);

  return (
    <AppDataContext.Provider value={{ config, isLoading, currentUser, setCurrentUser, refreshConfig }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }
  return context;
};