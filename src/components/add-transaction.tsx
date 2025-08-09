"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Transaction } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';

const formSchema = z.object({
  type: z.enum(['income', 'expense']),
  description: z.string().optional(),
  amount: z.coerce.number().positive("Amount must be a positive number."),
  date: z.date(),
  category: z.string().min(1, "Category is required."),
  newCategory: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof formSchema>;

const expenseCategories = ['Housing', 'Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Other'];

interface AddTransactionProps {
  onTransactionAdd: (transaction: Omit<Transaction, 'id'>) => void;
  incomeCategories: string[];
  onNewIncomeCategory: (category: string) => void;
  children: React.ReactNode;
}

export function AddTransaction({ onTransactionAdd, incomeCategories, onNewIncomeCategory, children }: AddTransactionProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'expense',
      description: '',
      amount: 0,
      date: new Date(),
      category: 'Food',
      newCategory: '',
    },
  });

  const transactionType = form.watch('type');
  const selectedCategory = form.watch('category');

  const onSubmit = (values: TransactionFormValues) => {
    let finalCategory = values.category;
    if (values.category === 'new' && values.newCategory) {
      finalCategory = values.newCategory;
      if (values.type === 'income' && !incomeCategories.includes(finalCategory)) {
        onNewIncomeCategory(finalCategory);
      }
    }
    onTransactionAdd({ ...values, category: finalCategory });
    form.reset();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <span onClick={() => setOpen(true)}>{children}</span>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Add a New Transaction</SheetTitle>
          <SheetDescription>
            Fill in the details of your income or expense.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 -mx-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 px-6 h-full">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue('category', '');
                      }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select transaction type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="expense">Expense</SelectItem>
                          <SelectItem value="income">Income</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Coffee with friends" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(transactionType === 'expense' ? expenseCategories : incomeCategories).map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                          {transactionType === 'income' && <SelectItem value="new">Add new category...</SelectItem>}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {selectedCategory === 'new' && transactionType === 'income' && (
                  <FormField
                    control={form.control}
                    name="newCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Income Category</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Side Hustle" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SheetFooter className="pt-4 gap-2">
                  <SheetClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </SheetClose>
                  <Button type="submit">Add Transaction</Button>
                </SheetFooter>
              </form>
            </Form>
          </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
