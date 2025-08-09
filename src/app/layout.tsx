import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: "Capital Balance - Manage your money",
  description: 'Capital Balance is a modern, intuitive personal finance dashboard designed to help you take control of your financial life. Track your income and expenses, visualize your spending habits, and gain insights to make smarter financial decisions.',
  keywords: ["personal finance", "budgeting", "expense tracker", "money management", "finance dashboard"],
  authors: [{ name: "Atif Hasan" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://capital-balance.vercel.app/",
    title: "Capital Balance",
    description: "Take control of your financial life with an intuitive personal finance dashboard.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Capital Balance",
    description: "Take control of your financial life with an intuitive personal finance dashboard.",
  },
  icons: {
    icon: "/icon",
    shortcut: "/icon",
    apple: "/apple-icon",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
