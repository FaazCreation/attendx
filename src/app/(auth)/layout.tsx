
'use client';
import { FirebaseClientProvider } from '@/firebase';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

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
        if (userData.role === 'Admin') {
            router.replace('/dashboard');
        } else {
            router.replace('/dashboard');
        }
    }
  }, [user, isUserLoading, userData, isUserRoleLoading, router]);
  
  if (isUserLoading || isUserRoleLoading || user) {
     return (
        <div className="flex h-screen w-screen items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
      </div>
    );
  }

  return (
    <FirebaseClientProvider>
        <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            {children}
        </main>
    </FirebaseClientProvider>
  );
}

    