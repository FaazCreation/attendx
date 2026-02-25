
'use client';
import { FirebaseClientProvider } from '@/firebase';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { doc } from 'firebase/firestore';
import { LoadingSplashScreen } from '@/components/layout/loading-splash-screen';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const { data: userData, isLoading: isUserRoleLoading } = useDoc(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  useEffect(() => {
    if (!isUserLoading && !isUserRoleLoading && user && userData) {
        router.replace('/dashboard');
    }
  }, [user, isUserLoading, userData, isUserRoleLoading, router]);
  
  if (isUserLoading || isUserRoleLoading || user) {
     return <LoadingSplashScreen />;
  }

  return (
    <FirebaseClientProvider>
        <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            {children}
        </main>
    </FirebaseClientProvider>
  );
}
