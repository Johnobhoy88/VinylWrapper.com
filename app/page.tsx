'use client';

import { useState, useEffect } from 'react';
import { Contract, Expense } from '@/lib/types';
import { loadContracts, loadExpenses, addContract, addExpense, deleteContract, deleteExpense } from '@/lib/storage';
import { calculateTax, calculateTotals, filterByMonth } from '@/lib/calculations';
import ContractForm from './components/ContractForm';
import ExpenseForm from './components/ExpenseForm';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';

export default function Home() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  useEffect(() => {
    setContracts(loadContracts());
    setExpenses(loadExpenses());

    // Set current month as default
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    setSelectedMonth(currentMonth);
  }, []);

  const handleAddContract = (contract: Contract) => {
    addContract(contract);
    setContracts(loadContracts());
  };

  const handleDeleteContract = (id: string) => {
    deleteContract(id);
    setContracts(loadContracts());
  };

  const handleAddExpense = (expense: Expense) => {
    addExpense(expense);
    setExpenses(loadExpenses());
  };

  const handleDeleteExpense = (id: string) => {
    deleteExpense(id);
    setExpenses(loadExpenses());
  };

  // Filter data by selected month
  const filteredContracts = selectedMonth
    ? filterByMonth(contracts, selectedMonth)
    : contracts;
  const filteredExpenses = selectedMonth
    ? filterByMonth(expenses, selectedMonth)
    : expenses;

  const totals = calculateTotals(filteredContracts, filteredExpenses);
  const yearlyTotals = calculateTotals(contracts, expenses);
  const taxCalc = calculateTax(yearlyTotals.totalEarnings, yearlyTotals.totalExpenses);

  return (
    <div className="space-y-8">
      {/* Month Selector */}
      <div className="bg-white p-6 rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          View Month
        </label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Dashboard */}
      <Dashboard
        monthlyTotals={totals}
        yearlyTotals={yearlyTotals}
        taxCalc={taxCalc}
        selectedMonth={selectedMonth}
      />

      {/* Input Forms */}
      <div className="grid md:grid-cols-2 gap-8">
        <ContractForm onAdd={handleAddContract} />
        <ExpenseForm onAdd={handleAddExpense} />
      </div>

      {/* Data Lists */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Contracts List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Contracts ({filteredContracts.length})</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredContracts.length === 0 ? (
              <p className="text-gray-500 italic">No contracts for this month</p>
            ) : (
              filteredContracts.map((contract) => (
                <div key={contract.id} className="border border-gray-200 p-4 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{contract.clientName}</p>
                      <p className="text-sm text-gray-600">{contract.description}</p>
                      <p className="text-sm text-gray-500">{new Date(contract.date).toLocaleDateString('en-GB')}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteContract(contract.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">£{contract.grossAmount.toFixed(2)}</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      contract.paymentStatus === 'received'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {contract.paymentStatus}
                    </span>
                  </div>
                  {contract.notes && (
                    <p className="text-sm text-gray-600 mt-2">Note: {contract.notes}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Expenses List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Expenses ({filteredExpenses.length})</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredExpenses.length === 0 ? (
              <p className="text-gray-500 italic">No expenses for this month</p>
            ) : (
              filteredExpenses.map((expense) => (
                <div key={expense.id} className="border border-gray-200 p-4 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{expense.category}</p>
                      <p className="text-sm text-gray-600">{expense.description}</p>
                      <p className="text-sm text-gray-500">{new Date(expense.date).toLocaleDateString('en-GB')}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <span className="text-lg font-bold text-red-600">£{expense.amount.toFixed(2)}</span>
                  {expense.notes && (
                    <p className="text-sm text-gray-600 mt-2">Note: {expense.notes}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Reports */}
      <Reports
        contracts={filteredContracts}
        expenses={filteredExpenses}
        totals={totals}
        taxCalc={taxCalc}
        selectedMonth={selectedMonth}
      />
    </div>
  );
}
