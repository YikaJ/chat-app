'use client';

import * as React from 'react';
import { signOut } from 'next-auth/react';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export function AccountMenu() {
  return (
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
  );
}
