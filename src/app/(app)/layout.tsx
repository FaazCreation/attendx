'use client';

import Header from '@/components/layout/header';
import AppSidebar from '@/components/layout/sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';

function ProtectedAppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      const checkAdmin = async () => {
        const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
        try {
          const docSnap = await getDoc(adminRoleRef);
          if (!docSnap.exists()) {
            // Not an admin, redirect away from dashboard if they are trying to access it.
            // This is a simple check. For a real app, you might want more sophisticated role checking
            // depending on which page they are on.
            // For now, we are protecting the root of the authenticated app experience.
            if (window.location.pathname.startsWith('/dashboard')) {
                 router.push('/login'); // Or a general user page
            }
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          router.push('/login');
        }
      };
      checkAdmin();
    }
  }, [user, isUserLoading, router, firestore]);

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

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
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
