
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AddTransaction } from '@/components/add-transaction';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { format, isSameMonth } from 'date-fns';
import { ArrowUpCircle, ArrowDownCircle, Scale, Target, Plus, Trash2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFinance } from '@/hooks/use-finance';
import { ThemeToggle } from './theme-toggle';
import { Calendar } from '@/components/ui/calendar';
import { Logo } from './logo';
import { EditBudget } from './edit-budget';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Link from 'next/link';

const chartConfig = {
  total: { label: "Total" },
  housing: { label: "Housing", color: "hsl(var(--chart-1))" },
  food: { label: "Food", color: "hsl(var(--chart-2))" },
  transport: { label: "Transport", color: "hsl(var(--chart-3))" },
  entertainment: { label: "Entertainment", color: "hsl(var(--chart-4))" },
  utilities: { label: "Utilities", color: "hsl(var(--chart-5))" },
  health: { label: "Health", color: "hsl(var(--chart-3))" },
  other: { label: "Other", color: "hsl(var(--chart-2))" },
  salary: { label: "Salary", color: "hsl(var(--chart-1))" },
  freelance: { label: "Freelance", color: "hsl(var(--chart-2))" },
  investment: { label: "Investment", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;

export function Dashboard() {
  const {
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
  } = useFinance();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);


  const handleMonthChange = (month: Date) => {
    setSelectedDate(month);
  };
  
  const isCurrentMonth = isSameMonth(selectedDate, new Date());

  const budgetProgress = budgetGoal > 0 ? Math.min((totalExpenses / budgetGoal) * 100, 100) : 0;
  
  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-background">
        <div className="flex items-center gap-4">
          <Logo className="w-12 h-12 text-primary animate-pulse" />
          <h1 className="text-2xl font-bold text-foreground">Loading...</h1>
        </div>
      </div>
    );
  }

  const barChartHeight = expenseData.length > 0 ? `${expenseData.length * 40 + 20}px` : '0px';

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <header className="sticky top-0 z-50 flex items-center h-16 px-4 border-b shrink-0 md:px-6 bg-background/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2 mr-auto no-underline" prefetch={false}>
          <Logo className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Capital Balance</h1>
        </Link>
        <div className="flex items-center gap-4 ml-auto">
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 p-4 space-y-4 md:p-8">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <ArrowUpCircle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">৳{totalIncome.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">for {format(selectedDate, 'MMMM yyyy')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <ArrowDownCircle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">৳{totalExpenses.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">for {format(selectedDate, 'MMMM yyyy')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Remaining Balance</CardTitle>
              <Scale className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">৳{balance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Remaining funds</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Budget Goal</CardTitle>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <EditBudget currentBudget={budgetGoal} onUpdateBudget={setBudgetGoal} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">৳{totalExpenses.toLocaleString()} / <span className="text-muted-foreground">৳{budgetGoal.toLocaleString()}</span></div>
              <Progress value={budgetProgress} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader className="flex flex-row items-start justify-between sm:items-center">
              <div className="grid gap-2">
                <CardTitle>Transactions</CardTitle>
                <CardDescription>Your transactions for {format(selectedDate, 'MMMM yyyy')}.</CardDescription>
              </div>
              <div className="flex flex-col-reverse items-end gap-2 sm:flex-row sm:items-center">
                {transactions.length > 0 && (
                   <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Trash2 className="h-4 w-4" /> Clear History
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete all transactions for {format(selectedDate, 'MMMM yyyy')}. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>No</AlertDialogCancel>
                        <AlertDialogAction onClick={clearMonthlyTransactions}>Yes</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                <AddTransaction 
                  onTransactionAdd={addTransaction}
                  incomeCategories={incomeCategories}
                  onNewIncomeCategory={addIncomeCategory}
                >
                  <Button size="sm" className="gap-1">
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </AddTransaction>
              </div>
            </CardHeader>
            <CardContent>
              {sortedTransactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="hidden sm:table-cell">Date</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTransactions.map(t => (
                      <TableRow key={t.id}>
                        <TableCell>
                          <div className="font-medium">{t.description || '-'}</div>
                        </TableCell>
                        <TableCell><Badge variant={t.type === 'expense' ? 'secondary' : 'default'} className={cn(t.type === 'income' && 'bg-primary/20 text-primary border-primary/40')}>{t.category}</Badge></TableCell>
                        <TableCell className={cn('text-right', t.type === 'income' ? 'text-primary' : 'text-foreground')}>
                          {t.type === 'income' ? '+' : '-'}৳{t.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{format(t.date, 'MMM d, yyyy')}</TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this transaction.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteTransaction(t.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <p className="text-muted-foreground">Click the '+' button to add your first transaction.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="lg:col-span-3 space-y-4 flex flex-col">
             <Card>
              <CardHeader>
                <CardTitle>Expense Analysis</CardTitle>
                <CardDescription>Spending by category for {format(selectedDate, 'MMMM yyyy')}</CardDescription>
              </CardHeader>
              <CardContent className="pl-6 pr-6">
                {expenseData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="w-full" style={{ height: barChartHeight }}>
                    <ResponsiveContainer>
                      <BarChart data={expenseData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={80} tick={{fontSize: 12}} />
                        <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                        <Bar dataKey="total" radius={5}>
                          {expenseData.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={`var(--color-${entry.name.toLowerCase().replace(' ', '-')})`} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="flex items-center justify-center h-[90px]">
                    <p className="text-muted-foreground">No expense data for this month.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Calendar</CardTitle>
                {!isCurrentMonth && (
                    <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
                        Go to Today
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                )}
              </CardHeader>
              <CardContent className="flex-grow flex items-center justify-center p-0">
                 <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => setSelectedDate(date || new Date())}
                    month={selectedDate}
                    onMonthChange={handleMonthChange}
                    className="rounded-md"
                  />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="flex items-center justify-center h-16 px-4 border-t shrink-0 md:px-6">
        <p className="text-sm text-center text-muted-foreground sm:text-left">&copy; 2025 Capital Balance. All rights reserved | Developed by Atif Hasan</p>
      </footer>
    </div>
  );
}
