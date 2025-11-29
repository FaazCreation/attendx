'use client';

import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { MembersTable } from '@/components/members/members-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

// This new child component will only be rendered once the parent has confirmed
// that the current user has the correct permissions. This prevents the
// protected query from running prematurely.
function MembersList() {
  const firestore = useFirestore();
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

  // Handle the case where the user has permission but there's no data.
  if (!users) {
    return <p>No members found or there was an issue loading them.</p>;
  }

  return <MembersTable data={users} />;
}


// This is the main page component. Its only job is to check permissions.
export default function MembersPage() {
  const firestore = useFirestore();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const router = useRouter();

  // We fetch the current user's profile to check their role.
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: currentUserData, isLoading: isCurrentUserLoading } = useDoc(userDocRef);
  
  // The primary loading state depends on both authentication and the user profile fetch.
  const isLoading = isAuthLoading || isCurrentUserLoading;
  
  // Memoize the permission check result.
  const hasPermission = useMemo(() => {
    if (!currentUserData) return false;
    // Only Admin and Executive Member roles are allowed to see this page.
    return ['Admin', 'Executive Member'].includes(currentUserData.role);
  }, [currentUserData]);
  
  // This effect will run if the user's role is determined to be 'General Member'.
  useEffect(() => {
    if (!isLoading && currentUserData && currentUserData.role === 'General Member') {
      // Redirect unauthorized users to the dashboard to prevent access.
      router.push('/dashboard');
    }
  }, [isLoading, currentUserData, router]);

  // Show a loading skeleton while checking auth and user profile.
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
  
  // If loading is done and the user still doesn't have permission, show a clear "Access Denied" message.
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

  // Only if all checks pass, render the main page content, including the protected MembersList.
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Club Members
        </h1>
      </div>
      
      {/* The child component with the protected query is now only rendered here. */}
      <MembersList />
    </div>
  );
}
