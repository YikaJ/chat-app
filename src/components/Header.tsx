'use client';

import * as React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" pl-4 flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2">
            <Icons.logo className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">AI</span>
          </a>
          <nav className="flex items-center gap-6 text-sm">
            <a
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/chats"
            >
              会话
            </a>
            <a className="transition-colors hover:text-foreground/80 text-foreground/60">
              运维专项
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
