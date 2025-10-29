import { Contract, Expense } from './types';

const CONTRACTS_KEY = 'highland_contracts';
const EXPENSES_KEY = 'highland_expenses';

// Contract storage
export const saveContracts = (contracts: Contract[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CONTRACTS_KEY, JSON.stringify(contracts));
  }
};

export const loadContracts = (): Contract[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(CONTRACTS_KEY);
    return data ? JSON.parse(data) : [];
  }
  return [];
};

export const addContract = (contract: Contract): void => {
  const contracts = loadContracts();
  contracts.push(contract);
  saveContracts(contracts);
};

export const deleteContract = (id: string): void => {
  const contracts = loadContracts();
  const filtered = contracts.filter(c => c.id !== id);
  saveContracts(filtered);
};

// Expense storage
export const saveExpenses = (expenses: Expense[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  }
};

export const loadExpenses = (): Expense[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(EXPENSES_KEY);
    return data ? JSON.parse(data) : [];
  }
  return [];
};

export const addExpense = (expense: Expense): void => {
  const expenses = loadExpenses();
  expenses.push(expense);
  saveExpenses(expenses);
};

export const deleteExpense = (id: string): void => {
  const expenses = loadExpenses();
  const filtered = expenses.filter(e => e.id !== id);
  saveExpenses(filtered);
};
