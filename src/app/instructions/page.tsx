'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Head from "next/head";

export default function InstructionsPage() {
  return (
    <>
      <Head>
        <title>নির্দেশনাবলি | DocX</title>
      </Head>
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            নির্দেশনাবলি
          </h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              <span className="font-headline">DocX</span> সম্পর্কে কিছু কথা
            </CardTitle>
            <CardDescription>
              তেজগাঁও কলেজ ফটোগ্রাফি ক্লাবের জন্য একটি আধুনিক ডেটা সিস্টেম।
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              <p>
                  <span className="font-headline font-semibold">DocX</span> (Data Simplified) হলো তেজগাঁও কলেজ ফটোগ্রাফি ক্লাবের সদস্যদের তথ্য ও কার্যক্রম ব্যবস্থাপনার জন্য একটি ডিজিটাল সমাধান। এই সিস্টেমের মাধ্যমে ক্লাবের সকল তথ্য সহজে এবং নির্ভুলভাবে সংরক্ষণ করা যায়।
              </p>
              
              <div>
                  <h3 className="font-semibold text-lg mb-2">সাধারণ সদস্যদের জন্য নির্দেশনাবলী:</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>নিয়মিত আপনার প্রোফাইল চেক করুন এবং তথ্য সঠিক রাখুন।</li>
                      <li>ক্লাবের বিভিন্ন তথ্য ও ইতিহাস জানতে ড্যাশবোর্ডের মেনুগুলো ব্যবহার করুন।</li>
                      <li>যেকোনো ধরনের টেকনিক্যাল সমস্যার জন্য এক্সিকিউটিভ সদস্যদের সাথে যোগাযোগ করুন।</li>
                  </ul>
              </div>

              <Separator />
              
              <div>
                  <p className="font-semibold text-lg">ডেভেলপার পরিচিতি:</p>
                  <div className="text-muted-foreground mt-2">
                      <p className="font-medium text-foreground">ফরহাদ হোসেন</p>
                      <p>হেড অফ ক্রিয়েটিভ এন্ড আইটি</p>
                      <p>তেজগাঁও কলেজ ফটোগ্রাফি ক্লাব</p>
                  </div>
              </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}