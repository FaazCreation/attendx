'use client';

import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { MembersTable } from '@/components/members/members-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function MembersPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);
  
  const usersCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: users, isLoading: areMembersLoading } = useCollection(usersCollection);

  const isLoading = isUserLoading || areMembersLoading;
  const isGeneralMember = userData?.role === 'General Member';

  useEffect(() => {
    if (!isUserLoading && isGeneralMember) {
      router.push('/dashboard');
    }
  }, [userData, isUserLoading, isGeneralMember, router]);

  if (isLoading || isGeneralMember) {
     return (
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between space-y-2">
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              Club Members
            </h1>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      );
  }

  if (isGeneralMember) {
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
          Club Members
        </h1>
      </div>
      
      {users && <MembersTable data={users} />}
    </div>
  );
}
