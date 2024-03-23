'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function NewChat() {
  const router = useRouter();
  return (
    <Button
      className="w-full box-border"
      onClick={() => router.push('/ai/chats')}
    >
      新建会话
    </Button>
  );
}
