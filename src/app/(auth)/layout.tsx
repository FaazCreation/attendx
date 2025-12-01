'use client';
import { FirebaseClientProvider } from '@/firebase';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
        // If user is already logged in, redirect them away from auth pages
        router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  return (
    <FirebaseClientProvider>
        <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            {children}
        </main>
    </FirebaseClientProvider>
  );
}
