import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@features/auth/AuthProvider';
import { Toaster } from 'react-hot-toast';
import DebugAuth from '@components/DebugAuth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NCIP App',
  description: 'National Child Identity Protection System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
          <DebugAuth />
        </AuthProvider>
      </body>
    </html>
  );
}