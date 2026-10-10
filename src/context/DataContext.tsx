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
  
  // Computed Governance Attributes for Selected Customer
  effectiveRiskScore: number; // Decimal 0-1
  isGovernanceCapped: boolean; // True if risk > 60%
  effectiveApprovedLimit: number; // Recommended limit with $10k cap applied if > 60%

  // Actions
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  setSearchId: (id: string) => void;
  setRiskTierFilter: (tier: string) => void;
  setEducationFilter: (edu: string) => void;
  setGenderFilter: (gender: string) => void;
  setNtcModeFilter: (isNtcMode: boolean) => void;
  resetFilters: () => void;
  selectCustomerById: (id: number | string) => void;
  loadExcelFile: (file: File) => Promise<void>;
  loadDatasetFromUrl: (url: string) => Promise<void>;
}

const defaultFilters: FilterOptions = {
  searchId: '12345678', // Default prompt ID
  riskTier: 'ALL',
  education: 'ALL',
  gender: 'ALL',
  isNtcMode: false,
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      if (filters.searchId.trim() !== '') {
        const idStr = c.ID.toString();
        if (!idStr.includes(filters.searchId.trim())) {
          return false;
        }
      }
      if (filters.riskTier !== 'ALL' && c.Risk_Tier !== filters.riskTier) {
        return false;
      }
      if (filters.education !== 'ALL' && c.EDUCATION.toLowerCase() !== filters.education.toLowerCase()) {
        return false;
      }
      if (filters.gender !== 'ALL') {
        const targetGender = Number(filters.gender);
        if (!isNaN(targetGender) && c.Gender !== targetGender) {
          return false;
        }
      }
      return true;
    });
  }, [customers, filters]);

  const selectedCustomer = useMemo(() => {
    if (!customers.length) return null;
    if (filters.searchId.trim()) {
      const exactMatch = customers.find(c => c.ID.toString() === filters.searchId.trim());
      if (exactMatch) return exactMatch;
    }
    if (selectedCustomerId !== null) {
      const match = customers.find(c => c.ID === selectedCustomerId);
      if (match) return match;
    }
    return filteredCustomers[0] || customers[0] || null;
  }, [customers, filteredCustomers, selectedCustomerId, filters.searchId]);

  // Compute effective risk score based on NTC mode
  const effectiveRiskScore = useMemo(() => {
    if (!selectedCustomer) return 0.125;
    if (filters.isNtcMode) {
      // In NTC / Thin-File mode, apply a calibrated adjustment (+5% baseline for unbanked applicants)
      return Math.min(0.99, Number((selectedCustomer.Default_Risk_Score * 1.15).toFixed(3)));
    }
    return selectedCustomer.Default_Risk_Score;
  }, [selectedCustomer, filters.isNtcMode]);

  // Business Governance Rule: If default probability > 60%, cap approved credit limit at $10,000 max!
  const isGovernanceCapped = useMemo(() => {
    return effectiveRiskScore > 0.60;
  }, [effectiveRiskScore]);

  const effectiveApprovedLimit = useMemo(() => {
    if (!selectedCustomer) return 180000;
    if (isGovernanceCapped) {
      return 10000; // Cap governance rule ($10k max)
    }
    return selectedCustomer.Final_Approved_Limit;
  }, [selectedCustomer, isGovernanceCapped]);

  // Calculate feature importance for selected customer
  const featureImportance = useMemo(() => {
    if (!selectedCustomer) return [];
    return calculateCustomerFeatureImportance(selectedCustomer, filters.isNtcMode);
  }, [selectedCustomer, filters.isNtcMode]);

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

  const setNtcModeFilter = (isNtcMode: boolean) => {
    setFilters(prev => ({ ...prev, isNtcMode }));
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
        effectiveRiskScore,
        isGovernanceCapped,
        effectiveApprovedLimit,
        setFilters,
        setSearchId,
        setRiskTierFilter,
        setEducationFilter,
        setGenderFilter,
        setNtcModeFilter,
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
