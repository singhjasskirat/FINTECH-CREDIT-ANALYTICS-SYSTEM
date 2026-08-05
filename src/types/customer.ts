export interface CustomerRecord {
  ID: number;
  LIMIT_BAL: number; // Current Credit Limit
  Gender: number; // 1: Male, 2: Female
  GenderLabel?: string; // 'Male' | 'Female'
  EDUCATION: string;
  MARRIAGE: number; // 1: Married, 2: Single, 3: Others
  MarriageLabel?: string;
  AGE: number;
  PAY_0: number;
  PAY_2: number;
  PAY_3: number;
  PAY_4: number;
  PAY_5: number;
  PAY_6: number;
  BILL_AMT1: number;
  BILL_AMT2: number;
  BILL_AMT3: number;
  BILL_AMT4: number;
  BILL_AMT5: number;
  BILL_AMT6: number;
  PAY_AMT1: number;
  PAY_AMT2: number;
  PAY_AMT3: number;
  PAY_AMT4: number;
  PAY_AMT5: number;
  PAY_AMT6: number;
  'Default payment next month': number;
  'credit utilization ratio': number;
  'pay_to_bill_ratio': number;
  'mean_monthly_bill': number;
  'mean_monthly_payment': number;
  'max_payment_delay': number;
  Default_Risk_Score: number; // 0.0 to 1.0 or percentage
  Risk_Tier: 'Low Risk' | 'Medium Risk' | 'High Risk' | string;
  Final_Approved_Limit: number; // Approved Credit Limit
  
  // Derived helper attributes
  Occupation?: string;
  CustomerName?: string;
}

export interface FeatureImportanceItem {
  name: string;
  importance: number; // Percentage e.g. 57.2
  displayValue: string;
}

export interface FilterOptions {
  searchId: string;
  riskTier: string; // 'ALL' | 'Low Risk' | 'Medium Risk' | 'High Risk'
  education: string; // 'ALL' | 'Graduate University' | 'University' | 'High School' | 'Others'
  gender: string; // 'ALL' | '1' | '2' | 'Male' | 'Female'
}

export interface PortfolioSummary {
  totalCustomers: number;
  lowRiskCount: number;
  lowRiskPercentage: number;
  mediumRiskCount: number;
  mediumRiskPercentage: number;
  highRiskCount: number;
  highRiskPercentage: number;
  avgDefaultScore: number;
  totalCurrentLimit: number;
  totalApprovedLimit: number;
  avgApprovedLimit: number;
  limitBins: { bin: string; count: number; lowRisk: number; medRisk: number; highRisk: number }[];
}
