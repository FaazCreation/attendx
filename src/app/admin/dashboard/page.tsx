'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarClock, PlusCircle, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateSessionForm } from '@/components/sessions/create-session-form';
import { useState } from 'react';
import { AttendXIcon } from '@/components/icons';

const adminMenuItems = [
    { href: '/admin/reports', label: 'রিপোর্ট দেখুন', icon: BarChart3, description: "সম্পূর্ণ অ্যাটেনডেন্স রিপোর্ট দেখুন" },
];

export default function AdminDashboardPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div className="flex flex-col flex-1 h-full">
            <div className="flex-grow space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AttendXIcon className="h-8 w-8 text-primary" />
                        <div className="text-left font-headline flex flex-col">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-none">
                            অ্যাডমিন ড্যাশবোর্ড
                        </h1>
                        <p className="text-[6px] sm:text-xs text-muted-foreground leading-tight">তেজগাঁও কলেজ ফটোগ্রাফি ক্লাব</p>
                        </div>
                    </div>
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
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {adminMenuItems.map((item) => (
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
