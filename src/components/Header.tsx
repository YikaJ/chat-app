'use client';

import * as React from 'react';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { signOut, useSession } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const session = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" px-4 flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="mr-4 hidden md:flex flex-1">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Icons.logo className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">AI</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/chats"
            >
              会话
            </Link>
            <Link
              href="/devops"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              运维专项
            </Link>
          </nav>
        </div>
        <div>
          {session.status === 'loading' && 'loading...'}
          {session.status === 'unauthenticated' && (
            <Link href="login">去登录</Link>
          )}
          {session.status === 'authenticated' && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="cursor-pointer">{session.data?.user?.name}</div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>账户</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div
                    className="cursor-pointer"
                    onClick={() => signOut({ callbackUrl: '/login' })}
                  >
                    退出登录
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
