export interface Contract {
  id: string;
  date: string;
  clientName: string;
  description: string;
  grossAmount: number;
  paymentStatus: 'invoiced' | 'received';
  notes?: string;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  notes?: string;
}

export interface MonthlyReport {
  month: string; // Format: YYYY-MM
  totalEarnings: number;
  totalExpenses: number;
  netProfit: number;
  estimatedIncomeTax: number;
  estimatedNI: number;
  contracts: Contract[];
  expenses: Expense[];
}

export interface TaxCalculation {
  grossIncome: number;
  allowableExpenses: number;
  taxableProfit: number;
  incomeTax: number;
  nationalInsuranceClass2: number;
  nationalInsuranceClass4: number;
  totalTax: number;
  netIncome: number;
}
