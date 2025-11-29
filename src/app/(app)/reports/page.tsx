'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, AlertTriangle } from 'lucide-react';
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReportsPage() {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: currentUserData, isLoading: isCurrentUserLoading } = useDoc(userDocRef);

  const canViewPage = useMemo(() => {
    if (!currentUserData) return false;
    return ['Admin', 'Executive Member'].includes(currentUserData.role);
  }, [currentUserData]);

  const isGeneralMember = !isCurrentUserLoading && currentUserData?.role === 'General Member';

  useEffect(() => {
    if (!isCurrentUserLoading && isGeneralMember) {
      router.push('/dashboard');
    }
  }, [isCurrentUserLoading, isGeneralMember, router]);

  const isLoading = isAuthLoading || isCurrentUserLoading;

  if (isLoading || isGeneralMember) {
    return (
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Reports
          </h1>
        </div>
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
      </div>
    );
  }

  if (!canViewPage) {
    return (
       <Card className="border-destructive">
          <CardHeader className="flex flex-row items-center gap-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You do not have permission to view this page. Redirecting to dashboard...</p>
          </CardContent>
        </Card>
    )
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Reports
        </h1>
        <Button>
            <Download className="mr-2 h-4 w-4" />
            Export All Data
          </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Reporting features are coming soon. You'll be able to generate detailed reports on member attendance and engagement.</p>
        </CardContent>
      </Card>
    </div>
  );
}
