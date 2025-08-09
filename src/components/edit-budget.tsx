"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";

const formSchema = z.object({
  budget: z.coerce.number().min(0, "Budget must be a positive number."),
});

type BudgetFormValues = z.infer<typeof formSchema>;

interface EditBudgetProps {
  currentBudget: number;
  onUpdateBudget: (newBudget: number) => void;
}

export function EditBudget({ currentBudget, onUpdateBudget }: EditBudgetProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budget: currentBudget,
    },
  });

  useEffect(() => {
    form.reset({ budget: currentBudget });
  }, [currentBudget, form]);

  const onSubmit = (values: BudgetFormValues) => {
    onUpdateBudget(values.budget);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Pencil className="h-4 w-4" />
        <span className="sr-only">Edit Budget</span>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Monthly Budget</DialogTitle>
          <DialogDescription>
            Set a new budget goal for the current month. This will help you track your spending more accurately.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 2500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Update Budget</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
