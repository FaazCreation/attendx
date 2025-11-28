'use client';

import Header from '@/components/layout/header';
import AppSidebar from '@/components/layout/sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

function ProtectedAppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    // If auth state is resolved and there's no user, redirect to login.
    if (!isUserLoading && !user) {
      router.push('/login');
      return;
    }

    // If we have a user, check their role, but only if they try to access the dashboard.
    if (user && firestore && pathname.startsWith('/dashboard')) {
      const checkAdmin = async () => {
        const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
        try {
          const docSnap = await getDoc(adminRoleRef);
          if (!docSnap.exists()) {
            // If the user is not an admin and tries to access the dashboard,
            // redirect them to a safe default page, like the members page.
            toast({
              variant: "destructive",
              title: "Access Denied",
              description: "You do not have permission to view the dashboard.",
            });
            router.push('/members');
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          toast({
              variant: "destructive",
              title: "Permission Error",
              description: "Could not verify your role. Please try again later.",
          });
          // On error, redirect to a safe page.
          router.push('/members');
        }
      };
      checkAdmin();
    }
  }, [user, isUserLoading, router, firestore, pathname, toast]);

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
  
  // If we have a user, render the app layout.
  // If we're still loading, we show the skeleton, so we only get here if loading is false.
  // If there's no user, the useEffect will have already initiated a redirect.
  // This prevents a flash of the UI before the redirect happens.
  if (!user) {
    return null; // or a loading spinner
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
