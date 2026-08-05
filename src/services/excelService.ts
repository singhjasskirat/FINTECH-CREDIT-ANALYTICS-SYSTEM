import * as XLSX from 'xlsx';
import { CustomerRecord, FeatureImportanceItem, PortfolioSummary } from '../types/customer';

// Deterministic mock name generator based on ID
const FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Sam', 'Chris', 'Pat', 'Riley', 'Casey', 'Avery', 'Dakota', 'Reese', 'Cameron', 'Skyler', 'Quinn'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzales', 'Wilson', 'Anderson'];
const OCCUPATIONS = [
  'Senior Financial Analyst', 'Software Engineer', 'Operations Manager',
  'Marketing Director', 'Data Scientist', 'Business Consultant',
  'Project Manager', 'Healthcare Administrator', 'Architect', 'Account Executive'
];

export const generateCustomerName = (id: number): string => {
  const firstName = FIRST_NAMES[id % FIRST_NAMES.length];
  const lastName = LAST_NAMES[(id * 7) % LAST_NAMES.length];
  return `${firstName} ${lastName}`;
};

export const getOccupationByEducation = (education: string, id: number): string => {
  const index = Math.abs(id) % OCCUPATIONS.length;
  if (education.toLowerCase().includes('graduate')) {
    return `Lead ${OCCUPATIONS[index]}`;
  } else if (education.toLowerCase().includes('university')) {
    return OCCUPATIONS[index];
  }
  return 'Associate Consultant';
};

export const parseExcelArrayBuffer = (buffer: ArrayBuffer): CustomerRecord[] => {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet);

  return rawRows.map((row, index) => {
    const id = Number(row['ID'] ?? row['Id'] ?? index + 1);
    const genderVal = Number(row['Gender'] ?? row['GENDER'] ?? 1);
    const genderLabel = genderVal === 1 ? 'Male' : 'Female';
    const educationStr = String(row['EDUCATION'] ?? row['Education'] ?? 'Graduate University');
    const marriageVal = Number(row['MARRIAGE'] ?? row['Marriage'] ?? 2);
    const marriageLabel = marriageVal === 1 ? 'Married' : marriageVal === 2 ? 'Single' : 'Others';

    const defaultScore = parseFloat(row['Default_Risk_Score'] ?? row['default_risk_score'] ?? row['Risk_Score'] ?? 0.15);
    
    // Normalize risk tier
    let riskTier = String(row['Risk_Tier'] ?? row['risk_tier'] ?? '');
    if (!riskTier) {
      if (defaultScore >= 0.5) riskTier = 'High Risk';
      else if (defaultScore >= 0.2) riskTier = 'Medium Risk';
      else riskTier = 'Low Risk';
    }

    const limitBal = Number(row['LIMIT_BAL'] ?? row['Limit_Bal'] ?? 100000);
    const approvedLimit = Number(row['Final_Approved_Limit'] ?? row['approved_limit'] ?? limitBal);

    return {
      ID: id,
      LIMIT_BAL: limitBal,
      Gender: genderVal,
      GenderLabel: genderLabel,
      EDUCATION: educationStr,
      MARRIAGE: marriageVal,
      MarriageLabel: marriageLabel,
      AGE: Number(row['AGE'] ?? row['Age'] ?? 30),
      PAY_0: Number(row['PAY_0'] ?? row['PAY_1'] ?? 0),
      PAY_2: Number(row['PAY_2'] ?? 0),
      PAY_3: Number(row['PAY_3'] ?? 0),
      PAY_4: Number(row['PAY_4'] ?? 0),
      PAY_5: Number(row['PAY_5'] ?? 0),
      PAY_6: Number(row['PAY_6'] ?? 0),
      BILL_AMT1: Number(row['BILL_AMT1'] ?? 0),
      BILL_AMT2: Number(row['BILL_AMT2'] ?? 0),
      BILL_AMT3: Number(row['BILL_AMT3'] ?? 0),
      BILL_AMT4: Number(row['BILL_AMT4'] ?? 0),
      BILL_AMT5: Number(row['BILL_AMT5'] ?? 0),
      BILL_AMT6: Number(row['BILL_AMT6'] ?? 0),
      PAY_AMT1: Number(row['PAY_AMT1'] ?? 0),
      PAY_AMT2: Number(row['PAY_AMT2'] ?? 0),
      PAY_AMT3: Number(row['PAY_AMT3'] ?? 0),
      PAY_AMT4: Number(row['PAY_AMT4'] ?? 0),
      PAY_AMT5: Number(row['PAY_AMT5'] ?? 0),
      PAY_AMT6: Number(row['PAY_AMT6'] ?? 0),
      'Default payment next month': Number(row['Default payment next month'] ?? row['default_payment'] ?? 0),
      'credit utilization ratio': parseFloat(row['credit utilization ratio'] ?? row['credit_utilization_ratio'] ?? 0.15),
      'pay_to_bill_ratio': parseFloat(row['pay_to_bill_ratio'] ?? 0.05),
      'mean_monthly_bill': parseFloat(row['mean_monthly_bill'] ?? 5000),
      'mean_monthly_payment': parseFloat(row['mean_monthly_payment'] ?? 500),
      'max_payment_delay': Number(row['max_payment_delay'] ?? 0),
      Default_Risk_Score: defaultScore,
      Risk_Tier: riskTier,
      Final_Approved_Limit: approvedLimit,
      CustomerName: generateCustomerName(id),
      Occupation: getOccupationByEducation(educationStr, id),
    };
  });
};

