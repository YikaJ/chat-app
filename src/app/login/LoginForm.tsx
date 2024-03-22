'use client';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  async function handleLogin() {
    const response = await signIn('credentials', {
      callbackUrl,
      email: 'developer@tencent.com',
    });
    console.log({ response }, callbackUrl);
  }

  return (
    <div className="flex justify-center items-center">
      <Button size="lg" variant="secondary" onClick={handleLogin}>
        去登录
      </Button>
    </div>
  );
}
