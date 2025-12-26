'use client';

import { useFirestore, useCollection, useUser, useDoc } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';
import { SessionCard } from '@/components/sessions/session-card';
import Head from 'next/head';

export default function SessionsPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  
  const { data: sessions, isLoading: areSessionsLoading } = useCollection(
    () => {
      if (!firestore) return null;
      return collection(firestore, 'attendanceSessions');
    },
    [firestore]
  );

  const { data: userData, isLoading: isUserLoading } = useDoc(
    () => {
      if (!firestore || !user) return null;
      return doc(firestore, 'users', user.uid);
    },
    [firestore, user]
  );

  const isLoading = areSessionsLoading || isUserLoading;

  const sortedSessions = useMemo(() => {
    if (!sessions) return [];
    return [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sessions]);


  return (
    <>
      <Head>
        <title>অ্যাটেনডেন্স সেশন | AttendX</title>
      </Head>
      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            অ্যাটেনডেন্স সেশন
          </h1>
        </div>
        
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        )}

        {sortedSessions && sortedSessions.length > 0 && userData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedSessions.map((session: any) => (
              <SessionCard 
                key={session.id} 
                session={session} 
                userRole={userData.role}
              />
            ))}
          </div>
        )}
        
        {(!sortedSessions || sortedSessions.length === 0) && !isLoading && (
            <div className="flex flex-col items-center justify-center text-center py-12">
                <p className="text-lg text-muted-foreground">কোনো সেশন পাওয়া যায়নি।</p>
                {userData?.role === 'Admin' && <p className="text-sm text-muted-foreground mt-2">অ্যাডমিন প্যানেল থেকে একটি নতুন সেশন তৈরি করুন।</p>}
          </div>
        )}
      </div>
    </>
  );
}
