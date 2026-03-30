import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ReduxProvider from './Provider';
import AuthChecker from '@/Guards/AuthChecker';
import { Toaster } from 'sonner';
import { SocketProvider } from '../../sockets/SocketContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Vakil Now - Legal & Compliance Services',
  description:
    'India’s most trusted platform for legal and compliance services.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProvider>
          <SocketProvider>
          {children}
          <Toaster />
          </SocketProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
