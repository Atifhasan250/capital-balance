'use client';

import { useState } from 'react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="sticky top-0 z-50 flex items-center h-16 px-4 border-b shrink-0 md:px-6 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 mr-auto">
          <Logo className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Capital Balance</h1>
        </div>
        <ThemeToggle />
      </header>
      <main className="flex-1">
        <section className="container flex items-center justify-center flex-1 h-full px-4 py-12 md:px-6">
           <Card className="w-full max-w-3xl text-center">
             <CardHeader className="p-8">
                <CardTitle className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Take Control of Your Financial Life</CardTitle>
                <CardDescription className="pt-4 text-base md:text-xl">
                    <p>Capital Balance is a modern, intuitive personal finance dashboard designed to help you track your income and expenses, visualize your spending habits, and gain insights to make smarter financial decisions.</p>
                    <p className="mt-4">No login required—just start using it from your device, and your data will be saved locally.</p>
                </CardDescription>
             </CardHeader>
             <CardContent>
                <Link href="/dashboard" prefetch={false} onClick={() => setIsLoading(true)}>
                    <Button size="lg" className="h-12 px-10 text-base" disabled={isLoading}>
                    Get Started 
                    {isLoading ? (
                      <Loader2 className="ml-2 animate-spin" />
                    ) : (
                      <ArrowRight className="ml-2" />
                    )}
                    </Button>
                </Link>
             </CardContent>
             <CardFooter>
             </CardFooter>
           </Card>
        </section>
      </main>
      <footer className="flex items-center justify-center h-16 px-4 border-t shrink-0 md:px-6">
        <p className="text-sm text-center text-muted-foreground sm:text-left">&copy; 2025 Capital Balance. All rights reserved | Developed by Atif Hasan</p>
      </footer>
    </div>
  );
}
