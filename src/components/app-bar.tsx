
"use client";

import * as React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { FileText } from 'lucide-react'; // Example icon

export function AppBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
           <FileText className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg text-primary">TermSumm</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
