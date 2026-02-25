'use client';

import { useParams, useRouter } from 'next/navigation';
import { useFirestore, useDoc, useCollection, useUser } from '@/firebase';
import { doc, setDoc, deleteDoc, collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, UserCheck, UserX } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface User {
  id: string;
  uid: string;
  name: string;
  email: string;
  department: string;
  batch: string;
}

interface AttendanceRecord {
  id: string;
  userId: string;
  sessionId: string;
}

export default function AdminSessionDetailPage() {
  const { sessionId } = useParams();
  const firestore = useFirestore();
  const { user: currentUser } = useUser();
  const router = useRouter();

  const { data: userData, isLoading: isUserRoleLoading } = useDoc(() => {
    if (!currentUser || !firestore) return null;
    return doc(firestore, 'users', currentUser.uid);
  }, [currentUser, firestore]);

  useEffect(() => {
    if (!isUserRoleLoading && userData && userData.role !== 'Admin' && currentUser?.email !== 'fh7614@gmail.com') {
      router.push('/dashboard');
    }
  }, [userData, isUserRoleLoading, router, currentUser]);

  const { data: session, isLoading: isSessionLoading } = useDoc(() => {
    if (!firestore || !sessionId) return null;
    return doc(firestore, 'attendanceSessions', sessionId as string);
  }, [firestore, sessionId]);

  const { data: users, isLoading: isUsersLoading } = useCollection<User>(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: records, isLoading: isRecordsLoading } = useCollection<AttendanceRecord>(() => {
    if (!firestore || !sessionId) return null;
    return collection(firestore, 'attendanceSessions', sessionId as string, 'attendanceRecords');
  }, [firestore, sessionId]);

  const toggleAttendance = (userId: string, isPresent: boolean) => {
    if (!firestore || !sessionId) return;

    const recordRef = doc(firestore, 'attendanceSessions', sessionId as string, 'attendanceRecords', userId);

    if (isPresent) {
      const recordData = {
        userId,
        sessionId: sessionId as string,
        timestamp: new Date().toISOString(),
      };
      setDoc(recordRef, recordData).catch(err => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: recordRef.path,
          operation: 'create',
          requestResourceData: recordData
        }));
      });
      toast({ title: "উপস্থিতি নিশ্চিত", description: "সদস্যকে উপস্থিত হিসেবে চিহ্নিত করা হয়েছে।" });
    } else {
      deleteDoc(recordRef).catch(err => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: recordRef.path,
          operation: 'delete'
        }));
      });
      toast({ title: "উপস্থিতি বাতিল", description: "সদস্যের উপস্থিতি সরিয়ে ফেলা হয়েছে।" });
    }
  };

  if (isSessionLoading || isUsersLoading || isRecordsLoading || isUserRoleLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardHeader><Skeleton className="h-8 w-64" /></CardHeader>
          <CardContent><Skeleton className="h-64 w-full" /></CardContent>
        </Card>
      </div>
    );
  }

  if (!session) return <div className="text-center py-12">সেশনটি পাওয়া যায়নি।</div>;

  const presentUserIds = new Set(records?.map(r => r.userId) || []);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold">{session.title}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>সদস্য তালিকা ও উপস্থিতি</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>নাম ও আইডি</TableHead>
                  <TableHead className="hidden sm:table-cell">বিভাগ ও সেশন</TableHead>
                  <TableHead className="text-right">উপস্থিতি</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((u) => {
                  const isPresent = presentUserIds.has(u.uid);
                  return (
                    <TableRow key={u.uid}>
                      <TableCell>
                        <div className="font-medium text-sm sm:text-base">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.id}</div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="text-sm">{u.department}</div>
                        <div className="text-xs text-muted-foreground">{u.batch}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant={isPresent ? "default" : "outline"} 
                          size="sm"
                          onClick={() => toggleAttendance(u.uid, !isPresent)}
                          className="gap-2 text-xs sm:text-sm"
                        >
                          {isPresent ? (
                            <><UserCheck className="h-3 w-3 sm:h-4 sm:w-4" /> উপস্থিত</>
                          ) : (
                            <><UserX className="h-3 w-3 sm:h-4 sm:w-4" /> অনুপস্থিত</>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}