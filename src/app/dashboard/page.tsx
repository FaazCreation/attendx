'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, CalendarClock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';
import { AttendXIcon } from '@/components/icons';

const allMenuItems = [
  { href: '/profile', label: 'আমার প্রোফাইল', icon: User, description: "আপনার প্রোফাইলের বিবরণ দেখুন ও পরিচালনা করুন", roles: ['Admin', 'Executive Member', 'General Member'] },
  { href: '/sessions', label: 'সেশন', icon: CalendarClock, description: "অ্যাটেনডেন্স সেশন দেখুন এবং পরিচালনা করুন", roles: ['Admin', 'Executive Member', 'General Member'] },
  { href: '/admin', label: 'অ্যাডমিন প্যানেল', icon: ShieldCheck, description: "সদস্য, রিপোর্ট এবং অন্যান্য কার্যক্রম পরিচালনা করুন", roles: ['Admin', 'Executive Member'] },
];

const getMenuItemDescription = (description: string, role: string) => {
  if (role === 'General Member') {
    return description.replace(/ (ও|এবং) পরিচালনা করুন/g, ' দেখুন');
  }
  return description;
}

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
            </div>
        </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 space-y-6">
      <div className="flex items-center justify-center text-center sm:justify-start sm:text-left">
        <div className="flex items-center gap-3">
          <AttendXIcon className="h-8 w-8 text-primary" />
          <div className="text-left font-headline">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              AttendX
            </h1>
            <p className="text-[6px] sm:text-xs text-muted-foreground">Attendance Management, Simplified.</p>
          </div>
        </div>
      </div>
      <p className="text-sm md:text-base text-muted-foreground text-center sm:text-left">তেজগাঁও কলেজ ফটোগ্রাফি ক্লাব</p>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <Card className="hover:bg-muted/50 hover:border-primary/50 transition-all transform hover:-translate-y-1 h-full flex flex-col">
              <CardHeader className="flex-1 p-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-md">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <CardTitle className="text-xl md:text-2xl font-semibold">{item.label}</CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      {getMenuItemDescription(item.description, userData.role)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
