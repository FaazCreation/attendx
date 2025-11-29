'use client';

import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { MembersTable } from '@/components/members/members-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

// A separate component to handle fetching and displaying the members list.
// This component is only rendered if the user has the correct permissions.
function MembersList() {
  const firestore = useFirestore();

  // This query will now only run inside a component that is already protected by a role check.
  const usersCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: users, isLoading: areMembersLoading } = useCollection(usersCollection);
  
  if (areMembersLoading) {
      return (
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
      )
  }

  return users ? <MembersTable data={users} /> : <p>No members found.</p>;
}


export default function MembersPage() {
  const firestore = useFirestore();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const router = useRouter();

  // Get the current user's document to check their role.
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: currentUserData, isLoading: isCurrentUserLoading } = useDoc(userDocRef);

  const hasPermission = useMemo(() => {
    if (!currentUserData) return false;
    return ['Admin', 'Executive Member'].includes(currentUserData.role);
  }, [currentUserData]);
  
  // The primary loading state now depends only on auth and the current user's profile.
  const isLoading = isAuthLoading || isCurrentUserLoading;
  
  // Redirect if the user is confirmed to be a General Member.
  useEffect(() => {
    if (!isLoading && currentUserData && currentUserData.role === 'General Member') {
      router.push('/dashboard');
    }
  }, [isLoading, currentUserData, router]);


  if (isLoading) {
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
  
  // If loading is finished and the user doesn't have permission, show an access denied message.
  if (!hasPermission) {
    return (
       <Card className="border-destructive">
          <CardHeader className="flex flex-row items-center gap-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You do not have permission to view this page. You may be redirected.</p>
          </CardContent>
        </Card>
    )
  }

  // Only if loading is complete AND the user has permission, render the page content.
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Club Members
        </h1>
      </div>
      
      {/* The component that makes the protected query is only rendered here. */}
      <MembersList />
    </div>
  );
}
