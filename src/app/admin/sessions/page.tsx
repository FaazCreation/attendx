
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSessionsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // This page is now removed. Redirecting to Admin Dashboard.
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p className="text-muted-foreground">অ্যাডমিন ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...</p>
    </div>
  );
}
