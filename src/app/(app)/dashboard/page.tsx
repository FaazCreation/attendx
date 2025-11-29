'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, CalendarClock, User, Users } from 'lucide-react';
import Link from 'next/link';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';
import { AttendXIcon } from '@/components/icons';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { AttendanceChart } from '@/components/dashboard/attendance-chart';

const allMenuItems = [
  { href: '/profile', label: 'My Profile', icon: User, description: "View and edit your personal details", roles: ['Admin', 'Executive Member', 'General Member'] },
  { href: '/sessions', label: 'Sessions', icon: CalendarClock, description: "View and manage attendance sessions", roles: ['Admin', 'Executive Member', 'General Member'] },
  { href: '/members', label: 'Members', icon: Users, description: "Browse and manage club members", roles: ['Admin'] },
  { href: '/reports', label: 'Reports', icon: BarChart3, description: "Generate and export attendance data", roles: ['Admin', 'Executive Member'] },
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
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-3">
          <AttendXIcon className="h-8 w-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
            AttendX
          </h1>
        </div>
      </div>
      <p className="text-sm md:text-base text-muted-foreground">Select an option below to get started.</p>
      
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

       <div className="space-y-4 mt-6">
          <StatsCards />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="lg:col-span-4">
              <AttendanceChart />
            </div>
            <div className="lg:col-span-3">
              <RecentActivity />
            </div>
          </div>
        </div>

      <div className="mt-auto pt-8 text-center text-sm text-muted-foreground">
        A product of Club Orbit. Developed by Forhad Hossain.
      </div>
    </div>
  );
}
