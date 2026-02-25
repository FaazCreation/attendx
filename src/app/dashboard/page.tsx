
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, UsersRound, History, HelpCircle, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatBot } from '@/components/dashboard/chat-bot';
import { Button } from '@/components/ui/button';

const allMenuItems = [
  { href: '/history', label: 'আমাদের ইতিহাস', icon: History, description: "ক্লাবের পথচলা এবং সাফল্যের গল্প" },
  { href: '/activities', label: 'আমাদের কার্যক্রম', icon: Camera, description: "ক্লাবের নিয়মিত ইভেন্ট ও কার্যক্রম সম্পর্কে জানুন" },
  { href: '/committee', label: 'পরিচালনা কমিটি', icon: UsersRound, description: "ক্লাবের বর্তমান কার্যনির্বাহী কমিটি দেখুন" },
  { href: '/faq', label: 'জিজ্ঞাসা ও উত্তর', icon: HelpCircle, description: "ক্লাব এবং সিস্টেম সম্পর্কে সাধারণ প্রশ্নের উত্তর" },
  { href: '/constitution', label: 'ক্লাব গঠনতন্ত্র', icon: FileText, description: "ক্লাবের গঠনতন্ত্র ও নিয়মাবলী সম্পর্কে জানুন" },
];

export default function DashboardPage() {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const itemsPerPageMobile = 4;

  const { data: userData, isLoading: isUserRoleLoading } = useDoc(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const totalPages = Math.ceil(allMenuItems.length / itemsPerPageMobile);
  const displayedItems = isMobile 
    ? allMenuItems.slice(currentPage * itemsPerPageMobile, (currentPage + 1) * itemsPerPageMobile)
    : allMenuItems;

  return (
    <div className="flex flex-col flex-1 h-full relative pb-12">
      <div className="flex-grow space-y-6">
        <div className="text-center sm:text-left">
          <p className="text-xl md:text-2xl font-bold text-primary font-sans tracking-tight">
            তেজগাঁও কলেজ ফটোগ্রাফি ক্লাব
          </p>
          <p className="text-sm text-muted-foreground mt-1">স্বাগতম, {userData?.name || 'সদস্য'}!</p>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {displayedItems.map((item) => (
            <Link href={item.href} key={item.href}>
              <Card className="hover:bg-muted/50 hover:border-primary/50 transition-all transform hover:-translate-y-1 h-full flex flex-col border-primary/10">
                <CardHeader className="flex-1 p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-md">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl md:text-2xl font-semibold leading-tight">{item.label}</CardTitle>
                      <CardDescription className="text-xs md:text-sm mt-[3px] sm:mt-1">
                        {item.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {isMobile && allMenuItems.length > itemsPerPageMobile && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="h-8 w-8 p-0 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 w-1.5 rounded-full transition-all ${currentPage === idx ? 'bg-primary w-4' : 'bg-muted'}`} 
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={(currentPage + 1) >= totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="h-8 w-8 p-0 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="absolute bottom-1 left-0 right-0 overflow-hidden bg-primary/5 border-y border-primary/10 py-2">
        <div className="whitespace-nowrap animate-marquee inline-block text-sm font-medium text-primary">
          আসসালামু আলাইকুম। তেজগাঁও কলেজ ফটোগ্রাফি ক্লাবের একটি আধুনিক ও সমন্বিত ডেটা সিস্টেমে স্বাগতম। যেকোনো প্রয়োজনে আমাদের অফিসিয়াল প্ল্যাটফর্মগুলোতে যোগাযোগ করুন। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করবো। &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          আসসালামু আলাইকুম। তেজগাঁও কলেজ ফটোগ্রাফি ক্লাবের একটি আধুনিক ও সমন্বিত ডেটা সিস্টেমে স্বাগতম। যেকোনো প্রয়োজনে আমাদের অফিসিয়াল প্ল্যাটফর্মগুলোতে যোগাযোগ করুন। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করবো।
        </div>
      </div>

      <ChatBot />
    </div>
  );
}
