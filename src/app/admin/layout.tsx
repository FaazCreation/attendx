'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase, FirebaseClientProvider } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import Header from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  // Memoize the user document reference
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  
  const { data: currentUserData, isLoading: isUserDocLoading } = useDoc(userDocRef);

  const hasPermission = useMemo(() => {
    if (!currentUserData) return false; // If no user data, no permission
    const role = currentUserData.role;
    return role === 'Admin' || role === 'Executive Member';
  }, [currentUserData]);
  
  useEffect(() => {
    const isLoading = isUserLoading || isUserDocLoading;
    
    // If not loading and user is not logged in, redirect to login
    if (!isUserLoading && !user) {
        router.push('/login');
        return;
    }
    
    // After all data has loaded, if there is a user but they don't have permission, redirect to dashboard
    if (!isLoading && user && !hasPermission) {
      router.push('/dashboard');
    }
  }, [isUserLoading, isUserDocLoading, hasPermission, router, user]);

  const isLoading = isUserLoading || isUserDocLoading;

  if (isLoading) {
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

  if (!user || !hasPermission) {
     return (
       <div className="flex items-center justify-center h-screen bg-background">
        <Card className="w-full max-w-md border-destructive">
          <CardHeader className="flex flex-row items-center gap-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <CardTitle>প্রবেশাধিকার নেই</CardTitle>
          </CardHeader>
          <CardContent>
            <p>এই পৃষ্ঠাটি দেখার জন্য আপনার অনুমতি নেই। আপনাকে ড্যাশবোর্ডে ফেরত পাঠানো হচ্ছে...</p>
          </CardContent>
        </Card>
       </div>
    );
  }

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


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
        <ProtectedAdminLayout>{children}</ProtectedAdminLayout>
    </FirebaseClientProvider>
  );
}
