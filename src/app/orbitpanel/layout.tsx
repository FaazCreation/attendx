
'use client';

import { useUser, FirebaseClientProvider, useFirestore, useDoc } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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

  const { data: userData, isLoading: isUserRoleLoading } = useDoc(
    () => {
      if (!firestore || !user) return null;
      return doc(firestore, 'users', user.uid);
    },
    [firestore, user]
  );
  
  useEffect(() => {
    // If user is not logged in after check, redirect to login.
    if (!isUserLoading && !user) {
      router.push('/login');
    }
     // After loading, if there's a logged-in user but their role is not Admin, deny access
    if (user && !isUserRoleLoading && userData?.role !== 'Admin') {
        router.push('/dashboard');
    }

  }, [isUserLoading, user, isUserRoleLoading, userData, router]);


  // Show loading skeleton while user auth or role is being determined
  if (isUserLoading || (user && isUserRoleLoading)) {
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

  // After loading, if there's a logged-in user but their role is not Admin, deny access
  if (user && userData?.role !== 'Admin') {
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
  
  // If user is logged in and is an Admin, render the protected layout
  if (user && userData?.role === 'Admin') {
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

  // Fallback for the case where user is null after loading (handled by useEffect redirect)
  return null;
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
