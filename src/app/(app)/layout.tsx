'use client';

import Header from '@/components/layout/header';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function ProtectedAppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
      return;
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
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
  
  if (!user) {
    return null; // Redirect is happening
  }

  return (
      <div className="flex flex-col h-screen w-full">
        <Header />
        <main className="flex flex-1 flex-col overflow-y-auto p-4 sm:p-6 lg:p-8">
           <div className="flex flex-col flex-grow min-h-full">
            <div className="flex-grow">
              {children}
            </div>
           </div>
        </main>
      </div>
  );
}


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
        <ProtectedAppLayout>{children}</ProtectedAppLayout>
    </FirebaseClientProvider>
  );
}
