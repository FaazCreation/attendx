'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { MembersTable } from '@/components/members/members-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

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

  // Ensure role is a string and provide a default if it's missing
  const typedUsers = users.map(u => ({ ...u, role: u.role || 'General Member' }));

  return <MembersTable data={typedUsers} />;
}

export default function MembersPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          ক্লাবের সদস্য
        </h1>
      </div>
      
      <MembersList />
    </div>
  );
}
