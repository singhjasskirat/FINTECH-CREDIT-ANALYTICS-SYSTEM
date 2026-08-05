import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CustomerRecord, FeatureImportanceItem, FilterOptions, PortfolioSummary } from '../types/customer';
import { parseExcelArrayBuffer, calculateCustomerFeatureImportance, calculatePortfolioSummary } from '../services/excelService';

interface DataContextType {
  customers: CustomerRecord[];
  filteredCustomers: CustomerRecord[];
  selectedCustomer: CustomerRecord | null;
  filters: FilterOptions;
  portfolioSummary: PortfolioSummary;
  featureImportance: FeatureImportanceItem[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  setSearchId: (id: string) => void;
  setRiskTierFilter: (tier: string) => void;
  setEducationFilter: (edu: string) => void;
  setGenderFilter: (gender: string) => void;
  resetFilters: () => void;
  selectCustomerById: (id: number | string) => void;
  loadExcelFile: (file: File) => Promise<void>;
  loadDatasetFromUrl: (url: string) => Promise<void>;
}

const defaultFilters: FilterOptions = {
  searchId: '12345678', // Matching default reference ID if present or defaults to index
  riskTier: 'ALL',
  education: 'ALL',
  gender: 'ALL',
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load default dataset on mount
  useEffect(() => {
    loadDatasetFromUrl('/final_credit_risk_predictions_with_limits.xlsx');
  }, []);

  const loadDatasetFromUrl = async (url: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch dataset from ${url}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const records = parseExcelArrayBuffer(arrayBuffer);
      setCustomers(records);
      if (records.length > 0) {
        // Default to record #1 or match searchId if exists
        setSelectedCustomerId(records[0].ID);
      }
    } catch (err: any) {
      console.error('Error loading dataset:', err);
      setError(err.message || 'Failed to load customer dataset');
    } finally {
      setIsLoading(false);
    }
  };

  const loadExcelFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const records = parseExcelArrayBuffer(arrayBuffer);
      setCustomers(records);
      if (records.length > 0) {
        setSelectedCustomerId(records[0].ID);
      }
    } catch (err: any) {
      console.error('Error parsing uploaded file:', err);
      setError('Could not parse Excel file. Please ensure it is a valid .xlsx file.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered customer dataset based on active filters & search term
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      // Search ID matching
      if (filters.searchId.trim() !== '') {
        const idStr = c.ID.toString();
        if (!idStr.includes(filters.searchId.trim())) {
          return false;
        }
      }
      // Risk tier matching
      if (filters.riskTier !== 'ALL' && c.Risk_Tier !== filters.riskTier) {
        return false;
      }
      // Education matching
      if (filters.education !== 'ALL' && c.EDUCATION.toLowerCase() !== filters.education.toLowerCase()) {
        return false;
      }
      // Gender matching
      if (filters.gender !== 'ALL') {
        const targetGender = Number(filters.gender);
        if (!isNaN(targetGender) && c.Gender !== targetGender) {
          return false;
        }
      }
      return true;
    });
  }, [customers, filters]);

  // Selected customer object
  const selectedCustomer = useMemo(() => {
    if (!customers.length) return null;
    
    // First try finding by searchId if user typed a complete exact ID
    if (filters.searchId.trim()) {
      const exactMatch = customers.find(c => c.ID.toString() === filters.searchId.trim());
      if (exactMatch) return exactMatch;
    }

    // Otherwise match by explicitly selected ID
    if (selectedCustomerId !== null) {
      const match = customers.find(c => c.ID === selectedCustomerId);
      if (match) return match;
    }

    // Fallback to first filtered customer or first customer overall
    return filteredCustomers[0] || customers[0] || null;
  }, [customers, filteredCustomers, selectedCustomerId, filters.searchId]);

  // Calculate feature importance for selected customer
  const featureImportance = useMemo(() => {
    if (!selectedCustomer) return [];
    return calculateCustomerFeatureImportance(selectedCustomer);
  }, [selectedCustomer]);

  // Portfolio overall summary
  const portfolioSummary = useMemo(() => {
    return calculatePortfolioSummary(customers);
  }, [customers]);

  const setSearchId = (searchId: string) => {
    setFilters(prev => ({ ...prev, searchId }));
  };

  const setRiskTierFilter = (riskTier: string) => {
    setFilters(prev => ({ ...prev, riskTier }));
  };

  const setEducationFilter = (education: string) => {
    setFilters(prev => ({ ...prev, education }));
  };

  const setGenderFilter = (gender: string) => {
    setFilters(prev => ({ ...prev, gender }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    if (customers.length > 0) {
      setSelectedCustomerId(customers[0].ID);
    }
  };

  const selectCustomerById = (id: number | string) => {
    const numericId = Number(id);
    setSelectedCustomerId(numericId);
    setFilters(prev => ({ ...prev, searchId: numericId.toString() }));
  };

  return (
    <DataContext.Provider
      value={{
        customers,
        filteredCustomers,
        selectedCustomer,
        filters,
        portfolioSummary,
        featureImportance,
        isLoading,
        error,
        setFilters,
        setSearchId,
        setRiskTierFilter,
        setEducationFilter,
        setGenderFilter,
        resetFilters,
        selectCustomerById,
        loadExcelFile,
        loadDatasetFromUrl,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
