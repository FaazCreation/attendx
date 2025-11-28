'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { MembersTable } from '@/components/members/members-table';
import { Skeleton } from '@/components/ui/skeleton';

export default function MembersPage() {
  const firestore = useFirestore();
  
  const usersCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: users, isLoading } = useCollection(usersCollection);

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Club Members
        </h1>
      </div>
      
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {users && <MembersTable data={users} />}
    </div>
  );
}
