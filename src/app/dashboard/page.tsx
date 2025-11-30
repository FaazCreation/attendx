'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { User, CalendarClock, ShieldCheck, Info } from 'lucide-react';
import Link from 'next/link';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo, useState } from 'react';
import { AttendXIcon } from '@/components/icons';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const allMenuItems = [
  { href: '/profile', label: 'আমার প্রোফাইল', icon: User, description: "আপনার প্রোফাইলের বিবরণ দেখুন ও পরিচালনা করুন", roles: ['Admin', 'Executive Member', 'General Member'] },
  { href: '/sessions', label: 'সেশন', icon: CalendarClock, description: "অ্যাটেনডেন্স সেশন দেখুন এবং পরিচালনা করুন", roles: ['Admin', 'Executive Member', 'General Member'] },
  { href: '/admin', label: 'অ্যাডমিন প্যানেল', icon: ShieldCheck, description: "সদস্য, রিপোর্ট এবং অন্যান্য কার্যক্রম পরিচালনা করুন", roles: ['Admin', 'Executive Member'] },
];

const getMenuItemDescription = (description: string, role: string) => {
  if (role === 'General Member') {
    return description.replace(/ (ও|এবং) পরিচালনা করুন/g, '');
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
                 <Skeleton className="h-32" />
            </div>
        </div>
    )
  }
  
  if (!userData) {
      return null;
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
                  <div>
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
        <Dialog>
          <DialogTrigger asChild>
            <Card className="hover:bg-muted/50 hover:border-primary/50 transition-all transform hover:-translate-y-1 h-full flex flex-col cursor-pointer">
              <CardHeader className="flex-1 p-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-md">
                    <Info className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl md:text-2xl font-semibold">কিছু কথা</CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      সিস্টেম এবং ব্যবহারবিধি সম্পর্কে জানুন
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold font-headline">AttendX সম্পর্কে কিছু কথা</DialogTitle>
              <DialogDescription>
                তেজগাঁও কলেজ ফটোগ্রাফি ক্লাবের জন্য একটি আধুনিক অ্যাটেনডেন্স ম্যানেজমেন্ট সিস্টেম।
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4 text-sm text-foreground">
              <p>
                AttendX হলো তেজগাঁও কলেজ ফটোগ্রাফি ক্লাবের সদস্যদের উপস্থিতি ব্যবস্থাপনার জন্য একটি ডিজিটাল সমাধান। এই সিস্টেমের মাধ্যমে ক্লাবের সকল মিটিং, কর্মশালা এবং ইভেন্টের অ্যাটেনডেন্স সহজে এবং নির্ভুলভাবে রেকর্ড করা যায়।
              </p>
              <div>
                <h3 className="font-semibold text-md mb-2">সাধারণ সদস্যদের জন্য নির্দেশনাবলী:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>নিয়মিত আপনার প্রোফাইল চেক করুন এবং তথ্য সঠিক রাখুন।</li>
                  <li>প্রতিটি সেশনে যোগদানের জন্য নির্দিষ্ট অ্যাটেনডেন্স কোড ব্যবহার করুন।</li>
                  <li>অহেতুক বা একাধিকবার একই সেশনে অ্যাটেনডেন্স জমা দেওয়া থেকে বিরত থাকুন।</li>
                  <li>যেকোনো ধরনের টেকনিক্যাল সমস্যার জন্য এক্সিকিউটিভ সদস্যদের সাথে যোগাযোগ করুন।</li>
                </ul>
              </div>
              <div className="border-t pt-4 mt-4">
                <p className="font-semibold">ডেভেলপার পরিচিতি:</p>
                <p className="text-muted-foreground">
                  ফরহাদ হোসেন <br/>
                  ক্রিয়েটিভ এন্ড টেকনিক্যাল হেড <br/>
                  তেজগাঁও কলেজ ফটোগ্রাফি ক্লাব
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
