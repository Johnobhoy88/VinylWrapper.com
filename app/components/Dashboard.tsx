'use client';

import { TaxCalculation } from '@/lib/types';

interface DashboardProps {
  monthlyTotals: {
    totalEarnings: number;
    totalExpenses: number;
    netProfit: number;
  };
  yearlyTotals: {
    totalEarnings: number;
    totalExpenses: number;
    netProfit: number;
  };
  taxCalc: TaxCalculation;
  selectedMonth: string;
}

export default function Dashboard({ monthlyTotals, yearlyTotals, taxCalc, selectedMonth }: DashboardProps) {
  const formatMonth = (monthStr: string) => {
    if (!monthStr) return 'All Time';
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Monthly Summary */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Monthly Summary - {formatMonth(selectedMonth)}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
            <p className="text-3xl font-bold text-green-600">£{monthlyTotals.totalEarnings.toFixed(2)}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
            <p className="text-3xl font-bold text-red-600">£{monthlyTotals.totalExpenses.toFixed(2)}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Net Profit</p>
            <p className="text-3xl font-bold text-blue-600">£{monthlyTotals.netProfit.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Yearly Tax Estimate */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Yearly Tax Estimate (Full Year)</h2>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Gross Income (Year)</p>
              <p className="text-xl font-bold">£{yearlyTotals.totalEarnings.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Allowable Expenses (Year)</p>
              <p className="text-xl font-bold">£{yearlyTotals.totalExpenses.toFixed(2)}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-2">Taxable Profit</p>
            <p className="text-2xl font-bold text-blue-600">£{taxCalc.taxableProfit.toFixed(2)}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Income Tax</p>
              <p className="text-lg font-bold">£{taxCalc.incomeTax.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">NI Class 2</p>
              <p className="text-lg font-bold">£{taxCalc.nationalInsuranceClass2.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">NI Class 4</p>
              <p className="text-lg font-bold">£{taxCalc.nationalInsuranceClass4.toFixed(2)}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Total Tax & NI</p>
              <p className="text-2xl font-bold text-red-600">£{taxCalc.totalTax.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-lg font-semibold">Net Income (After Tax)</p>
              <p className="text-2xl font-bold text-green-600">£{taxCalc.netIncome.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
