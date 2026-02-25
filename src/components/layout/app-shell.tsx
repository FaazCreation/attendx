
'use client';

import Header from '@/components/layout/header';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { doc } from 'firebase/firestore';
import { DocXIcon } from '../icons';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  const { data: userData, isLoading: isUserRoleLoading } = useDoc(() => {
      if (!user || !firestore) return null;
      return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const isAdminPath = pathname.startsWith('/admin');

  useEffect(() => {
    if (isUserLoading) return;
    
    if (!user) {
      if (pathname !== '/login' && pathname !== '/register') {
        router.push('/login');
      }
      return;
    }

    if (isUserRoleLoading) return;

    const isAdmin = userData?.role === 'Admin';
    
    if (isAdminPath && !isAdmin) {
      router.push('/dashboard');
      return;
    }

  }, [user, isUserLoading, userData, isUserRoleLoading, router, pathname, isAdminPath]);

  if (isUserLoading || (user && isUserRoleLoading)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-pulse">
            <DocXIcon className="h-12 w-12 text-primary" />
            <p className="text-muted-foreground">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
      <div className="flex flex-col h-screen w-full">
        <Header />
        <main className="flex flex-1 flex-col overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
           <div className="flex flex-col flex-grow min-h-full">
            <div className="flex-grow">
              {children}
            </div>
           </div>
        </main>
      </div>
  );
}
