import { Contract, Expense, TaxCalculation } from './types';

// UK Tax Year 2024/2025 rates
const PERSONAL_ALLOWANCE = 12570;
const BASIC_RATE_LIMIT = 50270;
const BASIC_RATE = 0.20;
const HIGHER_RATE = 0.40;

const NI_CLASS2_WEEKLY = 3.45;
const NI_CLASS2_THRESHOLD = 6725;
const NI_CLASS4_THRESHOLD = 12570;
const NI_CLASS4_UPPER_LIMIT = 50270;
const NI_CLASS4_RATE = 0.09;
const NI_CLASS4_HIGHER_RATE = 0.02;

export const calculateTax = (
  grossIncome: number,
  expenses: number
): TaxCalculation => {
  const taxableProfit = Math.max(0, grossIncome - expenses);

  // Income Tax
  let incomeTax = 0;
  if (taxableProfit > PERSONAL_ALLOWANCE) {
    const taxableAmount = taxableProfit - PERSONAL_ALLOWANCE;
    if (taxableAmount <= BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE) {
      incomeTax = taxableAmount * BASIC_RATE;
    } else {
      const basicRateTax = (BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE) * BASIC_RATE;
      const higherRateTax = (taxableAmount - (BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE)) * HIGHER_RATE;
      incomeTax = basicRateTax + higherRateTax;
    }
  }

  // National Insurance Class 2 (flat rate if profit above threshold)
  const niClass2 = taxableProfit >= NI_CLASS2_THRESHOLD
    ? NI_CLASS2_WEEKLY * 52
    : 0;

  // National Insurance Class 4
  let niClass4 = 0;
  if (taxableProfit > NI_CLASS4_THRESHOLD) {
    const profitAboveThreshold = taxableProfit - NI_CLASS4_THRESHOLD;
    if (profitAboveThreshold <= NI_CLASS4_UPPER_LIMIT - NI_CLASS4_THRESHOLD) {
      niClass4 = profitAboveThreshold * NI_CLASS4_RATE;
    } else {
      const lowerBandNI = (NI_CLASS4_UPPER_LIMIT - NI_CLASS4_THRESHOLD) * NI_CLASS4_RATE;
      const upperBandNI = (profitAboveThreshold - (NI_CLASS4_UPPER_LIMIT - NI_CLASS4_THRESHOLD)) * NI_CLASS4_HIGHER_RATE;
      niClass4 = lowerBandNI + upperBandNI;
    }
  }

  const totalTax = incomeTax + niClass2 + niClass4;
  const netIncome = taxableProfit - totalTax;

  return {
    grossIncome,
    allowableExpenses: expenses,
    taxableProfit,
    incomeTax: Math.round(incomeTax * 100) / 100,
    nationalInsuranceClass2: Math.round(niClass2 * 100) / 100,
    nationalInsuranceClass4: Math.round(niClass4 * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    netIncome: Math.round(netIncome * 100) / 100,
  };
};

export const filterByMonth = <T extends { date: string }>(
  items: T[],
  month: string // Format: YYYY-MM
): T[] => {
  return items.filter(item => item.date.startsWith(month));
};

export const filterByDateRange = <T extends { date: string }>(
  items: T[],
  startDate: string,
  endDate: string
): T[] => {
  return items.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
  });
};

export const calculateTotals = (
  contracts: Contract[],
  expenses: Expense[]
): { totalEarnings: number; totalExpenses: number; netProfit: number } => {
  const totalEarnings = contracts.reduce((sum, c) => sum + c.grossAmount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalEarnings - totalExpenses;

  return {
    totalEarnings: Math.round(totalEarnings * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
  };
};
