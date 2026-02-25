
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useFirestore, useDoc, useCollection, useUser } from '@/firebase';
import { doc, setDoc, deleteDoc, collection, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, UserCheck, UserX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';

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

  // 1. Check if Admin
  const { data: userData, isLoading: isUserRoleLoading } = useDoc(() => {
    if (!currentUser || !firestore) return null;
    return doc(firestore, 'users', currentUser.uid);
  }, [currentUser, firestore]);

  useEffect(() => {
    if (!isUserRoleLoading && userData && userData.role !== 'Admin') {
      router.push('/dashboard');
    }
  }, [userData, isUserRoleLoading, router]);

  // 2. Fetch Session
  const { data: session, isLoading: isSessionLoading } = useDoc(() => {
    if (!firestore || !sessionId) return null;
    return doc(firestore, 'attendanceSessions', sessionId as string);
  }, [firestore, sessionId]);

  // 3. Fetch All Users
  const { data: users, isLoading: isUsersLoading } = useCollection<User>(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  // 4. Fetch Attendance Records for this session
  const { data: records, isLoading: isRecordsLoading } = useCollection<AttendanceRecord>(() => {
    if (!firestore || !sessionId) return null;
    return collection(firestore, 'attendanceSessions', sessionId as string, 'attendanceRecords');
  }, [firestore, sessionId]);

  const toggleAttendance = async (userId: string, isPresent: boolean) => {
    if (!firestore || !sessionId) return;

    const recordRef = doc(firestore, 'attendanceSessions', sessionId as string, 'attendanceRecords', userId);

    try {
      if (isPresent) {
        // Mark as Present (create record)
        await setDoc(recordRef, {
          userId,
          sessionId: sessionId as string,
          timestamp: new Date().toISOString(),
        });
        toast({ title: "উপস্থিতি নিশ্চিত", description: "সদস্যকে উপস্থিত হিসেবে চিহ্নিত করা হয়েছে।" });
      } else {
        // Mark as Absent (delete record)
        await deleteDoc(recordRef);
        toast({ title: "উপস্থিতি বাতিল", description: "সদস্যের উপস্থিতি সরিয়ে ফেলা হয়েছে।" });
      }
    } catch (error) {
      console.error("Error toggling attendance:", error);
      toast({ variant: "destructive", title: "ত্রুটি", description: "উপস্থিতি আপডেট করা সম্ভব হয়নি।" });
    }
  };

  if (isSessionLoading || isUsersLoading || isRecordsLoading || isUserRoleLoading) {
    return (
      <div className="space-y-6">
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{session.title} - উপস্থিতি পরিচালনা</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>সদস্য তালিকা</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>নাম ও আইডি</TableHead>
                <TableHead>বিভাগ ও সেশন</TableHead>
                <TableHead className="text-right">উপস্থিতি</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((u) => {
                const isPresent = presentUserIds.has(u.uid);
                return (
                  <TableRow key={u.uid}>
                    <TableCell>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-muted-foreground">{u.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{u.department}</div>
                      <div className="text-xs text-muted-foreground">{u.batch}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant={isPresent ? "default" : "outline"} 
                        size="sm"
                        onClick={() => toggleAttendance(u.uid, !isPresent)}
                        className="gap-2"
                      >
                        {isPresent ? (
                          <><UserCheck className="h-4 w-4" /> উপস্থিত</>
                        ) : (
                          <><UserX className="h-4 w-4" /> অনুপস্থিত</>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
