
"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Transaction } from '@/lib/types';
import { startOfMonth, endOfMonth, isWithinInterval, format } from 'date-fns';

const initialTransactions: Transaction[] = [];

const initialIncomeCategories = ['Salary', 'Freelance', 'Investment', 'Other'];
const initialMonthlyBudgets: Record<string, number> = {};

const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);


  useEffect(() => {
    if (isClient) {
      try {
        const item = window.localStorage.getItem(key);
        
        if (item) {
          const stored = JSON.parse(item, (k, v) => (k === 'date' ? new Date(v) : v));
          // One-time check to clear sample data from previous versions
          if (key === 'transactions' && Array.isArray(stored) && stored.length > 0 && Array.isArray(initialValue) && initialValue.length === 0) {
             const isSampleData = stored.some((t: any) => t.category === 'Salary' && t.amount === 5000);
             if (isSampleData) {
                setStoredValue(initialValue);
                window.localStorage.setItem(key, JSON.stringify(initialValue));
                return;
             }
          }
          setStoredValue(stored);
        } else {
          setStoredValue(initialValue);
          window.localStorage.setItem(key, JSON.stringify(initialValue));
        }
      } catch (error)
 {
        console.log(error);
        setStoredValue(initialValue);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, isClient]);


  const setValue = (value: T | ((val: T) => T)) => {
    if (isClient) {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return [storedValue, setValue] as const;
};

export function useFinance() {
  const [allTransactions, setAllTransactions] = useLocalStorage<Transaction[]>('transactions', initialTransactions);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [incomeCategories, setIncomeCategories] = useLocalStorage<string[]>('incomeCategories', initialIncomeCategories);
  const [monthlyBudgets, setMonthlyBudgets] = useLocalStorage<Record<string, number>>('monthlyBudgets', initialMonthlyBudgets);

  const transactions = useMemo(() => {
    if (!allTransactions) return [];
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    return allTransactions.filter(t => isWithinInterval(new Date(t.date), { start, end }));
  }, [allTransactions, selectedDate]);
  
  const monthKey = useMemo(() => format(selectedDate, 'yyyy-MM'), [selectedDate]);
  
  const budgetGoal = useMemo(() => monthlyBudgets[monthKey] || 0, [monthlyBudgets, monthKey]);

  const { totalIncome, totalExpenses, balance, expenseData } = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenseCategoryTotals = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
      
    const expenseChartData = Object.entries(expenseCategoryTotals)
      .map(([name, total]) => ({ name, total, fill: `var(--color-${name.toLowerCase().replace(' ', '-')})`}))
      .sort((a, b) => b.total - a.total);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      expenseData: expenseChartData,
    };
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    setAllTransactions(prev => [...(prev || []), { ...transaction, id: Date.now().toString() }]);
  };

  const deleteTransaction = (id: string) => {
    setAllTransactions(prev => (prev || []).filter(t => t.id !== id));
  };
  
  const clearMonthlyTransactions = () => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    setAllTransactions(prev => (prev || []).filter(t => !isWithinInterval(new Date(t.date), { start, end })));
  };
  
  const addIncomeCategory = (category: string) => {
    if (!incomeCategories.includes(category)) {
        setIncomeCategories(prev => [...prev, category]);
    }
  }

  const setBudgetGoal = useCallback((newBudget: number) => {
    setMonthlyBudgets(prev => ({
      ...prev,
      [monthKey]: newBudget
    }));
  }, [monthKey, setMonthlyBudgets]);

  return {
    transactions,
    budgetGoal,
    setBudgetGoal,
    totalIncome,
    totalExpenses,
    balance,
    expenseData,
    addTransaction,
    deleteTransaction,
    clearMonthlyTransactions,
    incomeCategories,
    addIncomeCategory,
    selectedDate,
    setSelectedDate,
  };
}
