
'use client';

import { useFirestore, useCollection, useUser, useDoc } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreateSessionForm } from '@/components/sessions/create-session-form';
import { useMemo, useState } from 'react';
import { SessionCard } from '@/components/sessions/session-card';

export default function SessionsPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
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

  const canCreateSession = useMemo(() => {
    if (!userData) return false;
    return userData.role === 'Admin';
  }, [userData]);


  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          অ্যাটেনডেন্স সেশন
        </h1>
        {canCreateSession && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                সেশন তৈরি করুন
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>নতুন সেশন তৈরি করুন</DialogTitle>
                <DialogDescription>
                  নতুন অ্যাটেনডেন্স সেশনের জন্য বিবরণ পূরণ করুন।
                </DialogDescription>
              </DialogHeader>
              <CreateSessionForm onSessionCreated={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      )}

      {sessions && userData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sessions.map((session: any) => (
            <SessionCard 
              key={session.id} 
              session={session} 
              userRole={userData.role}
            />
          ))}
        </div>
      )}
      {!sessions && !isLoading && <p>কোনো সেশন পাওয়া যায়নি।</p>}
    </div>
  );
}
