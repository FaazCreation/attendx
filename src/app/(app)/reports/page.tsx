'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, AlertTriangle } from 'lucide-react';
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReportsPage() {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: currentUserData, isLoading: isCurrentUserLoading } = useDoc(userDocRef);

  const canViewPage = useMemo(() => {
    if (!currentUserData) return false;
    return ['Admin', 'Executive Member'].includes(currentUserData.role);
  }, [currentUserData]);

  const isGeneralMember = !isCurrentUserLoading && currentUserData?.role === 'General Member';

  useEffect(() => {
    if (!isCurrentUserLoading && isGeneralMember) {
      router.push('/dashboard');
    }
  }, [isCurrentUserLoading, isGeneralMember, router]);

  const isLoading = isAuthLoading || isCurrentUserLoading;

  if (isLoading || isGeneralMember) {
    return (
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-headline">
            রিপোর্ট
          </h1>
        </div>
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
      </div>
    );
  }

  if (!canViewPage) {
    return (
       <Card className="border-destructive">
          <CardHeader className="flex flex-row items-center gap-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <CardTitle>প্রবেশাধিকার নেই</CardTitle>
          </CardHeader>
          <CardContent>
            <p>এই পৃষ্ঠাটি দেখার জন্য আপনার অনুমতি নেই। ড্যাশবোর্ডে রিডাইরেক্ট করা হচ্ছে...</p>
          </CardContent>
        </Card>
    )
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-headline">
          রিপোর্ট
        </h1>
        <Button>
            <Download className="mr-2 h-4 w-4" />
            সব ডেটা এক্সপোর্ট করুন
          </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>রিপোর্ট তৈরি করুন</CardTitle>
        </CardHeader>
        <CardContent>
          <p>রিপোর্টিং বৈশিষ্ট্য শীঘ্রই আসছে। আপনি সদস্যের উপস্থিতি এবং অংশগ্রহণের উপর বিস্তারিত রিপোর্ট তৈরি করতে পারবেন।</p>
        </CardContent>
      </Card>
    </div>
  );
}
