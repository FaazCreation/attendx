
'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { CreateSessionForm } from '@/components/sessions/create-session-form';
import { useState, useMemo } from 'react';
import {
  PlusCircle,
  Users,
  Calendar,
  BarChart,
  UserCheck,
} from 'lucide-react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, collectionGroup, doc, getCountFromServer } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { bn } from 'date-fns/locale';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

interface Session {
    id: string;
    title: string;
    date: string;
}

interface AttendanceRecord {
  sessionId: string;
  userId: string;
  timestamp: any;
  userName: string;
  userAvatar?: string;
  sessionTitle: string;
}


function StatsCards({ firestore } : { firestore: any }) {
    const { data: users, isLoading: usersLoading } = useCollection<User>(() => firestore ? collection(firestore, 'users') : null, [firestore]);
    const { data: sessions, isLoading: sessionsLoading } = useCollection(() => firestore ? collection(firestore, 'attendanceSessions') : null, [firestore]);
    const { data: attendanceRecords, isLoading: attendanceLoading } = useCollection(() => firestore ? collectionGroup(firestore, 'attendanceRecords') : null, [firestore]);

    const totalMembers = users?.length ?? 0;
    const totalSessions = sessions?.length ?? 0;
    
    const avgAttendance = useMemo(() => {
        if (!sessions || !attendanceRecords || sessions.length === 0) return 0;
        const totalAttendance = attendanceRecords.length;
        return Math.round(totalAttendance / totalSessions);
    }, [sessions, attendanceRecords]);


    const isLoading = usersLoading || sessionsLoading || attendanceLoading;

    if (isLoading) {
        return (
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
            </div>
        )
    }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">মোট সদস্য</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMembers}</div>
          <p className="text-xs text-muted-foreground">নিবন্ধিত ক্লাব সদস্য</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">মোট সেশন</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSessions}</div>
          <p className="text-xs text-muted-foreground">পরিচালিত মোট সেশন</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">গড় উপস্থিতি</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgAttendance} জন</div>
          <p className="text-xs text-muted-foreground">প্রতি সেশনে গড় উপস্থিতি</p>
        </CardContent>
      </Card>
    </div>
  );
}

function RecentActivity({ firestore } : { firestore: any }) {

  const { data: attendanceData, isLoading } = useCollection<AttendanceRecord>(() => {
    if (!firestore) return null;
    const recordsQuery = collectionGroup(firestore, 'attendanceRecords');
    return recordsQuery;
  }, [firestore]);

  const enrichedData = useMemo(() => {
    // This part would be more complex if we needed to fetch related docs
    // For now, let's assume we can pre-process this or it's simple enough
    return attendanceData
      ?.sort((a,b) => b.timestamp.seconds - a.timestamp.seconds)
      .slice(0, 5) ?? [];
  }, [attendanceData]);


  if (isLoading) {
      return (
          <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
          </div>
      );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>সাম্প্রতিক কার্যকলাপ</CardTitle>
        <CardDescription>সদস্যদের সর্বশেষ অ্যাটেনডেন্স।</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {enrichedData.length > 0 ? enrichedData.map((activity, index) => (
          <div className="flex items-center" key={index}>
            <Avatar className="h-9 w-9 border">
               <AvatarImage src={activity.userAvatar} alt="Avatar" />
               <AvatarFallback>{activity.userName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{activity.userName}</p>
              <p className="text-sm text-muted-foreground">
                "{activity.sessionTitle}" সেশনে যোগ দিয়েছেন
              </p>
            </div>
            <div className="ml-auto font-medium text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(activity.timestamp.seconds * 1000), { addSuffix: true, locale: bn })}
            </div>
          </div>
        )) : (
            <p className="text-sm text-muted-foreground text-center">কোনো সাম্প্রতিক কার্যকলাপ নেই।</p>
        )}
      </CardContent>
    </Card>
  )
}


export default function AdminDashboard() {
  const firestore = useFirestore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            অ্যাডমিন ড্যাশবোর্ড
          </h1>
          <p className="text-muted-foreground">
            সিস্টেম পরিচালনা এবং নিরীক্ষণ করুন।
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle />
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
            <CreateSessionForm
              onSessionCreated={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <StatsCards firestore={firestore} />
      
      <div className="grid gap-4 lg:grid-cols-2">
        <RecentActivity firestore={firestore} />
        {/* Here you could add another component, e.g., a chart */}
         <Card>
            <CardHeader>
                <CardTitle>সিস্টেম স্ট্যাটাস</CardTitle>
                <CardDescription>আপনার অ্যাপ্লিকেশনের সার্বিক অবস্থা।</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                    <UserCheck className="mx-auto h-12 w-12" />
                    <p className="mt-4">সিস্টেম সম্পূর্ণরূপে কার্যকর।</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
