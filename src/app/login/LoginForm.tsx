'use client';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  async function handleLogin() {
    const response = await signIn('credentials', { callbackUrl });
    console.log({ response }, callbackUrl);
  }

  return <Button onClick={handleLogin}>去登录</Button>;
}
