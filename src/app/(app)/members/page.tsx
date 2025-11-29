'use client';

import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { MembersTable } from '@/components/members/members-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

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

  if (!users) {
    return <p>কোনো সদস্য খুঁজে পাওয়া যায়নি অথবা লোড করতে সমস্যা হয়েছে।</p>;
  }

  return <MembersTable data={users} />;
}

export default function MembersPage() {
  const firestore = useFirestore();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: currentUserData, isLoading: isCurrentUserLoading } = useDoc(userDocRef);
  
  const isLoading = isAuthLoading || isCurrentUserLoading;
  
  const hasPermission = useMemo(() => {
    if (!currentUserData) return false;
    return ['Admin', 'Executive Member'].includes(currentUserData.role);
  }, [currentUserData]);
  
  useEffect(() => {
    if (!isLoading && currentUserData && !['Admin', 'Executive Member'].includes(currentUserData.role)) {
      router.push('/dashboard');
    }
  }, [isLoading, currentUserData, router]);

  if (isLoading) {
     return (
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-headline">
              ক্লাবের সদস্য
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
  
  if (!hasPermission) {
    return (
       <Card className="border-destructive">
          <CardHeader className="flex flex-row items-center gap-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <CardTitle>প্রবেশাধিকার নেই</CardTitle>
          </CardHeader>
          <CardContent>
            <p>এই পৃষ্ঠাটি দেখার জন্য আপনার অনুমতি নেই। আপনাকে রিডাইরেক্ট করা হতে পারে।</p>
          </CardContent>
        </Card>
    )
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-headline">
          ক্লাবের সদস্য
        </h1>
      </div>
      
      <MembersList />
    </div>
  );
}
