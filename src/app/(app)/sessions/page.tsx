'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
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
import { useState } from 'react';

export default function SessionsPage() {
  const firestore = useFirestore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const sessionsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'attendanceSessions');
  }, [firestore]);

  const { data: sessions, isLoading } = useCollection(sessionsCollection);

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Attendance Sessions
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Session</DialogTitle>
              <DialogDescription>
                Fill out the details for the new attendance session.
              </DialogDescription>
            </DialogHeader>
            <CreateSessionForm onSessionCreated={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {sessions && (
        <div className="space-y-4">
          {/* TODO: Implement session list component */}
          <p>{sessions.length} session(s) found.</p>
        </div>
      )}
      {!sessions && !isLoading && <p>No sessions found.</p>}
    </div>
  );
}
