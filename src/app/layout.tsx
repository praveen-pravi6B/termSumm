import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider"; // Import ThemeProvider
import { AppBar } from '@/components/app-bar'; // Import AppBar

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TermSumm',
  description: 'Summarize terms and conditions with AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> {/* Add suppressHydrationWarning for next-themes */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Add AppBar here */}
            <AppBar />
            {/* Remove absolute positioning wrapper for ThemeToggle */}
            {children}
            <Toaster />
         </ThemeProvider>
      </body>
    </html>
  );
}
