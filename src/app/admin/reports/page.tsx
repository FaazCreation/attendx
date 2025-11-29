'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function ReportsPage() {
  
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
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
