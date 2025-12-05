
'use client';

import Header from '@/components/layout/header';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { doc } from 'firebase/firestore';
import { AttendXIcon } from '../icons';

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
    // 1. If auth is still loading, wait.
    if (isUserLoading) return;
    
    // 2. If no user is logged in, redirect to login page.
    if (!user) {
      if (pathname !== '/login' && pathname !== '/register') {
        router.push('/login');
      }
      return;
    }

    // 3. User is logged in, but role is not determined yet. Wait.
    if (isUserRoleLoading) return;

    // 4. User and role are loaded. Check role permissions.
    const isAdmin = userData?.role === 'Admin';
    
    // If user is on an admin path but is not an admin, redirect to general dashboard.
    if (isAdminPath && !isAdmin) {
      router.push('/dashboard');
      return;
    }

  }, [user, isUserLoading, userData, isUserRoleLoading, router, pathname, isAdminPath]);


  // Show loading skeleton until auth and role are resolved.
  if (isUserLoading || (user && isUserRoleLoading)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-pulse">
            <AttendXIcon className="h-12 w-12 text-primary" />
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

    