'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, CalendarClock, Copyright, User, Users } from 'lucide-react';
import Link from 'next/link';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';
import { AttendXIcon } from '@/components/icons';

const allMenuItems = [
  { href: '/profile', label: 'আমার প্রোফাইল', icon: User, description: "আপনার ব্যক্তিগত বিবরণ দেখুন এবং সম্পাদনা করুন", roles: ['Admin', 'Executive Member', 'General Member'] },
  { href: '/sessions', label: 'সেশন', icon: CalendarClock, description: "অ্যাটেনডেন্স সেশন দেখুন এবং পরিচালনা করুন", roles: ['Admin', 'Executive Member', 'General Member'] },
  { href: '/members', label: 'সদস্য', icon: Users, description: "ক্লাবের সদস্যদের ব্রাউজ ও পরিচালনা করুন", roles: ['Admin', 'Executive Member'] },
  { href: '/reports', label: 'রিপোর্ট', icon: BarChart3, description: "অ্যাটেনডেন্স ডেটা তৈরি এবং এক্সপোর্ট করুন", roles: ['Admin', 'Executive Member'] },
];

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userData, isLoading: isProfileLoading } = useDoc(userDocRef);

  const menuItems = useMemo(() => {
    if (!userData) return [];
    return allMenuItems.filter(item => item.roles.includes(userData.role));
  }, [userData]);

  if (isProfileLoading) {
    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between space-y-2">
                <Skeleton className="h-8 w-64" />
            </div>
            <Skeleton className="h-6 w-96" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
        </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 space-y-6">
      <div className="flex items-center justify-center text-center sm:justify-start sm:text-left">
        <div className="flex items-center gap-3">
          <AttendXIcon className="h-8 w-8 text-primary" />
          <div className="text-left">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
              AttendX
            </h1>
            <p className="text-[6px] sm:text-xs text-muted-foreground">Attendance Management, Simplified.</p>
          </div>
        </div>
      </div>
      <p className="text-sm md:text-base text-muted-foreground text-center sm:text-left">শুরু করতে নিচের একটি বিকল্প নির্বাচন করুন।</p>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {menuItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <Card className="hover:bg-muted/50 hover:border-primary/50 transition-all transform hover:-translate-y-1 h-full flex flex-col">
              <CardHeader className="flex-1">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-md">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg md:text-xl font-semibold">{item.label}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardDescription className="px-6 pb-4 text-xs md:text-sm">
                {item.description}
              </CardDescription>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-auto pt-8 text-center text-sm text-muted-foreground">
        <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5">
                <Copyright className="h-3.5 w-3.5" />
                <span>ক্লাব অরবিটের একটি পণ্য।</span>
            </div>
            <span>ফরহাদ হোসেন দ্বারা তৈরি।</span>
        </div>
      </div>
    </div>
  );
}