/**
 * Compute key default predictors / feature importance for a specific customer.
 * Outputs normalized values in percentage (e.g. 57.2%, 25.2%, 12.5%, 11.2%).
 */
export const calculateCustomerFeatureImportance = (customer: CustomerRecord): FeatureImportanceItem[] => {
  // Feature weights normalized to customer profile metrics
  const payDelayContrib = Math.max(0.1, (customer.PAY_0 + 2) * 0.4 + (customer.max_payment_delay + 1) * 0.3);
  const totalBalanceContrib = Math.max(0.05, (customer.mean_monthly_bill / Math.max(1, customer.LIMIT_BAL)) * 0.25 + 0.15);
  const utilRatioContrib = Math.max(0.05, customer['credit utilization ratio'] * 0.3 + 0.1);
  const ageContrib = Math.max(0.05, (customer.AGE / 100) * 0.2 + 0.1);
  const payToBillContrib = Math.max(0.05, (1 - Math.min(1, customer.pay_to_bill_ratio)) * 0.2);

  const rawWeights = [
    { name: 'PAY_0 Delay', val: payDelayContrib },
    { name: 'Total Balance', val: totalBalanceContrib },
    { name: 'Utilization Ratio', val: utilRatioContrib },
    { name: 'Age', val: ageContrib },
    { name: 'Pay to Bill Ratio', val: payToBillContrib },
  ];

  const total = rawWeights.reduce((sum, item) => sum + item.val, 0);

  // Take top 4 or 5 and scale to 100% total or clean percentages like reference image
  const items = rawWeights.map(item => {
    const percentage = Number(((item.val / total) * 100).toFixed(1));
    return {
      name: item.name,
      importance: percentage,
      displayValue: `${percentage}%`,
    };
  });

  return items.sort((a, b) => b.importance - a.importance);
};

/**
 * Compute portfolio-wide summary stats for pie charts, summary totals & histograms
 */
export const calculatePortfolioSummary = (customers: CustomerRecord[]): PortfolioSummary => {
  const totalCustomers = customers.length;
  if (totalCustomers === 0) {
    return {
      totalCustomers: 0,
      lowRiskCount: 0,
      lowRiskPercentage: 0,
      mediumRiskCount: 0,
      mediumRiskPercentage: 0,
      highRiskCount: 0,
      highRiskPercentage: 0,
      avgDefaultScore: 0,
      totalCurrentLimit: 0,
      totalApprovedLimit: 0,
      avgApprovedLimit: 0,
      limitBins: [],
    };
  }

  let lowCount = 0;
  let medCount = 0;
  let highCount = 0;
  let totalScoreSum = 0;
  let totalCurrentLimit = 0;
  let totalApprovedLimit = 0;

  customers.forEach(c => {
    if (c.Risk_Tier === 'Low Risk') lowCount++;
    else if (c.Risk_Tier === 'Medium Risk') medCount++;
    else highCount++;

    totalScoreSum += c.Default_Risk_Score;
    totalCurrentLimit += c.LIMIT_BAL;
    totalApprovedLimit += c.Final_Approved_Limit;
  });

  // Calculate limit bins for histogram
  const BIN_STEP = 50000;
  const binMap = new Map<string, { count: number; low: number; med: number; high: number }>();
  
  // Initialize bins 0-100k, 100k-200k, ..., up to 1M
  for (let b = 0; b <= 10; b++) {
    const label = `${b * 50}k`;
    binMap.set(label, { count: 0, low: 0, med: 0, high: 0 });
  }

  customers.forEach(c => {
    const binIdx = Math.min(10, Math.floor(c.Final_Approved_Limit / BIN_STEP));
    const label = `${binIdx * 50}k`;
    const entry = binMap.get(label) || { count: 0, low: 0, med: 0, high: 0 };
    entry.count++;
    if (c.Risk_Tier === 'Low Risk') entry.low++;
    else if (c.Risk_Tier === 'Medium Risk') entry.med++;
    else entry.high++;
    binMap.set(label, entry);
  });

  const limitBins = Array.from(binMap.entries()).map(([bin, val]) => ({
    bin,
    count: val.count,
    lowRisk: val.low,
    medRisk: val.med,
    highRisk: val.high,
  }));

  return {
    totalCustomers,
    lowRiskCount: lowCount,
    lowRiskPercentage: Number(((lowCount / totalCustomers) * 100).toFixed(1)),
    mediumRiskCount: medCount,
    mediumRiskPercentage: Number(((medCount / totalCustomers) * 100).toFixed(1)),
    highRiskCount: highCount,
    highRiskPercentage: Number(((highCount / totalCustomers) * 100).toFixed(1)),
    avgDefaultScore: Number((totalScoreSum / totalCustomers).toFixed(3)),
    totalCurrentLimit,
    totalApprovedLimit,
    avgApprovedLimit: Math.round(totalApprovedLimit / totalCustomers),
    limitBins,
  };
};
