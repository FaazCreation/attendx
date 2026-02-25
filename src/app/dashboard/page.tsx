'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, BookUser, UsersRound, History, HelpCircle, Camera } from 'lucide-react';
import Link from 'next/link';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatBot } from '@/components/dashboard/chat-bot';

const allMenuItems = [
  { href: '/history', label: 'আমাদের ইতিহাস', icon: History, description: "ক্লাবের পথচলা এবং সাফল্যের গল্প", adminOnly: false, userOnly: false },
  { href: '/activities', label: 'আমাদের কার্যক্রম', icon: Camera, description: "ক্লাবের নিয়মিত ইভেন্ট ও কার্যক্রম সম্পর্কে জানুন", adminOnly: false, userOnly: false },
  { href: '/committee', label: 'পরিচালনা কমিটি', icon: UsersRound, description: "ক্লাবের বর্তমান কার্যনির্বাহী কমিটি দেখুন", adminOnly: false, userOnly: false },
  { href: '/faq', label: 'জিজ্ঞাসা ও উত্তর', icon: HelpCircle, description: "ক্লাব এবং সিস্টেম সম্পর্কে সাধারণ প্রশ্নের উত্তর", adminOnly: false, userOnly: false },
  { href: '/constitution', label: 'ক্লাব গঠনতন্ত্র', icon: FileText, description: "ক্লাবের গঠনতন্ত্র ও নিয়মাবলী সম্পর্কে জানুন", adminOnly: false, userOnly: false },
];

export default function DashboardPage() {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();

  const { data: userData, isLoading: isUserRoleLoading } = useDoc(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const isLoading = isAuthLoading || isUserRoleLoading;

  if (isLoading) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-12 w-1/2" />
                <Skeleton className="h-10 w-44" />
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
  
  return (
    <div className="flex flex-col flex-1 h-full relative pb-12">
      <div className="flex-grow space-y-6">
        <div className="text-center sm:text-left">
          <p className="text-xl md:text-2xl font-bold text-primary font-sans tracking-tight">
            তেজগাঁও কলেজ ফটোগ্রাফি ক্লাব
          </p>
          <p className="text-sm text-muted-foreground mt-1">স্বাগতম, {userData?.name || 'সদস্য'}!</p>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allMenuItems.map((item) => (
            <Link href={item.href} key={item.href}>
              <Card className="hover:bg-muted/50 hover:border-primary/50 transition-all transform hover:-translate-y-1 h-full flex flex-col border-primary/10">
                <CardHeader className="flex-1 p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-md">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl md:text-2xl font-semibold">{item.label}</CardTitle>
                      <CardDescription className="text-xs md:text-sm mt-1">
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

      {/* Scrolling Announcement Bar */}
      <div className="absolute bottom-1 left-0 right-0 overflow-hidden bg-primary/5 border-y border-primary/10 py-2">
        <div className="whitespace-nowrap animate-marquee inline-block text-sm font-medium text-primary">
          আসসালামু আলাইকুম। তেজগাঁও কলেজ ফটোগ্রাফি ক্লাবের একটি আধুনিক ও সমন্বিত ডেটা সিস্টেমে স্বাগতম। যেকোনো প্রয়োজনে আমাদের অফিসিয়াল প্ল্যাটফর্মগুলোতে যোগাযোগ করুন। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করবো। &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          আসসালামু আলাইকুম। তেজগাঁও কলেজ ফটোগ্রাফি ক্লাবের একটি আধুনিক ও সমন্বিত ডেটা সিস্টেমে স্বাগতম। যেকোনো প্রয়োজনে আমাদের অফিসিয়াল প্ল্যাটফর্মগুলোতে যোগাযোগ করুন। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করবো।
        </div>
      </div>

      {/* Floating ChatBot */}
      <ChatBot />
    </div>
  );
}
