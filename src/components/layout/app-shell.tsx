'use client';

import Header from '@/components/layout/header';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
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
