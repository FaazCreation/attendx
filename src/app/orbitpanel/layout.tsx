
'use client';

import { useUser, FirebaseClientProvider, useFirestore, useDoc } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import Header from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { doc } from 'firebase/firestore';

function ProtectedOrbitLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [permissionState, setPermissionState] = useState<'loading' | 'allowed' | 'denied'>('loading');

  const { data: userData, isLoading: isUserRoleLoading } = useDoc(
    () => {
      // Only run this query if we have a user
      if (!firestore || !user) return null;
      return doc(firestore, 'users', user.uid);
    },
    [firestore, user] // Dependencies
  );

  useEffect(() => {
    // Wait for initial user loading to finish
    if (isUserLoading) {
      return;
    }

    // If no user is logged in, deny access. The redirect will be handled by the effect below.
    if (!user) {
      setPermissionState('denied');
      return; 
    }
    
    // Now that we have a user, wait for their role data to load
    if (isUserRoleLoading) {
        return;
    }

    // Finally, check the role from the loaded user data
    if (userData?.role === 'Admin') {
      setPermissionState('allowed');
    } else {
      setPermissionState('denied');
    }

  }, [isUserLoading, user, isUserRoleLoading, userData, router]);

  useEffect(() => {
    if (permissionState === 'denied') {
        // If no user is logged in, redirect to login page. Otherwise, redirect to dashboard.
        if (!user) {
            router.push('/login');
        } else {
            router.push('/dashboard');
        }
    }
  }, [permissionState, user, router]);


  if (permissionState === 'loading') {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  if (permissionState === 'denied') {
    // Show a message while redirecting
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Card className="w-full max-w-md border-destructive">
          <CardHeader className="flex flex-row items-center gap-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <CardTitle>প্রবেশাধিকার নেই</CardTitle>
          </CardHeader>
          <CardContent>
            <p>এই পৃষ্ঠাটি দেখার জন্য আপনার অনুমতি নেই। আপনাকে ফেরত পাঠানো হচ্ছে...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // If permission is 'allowed', render the protected layout
  return (
    <div className="flex h-screen w-full bg-background">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}


export default function OrbitPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <ProtectedOrbitLayout>{children}</ProtectedOrbitLayout>
    </FirebaseClientProvider>
  );
}
