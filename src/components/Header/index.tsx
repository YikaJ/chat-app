import * as React from 'react';
import Link from 'next/link';
import { Icons } from '../icons';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AccountMenu } from './AccountMenu';
import { DropdownMenu, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ToLogin } from './ToLogin';

export async function Header() {
  const session = await getServerSession(authOptions);

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
              href="/ai/chats"
            >
              会话
            </Link>
            <Link
              href="/ai/devops"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              运维专项
            </Link>
          </nav>
        </div>
        <div>
          {!session?.user && <ToLogin />}
          {session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:underline underline-offset-4  ">
                {session?.user?.name}
              </DropdownMenuTrigger>
              <AccountMenu />
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
