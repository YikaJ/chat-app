'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function ToLogin() {
  const pathname = usePathname();
  return <>{pathname !== '/login' && <Link href="login">去登录</Link>}</>;
}
