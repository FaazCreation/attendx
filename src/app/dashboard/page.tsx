
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UserCheck, CalendarClock, FileText, BookUser, BarChart3, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { AttendXIcon } from '@/components/icons';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreateSessionForm } from '@/components/sessions/create-session-form';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const menuItems = [
  { href: '/sessions', label: 'সেশন', icon: CalendarClock, description: "অ্যাটেনডেন্স সেশন দেখুন এবং যোগ দিন", adminOnly: false, public: true },
  { href: '/instructions', label: 'নির্দেশনাবলি', icon: BookUser, description: "সিস্টেম এবং ব্যবহারবিধি সম্পর্কে জানুন", adminOnly: false, public: false },
  { href: '/constitution', label: 'ক্লাব গঠনতন্ত্র', icon: FileText, description: "ক্লাবের গঠনতন্ত্র ও নিয়মাবলী সম্পর্কে জানুন", adminOnly: false, public: true },
  { href: '/reports', label: 'রিপোর্ট দেখুন', icon: BarChart3, description: "সম্পূর্ণ অ্যাটেনডেন্স রিপোর্ট দেখুন", adminOnly: true },
];


export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: userData, isLoading: isUserRoleLoading } = useDoc(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const isAdmin = userData?.role === 'Admin';

  if (isUserRoleLoading) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-12 w-1/2" />
                <Skeleton className="h-10 w-32" />
            </div>
            <Skeleton className="h-8 w-1/3" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        </div>
    );
  }
  
  const visibleMenuItems = menuItems.filter(item => {
    if (isAdmin) {
      // Admins see admin-only and public items
      return item.adminOnly || item.public;
    } else {
      // Non-admins see non-admin-only and public items
      return !item.adminOnly || item.public;
    }
  });


  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex-grow space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
                <AttendXIcon className="h-8 w-8 text-primary" />
                <div className="text-left font-headline flex flex-col">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-none">
                    AttendX
                </h1>
                <p className="text-[6px] sm:text-xs text-muted-foreground leading-tight">
                    Attendance Management, Simplified.
                </p>
                </div>
            </div>
            {isAdmin && (
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        সেশন তৈরি করুন
                    </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>নতুন সেশন তৈরি করুন</DialogTitle>
                        <DialogDescription>
                        নতুন অ্যাটেনডেন্স সেশনের জন্য বিবরণ পূরণ করুন।
                        </DialogDescription>
                    </DialogHeader>
                    <CreateSessionForm onSessionCreated={() => setIsDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            )}
        </div>

        <p className="text-lg md:text-xl text-muted-foreground text-center sm:text-left">তেজগাঁও কলেজ ফটোগ্রাফি ক্লাব</p>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleMenuItems.map((item) => (
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

    
