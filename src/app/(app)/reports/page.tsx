'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, AlertTriangle } from 'lucide-react';
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReportsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);

  const isGeneralMember = userData?.role === 'General Member';

  useEffect(() => {
    if (!isUserLoading && isGeneralMember) {
      router.push('/dashboard');
    }
  }, [userData, isUserLoading, isGeneralMember, router]);

  if (isUserLoading || isGeneralMember) {
    return (
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
    );
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
