
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Calendar, Users } from 'lucide-react';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

function AdminStats() {
    const firestore = useFirestore();

    const { data: users, isLoading: usersLoading } = useCollection(
        () => firestore ? collection(firestore, 'users') : null,
        [firestore]
    );

    const { data: sessions, isLoading: sessionsLoading } = useCollection(
        () => firestore ? collection(firestore, 'attendanceSessions') : null,
        [firestore]
    );


    if (usersLoading || sessionsLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
        );
    }

    const totalMembers = users?.length || 0;
    const totalSessions = sessions?.length || 0;

    // This is a placeholder for total attendance. A more complex query would be needed for a real number.
    const totalAttendance = 'N/A';


    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">মোট সদস্য</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalMembers}</div>
                    <p className="text-xs text-muted-foreground">সক্রিয় ক্লাব সদস্য</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">মোট সেশন</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalSessions}</div>
                    <p className="text-xs text-muted-foreground">এই বছর পরিচালিত</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">মোট উপস্থিতি</CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalAttendance}</div>
                    <p className="text-xs text-muted-foreground">সমস্ত সেশন জুড়ে</p>
                </CardContent>
            </Card>
        </div>
    );
}

export default function OrbitPanelDashboardPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          অরবিট ড্যাশবোর্ড
        </h1>
      </div>
      <p className="text-sm text-muted-foreground">
        স্বাগতম! এখান থেকে আপনি ক্লাবের সদস্য, সেশন এবং রিপোর্ট পরিচালনা করতে পারবেন।
      </p>
      <AdminStats />
    </div>
  );
}
