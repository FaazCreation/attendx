
'use client';

import { Poppins } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from 'next/navigation';
import AppShell from '@/components/layout/app-shell';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

  return (
     <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>DocX | Data Simplified</title>
        <meta name="description" content="তেজগাঁও কলেজ ফটোগ্রাফি ক্লাব ডেটা সিস্টেম" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Favicon & App Icons */}
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#15803d" />
      </head>
      <body className={`font-sans antialiased ${poppins.variable}`}>
        <FirebaseClientProvider>
            {isAuthPage ? (
              children
            ) : (
              <AppShell>
                {children}
              </AppShell>
            )}
            <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
