import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import { Header } from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });
// const AIProvider = AI as unknown as any;

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full h-full max-h-screen">
        <AuthProvider>
          <div className="w-full h-full max-h-screen flex flex-col overflow-hidden">
            {/* @ts-expect-error Async Server Component */}
            <Header />
            <div className="flex-1 overflow-hidden">{children}</div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
