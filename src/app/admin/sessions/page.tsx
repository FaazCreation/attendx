
'use client';

import { useFirestore, useCollection, useUser, useDoc } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle, CalendarCog } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreateSessionForm } from '@/components/sessions/create-session-form';
import { useState, useEffect } from 'react';
import { SessionCard } from '@/components/sessions/session-card';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

function AdminSessionsPage() {
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

  return (
    <>
      <Head>
        <title>সেশন পরিচালনা | AttendX</title>
      </Head>
      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className='flex items-center gap-3'>
                <CalendarCog className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        সেশন পরিচালনা
                    </h1>
                    <p className="text-muted-foreground">নতুন সেশন তৈরি করুন এবং সকল সেশন দেখুন।</p>
                </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  নতুন সেশন তৈরি করুন
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
        </div>
        
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        )}

        {sessions && sessions.length > 0 && userData && (
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
        
        {(!sessions || sessions.length === 0) && !isLoading && (
            <div className="flex flex-col items-center justify-center text-center py-12">
                <p className="text-lg text-muted-foreground">কোনো সেশন পাওয়া যায়নি।</p>
                <p className="text-sm text-muted-foreground mt-2">একটি নতুন সেশন তৈরি করে শুরু করুন।</p>
          </div>
        )}
      </div>
    </>
  );
}


export default function ProtectedAdminSessionsPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

    const { data: userData, isLoading: isUserRoleLoading } = useDoc(() => {
        if (!user || !firestore) return null;
        return doc(firestore, 'users', user.uid);
    }, [user, firestore]);

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
            return;
        }
        if (!isUserRoleLoading && user && userData?.role !== 'Admin') {
            router.push('/dashboard');
            return;
        }
    }, [isUserLoading, user, isUserRoleLoading, userData, router]);


    if (isUserLoading || isUserRoleLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            </div>
        )
    }

    if (userData?.role === 'Admin') {
        return <AdminSessionsPage />;
    }

    return null;
}
