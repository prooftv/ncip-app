import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Ensure this import exists
import ClientRoot from './ClientRoot';
import { processPendingEmergencies } from '@lib/offline/emergencyQueue';
import ServiceWorkerRegister from '@components/ServiceWorkerRegister';

// Initialize emergency queue processing
if (typeof window !== 'undefined') {
  if (navigator.onLine) {
    setTimeout(processPendingEmergencies, 5000);
  }
  
  window.addEventListener('online', () => {
    setTimeout(processPendingEmergencies, 3000);
  });
}

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NCIP App',
  description: 'National Child Identification Program',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientRoot>
          <ServiceWorkerRegister />
          {children}
        </ClientRoot>
      </body>
    </html>
  );
}
