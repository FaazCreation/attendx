
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
import { useState, useMemo, useEffect } from 'react';
import {
  PlusCircle,
  Users,
  Calendar,
  BarChart,
  UserCheck,
  ListFilter,
} from 'lucide-react';
import { useFirestore, useCollection, useUser, useDoc } from '@/firebase';
import { collection, collectionGroup, doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


interface User {
  id: string;
  name: string;
  email: string;
  role: string;
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
    }, [sessions, attendanceRecords, totalSessions]);


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


function AdminDashboardPage() {
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
        <div className="flex items-center gap-2">
            <Link href="/sessions">
                <Button variant="outline">
                    <ListFilter className="mr-2 h-4 w-4" />
                    সেশন তালিকা
                </Button>
            </Link>
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
                <CreateSessionForm
                onSessionCreated={() => setIsDialogOpen(false)}
                />
            </DialogContent>
            </Dialog>
        </div>
      </div>

      <StatsCards firestore={firestore} />
      
      <div className="grid gap-4 lg:grid-cols-2">
         <Card>
            <CardHeader>
                <CardTitle>সিস্টেম স্ট্যাটাস</CardTitle>
                <CardDescription>আপনার অ্যাপ্লিকেশনের সার্বিক অবস্থা।</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="text-center text-muted-foreground">
                    <UserCheck className="mx-auto h-12 w-12 text-primary/50" />
                    <p className="mt-4">সিস্টেম সম্পূর্ণরূপে কার্যকর।</p>
                    <p className="text-sm">সেশন ম্যানেজ করতে "সেশন তালিকা" বাটনে ক্লিক করুন।</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}


export default function ProtectedAdminDashboardPage() {
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
        return <AdminDashboardPage />;
    }

    return null;
}
