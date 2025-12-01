
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { User, CalendarClock, FileText, BarChart3, BookUser } from 'lucide-react';
import Link from 'next/link';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';
import { AttendXIcon } from '@/components/icons';

const allMenuItems = [
  { href: '/sessions', label: 'সেশন', icon: CalendarClock, description: "অ্যাটেনডেন্স সেশন দেখুন" },
  { href: '/instructions', label: 'নির্দেশনাবলি', icon: BookUser, description: "সিস্টেম এবং ব্যবহারবিধি সম্পর্কে জানুন" },
  { href: '/constitution', label: 'ক্লাব গঠনতন্ত্র', icon: FileText, description: "ক্লাবের গঠনতন্ত্র ও নিয়মাবলী সম্পর্কে জানুন" },
];

const adminMenuItems = [
    { href: '/sessions', label: 'সেশন পরিচালনা', icon: CalendarClock, description: "নতুন সেশন তৈরি ও পরিচালনা করুন" },
    { href: '/orbitpanel/reports', label: 'রিপোর্ট', icon: BarChart3, description: "সম্পূর্ণ অ্যাটেনডেন্স রিপোর্ট দেখুন" },
];

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const { data: userData, isLoading: isProfileLoading } = useDoc(
    () => {
      if (!firestore || !user) return null;
      return doc(firestore, 'users', user.uid);
    },
    [firestore, user]
  );
  
  const menuItems = useMemo(() => {
    if (!user || !userData) return [];

    if (userData.role === 'Admin') {
      return adminMenuItems;
    }
    
    return allMenuItems;
    
  }, [userData, user]);

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
  
  if (!userData) {
      return null;
  }
  
  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex-grow space-y-6">
        <div className="flex items-center justify-center text-center sm:justify-start sm:text-left">
          <div className="flex items-center gap-3">
            <AttendXIcon className="h-8 w-8 text-primary" />
            <div className="text-left font-headline flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-none">
                AttendX
              </h1>
              <p className="text-[6px] sm:text-xs text-muted-foreground leading-tight">Attendance Management, Simplified.</p>
            </div>
          </div>
        </div>
        <p className="text-lg md:text-xl text-muted-foreground text-center sm:text-left">তেজগাঁও কলেজ ফটোগ্রাফি ক্লাব</p>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => (
            <Link href={item.href} key={item.href}>
              <Card className="hover:bg-muted/50 hover:border-primary/50 transition-all transform hover:-translate-y-1 h-full flex flex-col">
                <CardHeader className="flex-1 p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-md">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl md:text-2xl font-semibold">{item.label}</CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        {item.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
