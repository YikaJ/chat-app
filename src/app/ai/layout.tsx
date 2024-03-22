import { AuthProvider } from '@/components/AuthProvider';
import { Header } from '@/components/Header';
import { AI } from './action';

const AIProvider = AI as any;

export default function AILayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AIProvider>{children}</AIProvider>
    </>
  );
}
