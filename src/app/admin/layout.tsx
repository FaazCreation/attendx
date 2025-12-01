'use client';
import { FirebaseClientProvider } from '@/firebase';
import AppShell from '@/components/layout/app-shell';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <AppShell>
        {children}
      </AppShell>
    </FirebaseClientProvider>
  );
}
