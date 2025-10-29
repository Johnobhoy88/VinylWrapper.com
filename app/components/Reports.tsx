'use client';

import { Contract, Expense, TaxCalculation } from '@/lib/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportsProps {
  contracts: Contract[];
  expenses: Expense[];
  totals: {
    totalEarnings: number;
    totalExpenses: number;
    netProfit: number;
  };
  taxCalc: TaxCalculation;
  selectedMonth: string;
}

export default function Reports({ contracts, expenses, totals, taxCalc, selectedMonth }: ReportsProps) {
  const formatMonth = (monthStr: string) => {
    if (!monthStr) return 'All Time';
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  };

  const generateUniversalCreditPDF = () => {
    const doc = new jsPDF();
    const monthName = formatMonth(selectedMonth);

    // Title
    doc.setFontSize(18);
    doc.text('Universal Credit Earnings Report', 14, 20);

    doc.setFontSize(12);
    doc.text(`Period: ${monthName}`, 14, 30);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, 14, 36);

    // Summary
    doc.setFontSize(14);
    doc.text('Income Summary', 14, 50);

    doc.setFontSize(11);
    doc.text(`Gross Earnings: £${totals.totalEarnings.toFixed(2)}`, 20, 58);
    doc.text(`Business Expenses: £${totals.totalExpenses.toFixed(2)}`, 20, 64);
    doc.setFont(undefined, 'bold');
    doc.text(`Net Profit: £${totals.netProfit.toFixed(2)}`, 20, 70);
    doc.setFont(undefined, 'normal');

    // Contracts table
    doc.setFontSize(14);
    doc.text('Contracts / Income', 14, 85);

    const contractData = contracts.map(c => [
      new Date(c.date).toLocaleDateString('en-GB'),
      c.clientName,
      c.description,
      `£${c.grossAmount.toFixed(2)}`,
      c.paymentStatus
    ]);

    autoTable(doc, {
      startY: 90,
      head: [['Date', 'Client', 'Description', 'Amount', 'Status']],
      body: contractData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 9 },
    });

    // Expenses table
    const finalY = (doc as any).lastAutoTable.finalY || 90;
    doc.setFontSize(14);
    doc.text('Business Expenses', 14, finalY + 15);

    const expenseData = expenses.map(e => [
      new Date(e.date).toLocaleDateString('en-GB'),
      e.category,
      e.description,
      `£${e.amount.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: finalY + 20,
      head: [['Date', 'Category', 'Description', 'Amount']],
      body: expenseData,
      theme: 'grid',
      headStyles: { fillColor: [192, 57, 43] },
      styles: { fontSize: 9 },
    });

    // Notes section
    const finalY2 = (doc as any).lastAutoTable.finalY || finalY + 20;
    doc.setFontSize(10);
    doc.text('Note: This report shows self-employment income for Universal Credit purposes.', 14, finalY2 + 15);
    doc.text('Net profit should be reported as monthly earnings.', 14, finalY2 + 21);

    doc.save(`UC-Report-${selectedMonth}.pdf`);
  };

  const generateBankruptcyPDF = () => {
    const doc = new jsPDF();
    const monthName = formatMonth(selectedMonth);

    // Title
    doc.setFontSize(18);
    doc.text('Bankruptcy Trustee Income Report', 14, 20);

    doc.setFontSize(12);
    doc.text(`Period: ${monthName}`, 14, 30);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, 14, 36);
    doc.text('Valid until: February 2025', 14, 42);

    // Income & Expenditure Summary
    doc.setFontSize(14);
    doc.text('Income & Expenditure', 14, 56);

    doc.setFontSize(11);
    doc.text(`Total Income (Gross): £${totals.totalEarnings.toFixed(2)}`, 20, 64);
    doc.text(`Business Expenses: £${totals.totalExpenses.toFixed(2)}`, 20, 70);
    doc.setFont(undefined, 'bold');
    doc.text(`Net Income: £${totals.netProfit.toFixed(2)}`, 20, 76);
    doc.setFont(undefined, 'normal');

    // Disposable Income
    doc.setFontSize(14);
    doc.text('Disposable Income Calculation', 14, 90);

    doc.setFontSize(11);
    doc.text(`Monthly Net Income: £${totals.netProfit.toFixed(2)}`, 20, 98);
    doc.text('Less: Reasonable Living Expenses: £_____ (to be confirmed)', 20, 104);
    doc.text('Disposable Income: £_____ (to be calculated)', 20, 110);

    // Income Details
    doc.setFontSize(14);
    doc.text('Income Details', 14, 125);

    const contractData = contracts.map(c => [
      new Date(c.date).toLocaleDateString('en-GB'),
      c.clientName,
      c.description,
      `£${c.grossAmount.toFixed(2)}`,
      c.paymentStatus
    ]);

    autoTable(doc, {
      startY: 130,
      head: [['Date', 'Client', 'Description', 'Amount', 'Status']],
      body: contractData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 9 },
    });

    // Expenses
    const finalY = (doc as any).lastAutoTable.finalY || 130;
    doc.setFontSize(14);
    doc.text('Business Expenses', 14, finalY + 15);

    const expenseData = expenses.map(e => [
      new Date(e.date).toLocaleDateString('en-GB'),
      e.category,
      e.description,
      `£${e.amount.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: finalY + 20,
      head: [['Date', 'Category', 'Description', 'Amount']],
      body: expenseData,
      theme: 'grid',
      headStyles: { fillColor: [192, 57, 43] },
      styles: { fontSize: 9 },
    });

    // Declaration
    const finalY2 = (doc as any).lastAutoTable.finalY || finalY + 20;
    doc.setFontSize(10);
    doc.text('Declaration: This report accurately reflects my self-employment income', 14, finalY2 + 15);
    doc.text('and business expenses for the stated period.', 14, finalY2 + 21);
    doc.text('Signature: ________________________  Date: ____________', 14, finalY2 + 35);

    doc.save(`Bankruptcy-Report-${selectedMonth}.pdf`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Generate Reports</h2>

      <div className="space-y-4">
        <div className="border border-gray-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Universal Credit Report</h3>
          <p className="text-sm text-gray-600 mb-4">
            Generate a monthly earnings report for Universal Credit showing gross income,
            allowable expenses, and net profit. Report period: {formatMonth(selectedMonth)}
          </p>
          <button
            onClick={generateUniversalCreditPDF}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Download UC Report (PDF)
          </button>
        </div>

        <div className="border border-gray-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Bankruptcy Trustee Report</h3>
          <p className="text-sm text-gray-600 mb-4">
            Generate an income and expenditure report for your bankruptcy trustee showing
            all income sources and business expenses. Report period: {formatMonth(selectedMonth)}
          </p>
          <button
            onClick={generateBankruptcyPDF}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Download Bankruptcy Report (PDF)
          </button>
        </div>

        <div className="border border-gray-200 p-4 rounded-lg bg-yellow-50">
          <h3 className="text-lg font-semibold mb-2">Tax Summary (Year to Date)</h3>
          <div className="text-sm space-y-2">
            <p><span className="font-medium">Taxable Profit:</span> £{taxCalc.taxableProfit.toFixed(2)}</p>
            <p><span className="font-medium">Estimated Income Tax:</span> £{taxCalc.incomeTax.toFixed(2)}</p>
            <p><span className="font-medium">National Insurance (Class 2):</span> £{taxCalc.nationalInsuranceClass2.toFixed(2)}</p>
            <p><span className="font-medium">National Insurance (Class 4):</span> £{taxCalc.nationalInsuranceClass4.toFixed(2)}</p>
            <p className="font-bold border-t pt-2 mt-2">
              <span>Total Tax & NI:</span> £{taxCalc.totalTax.toFixed(2)}
            </p>
          </div>
          <p className="text-xs text-gray-600 mt-4">
            Note: Tax calculations are estimates based on 2024/2025 tax year rates.
            Always consult with an accountant for accurate tax advice.
          </p>
        </div>
      </div>
    </div>
  );
}
