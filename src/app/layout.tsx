
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
  const isOrbitPanelPage = pathname.startsWith('/orbitpanel');

  return (
     <html lang="en" suppressHydrationWarning>
      <head>
        <title>AttendX</title>
        <meta name="description" content="তেজগাঁও কলেজ ফটোগ্রাফি ক্লাব অ্যাটেনডেন্স ম্যানেজমেন্ট সিস্টেম" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={`font-sans antialiased ${poppins.variable}`}>
        <FirebaseClientProvider>
            {isAuthPage || isOrbitPanelPage ? (
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
