'use client';

import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { MembersTable } from '@/components/members/members-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function MembersPage() {
  const firestore = useFirestore();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const router = useRouter();

  // Step 1: Get the current user's document to check their role.
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: currentUserData, isLoading: isCurrentUserLoading } = useDoc(userDocRef);
  
  // Step 2: Determine if the user has permission to fetch the members list.
  const canViewMembers = useMemo(() => {
    if (!currentUserData) return false;
    return ['Admin', 'Executive Member'].includes(currentUserData.role);
  }, [currentUserData]);

  // Immediately determine if the user is a General Member once their data loads.
  const isGeneralMember = !isCurrentUserLoading && currentUserData?.role === 'General Member';

  // Step 3: If the user is a General Member, redirect them immediately after checking.
  useEffect(() => {
    if (isGeneralMember) {
      router.push('/dashboard');
    }
  }, [isGeneralMember, router]);

  // Step 4: Only create the collection query if the user has permission.
  const usersCollection = useMemoFirebase(() => {
    // Only query if Firestore is ready AND the user is confirmed to have viewing permissions.
    if (!firestore || !canViewMembers) return null; 
    return collection(firestore, 'users');
  }, [firestore, canViewMembers]);

  // The useCollection hook will only run if usersCollection is not null.
  const { data: users, isLoading: areMembersLoading } = useCollection(usersCollection);

  const isLoading = isAuthLoading || isCurrentUserLoading || (canViewMembers && areMembersLoading);
  
  // Show a loading state until all checks are complete OR if the user is a general member (and about to be redirected).
  if (isLoading || isGeneralMember) {
     return (
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between space-y-2">
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              Club Members
            </h1>
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      );
  }
  
  // This state is reached if the user's role is not one that can view members,
  // but before the redirect effect kicks in. Show an access denied message.
  if (!canViewMembers) {
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

  // Finally, render the table if loading is complete and permissions are granted.
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
