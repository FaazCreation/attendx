'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query, where, getDocs, collectionGroup } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Award, BarChart, Calendar, CheckSquare } from 'lucide-react';
import { useMemo } from 'react';

const getRoleInBangla = (role: string) => {
    switch(role) {
        case 'Admin': return 'অ্যাডমিন';
        case 'Executive Member': return 'কার্যনির্বাহী সদস্য';
        case 'General Member': return 'সাধারণ সদস্য';
        default: return role;
    }
}

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userData, isLoading: isProfileLoading } = useDoc(userDocRef);

  const sessionsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'attendanceSessions');
  }, [firestore]);
  const { data: sessions, isLoading: areSessionsLoading } = useCollection(sessionsCollection);

  const userAttendanceQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(collectionGroup(firestore, 'attendanceRecords'), where('userId', '==', user.uid));
  }, [firestore, user?.uid]);

  const { data: attendanceRecords, isLoading: isAttendanceLoading } = useCollection(userAttendanceQuery);

  const isLoading = isUserLoading || isProfileLoading || areSessionsLoading || isAttendanceLoading;

  const initials = userData?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || user?.email?.charAt(0).toUpperCase();

  const attendedCount = attendanceRecords?.length || 0;
  const totalSessions = sessions?.length || 0;
  const attendanceRate = totalSessions > 0 ? Math.round((attendedCount / totalSessions) * 100) : 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
         <div className="flex items-center justify-between space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-headline">আমার প্রোফাইল</h1>
        </div>
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2 text-center md:text-left">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    );
  }
  
  if (!userData) {
      return <div>ব্যবহারকারীর প্রোফাইল লোড করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।</div>
  }

  return (
    <div className="flex-1 space-y-6">
       <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-headline">
          আমার প্রোফাইল
        </h1>
      </div>
      <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6">
        <Avatar className="h-24 w-24 border-2 border-primary">
          <AvatarImage src={userData.photoURL || user?.photoURL || ''} alt={userData.name || ''} />
          <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
        </Avatar>
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-3xl font-bold font-headline">{userData.name}</h2>
          <p className="text-md text-muted-foreground">{userData.email}</p>
          <p className="text-sm text-muted-foreground">{userData.department} - {userData.batch}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ভূমিকা</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{getRoleInBangla(userData.role)}</div>
                <p className="text-xs text-muted-foreground">ক্লাবে আপনার বর্তমান ভূমিকা</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">উপস্থিত সেশন</CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{attendedCount}</div>
                <p className="text-xs text-muted-foreground">মোট {totalSessions}টি সেশনের মধ্যে</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">অংশগ্রহণের স্কোর</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{userData.eventParticipationScore || 0}</div>
                <p className="text-xs text-muted-foreground">ইভেন্ট এবং কর্মশালা থেকে পয়েন্ট</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">উপস্থিতির হার</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold mb-2">{attendanceRate}%</div>
                <Progress value={attendanceRate} className="h-2" />
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
