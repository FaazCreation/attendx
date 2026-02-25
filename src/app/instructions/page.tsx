'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, ShieldCheck, UserCog, Info, Mail, Facebook, Youtube, Globe, Phone } from "lucide-react";
import Head from "next/head";

export default function InstructionsPage() {
  const contactInfo = [
    { label: "অফিসিয়াল ইমেইল", value: "tcd.photographyclub@gmail.com", icon: Mail, type: "email" },
    { label: "টেকনিক্যাল ও প্রমোশনাল", value: "creative.tcpc@gmail.com", icon: Phone, type: "email" },
    { label: "ফেসবুক", value: "@tcd.photographyclub", icon: Facebook, type: "link" },
    { label: "ইউটিউব", value: "@TejgaonCollegePhotographyClub", icon: Youtube, type: "link" },
    { label: "ওয়েবসাইট", value: "tcpccreative.com", icon: Globe, type: "link" },
  ];

  return (
    <>
      <Head>
        <title>নির্দেশনাবলি | DocX</title>
      </Head>
      <div className="flex-1 space-y-6 pb-10">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Info className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            নির্দেশনাবলি
          </h1>
        </div>
        
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              DocX সম্পর্কে জানুন
            </CardTitle>
            <CardDescription>
              তেজগাঁও কলেজ ফটোগ্রাফি ক্লাবের একটি আধুনিক ও সমন্বিত ডেটা সিস্টেম।
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              <p className="leading-relaxed">
                  <span className="font-bold text-primary">DocX</span> হলো ক্লাবের একটি ডিজিটাল আর্কাইভ। এর মাধ্যমে সদস্যদের তথ্য সংরক্ষণ, ক্লাবের ইতিহাস জানা এবং পরিচালনা কমিটির সাথে সংযুক্ত থাকা এখন আরও সহজ। এটি একটি ওয়ান-স্টপ সলিউশন যেখানে ক্লাবের গঠনতন্ত্র থেকে শুরু করে নিয়মিত জিজ্ঞাসা—সবই পাওয়া যাবে।
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-semibold text-lg">
                    <UserCog className="h-5 w-5 text-primary" />
                    <h3>সদস্যদের জন্য</h3>
                  </div>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                    <li>নিজের প্রোফাইল নিয়মিত চেক করুন এবং তথ্য সঠিক রাখুন।</li>
                    <li>ক্লাবের বর্তমান পরিচালনা কমিটি সম্পর্কে আপডেট থাকুন।</li>
                    <li>ড্যাশবোর্ডের মাধ্যমে ক্লাবের ইতিহাস ও সাফল্যের গল্পগুলো জানুন।</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-semibold text-lg">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <h3>নিরাপত্তা ও নিয়ম</h3>
                  </div>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                    <li>আপনার লগইন তথ্য গোপন রাখুন।</li>
                    <li>গঠনতন্ত্র অনুযায়ী ক্লাবের সকল নিয়ম মেনে চলুন।</li>
                    <li>যেকোনো ত্রুটি খুঁজে পেলে আইটি উইংকে অবহিত করুন।</li>
                  </ul>
                </div>
              </div>

              <Separator />
              
              <div className="bg-muted/30 p-4 rounded-lg flex items-start gap-4">
                  <BookOpen className="h-6 w-6 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-lg">ডেভেলপার পরিচিতি:</p>
                    <div className="text-muted-foreground mt-2 text-sm leading-relaxed">
                        <p className="font-bold text-foreground">ফরহাদ হোসেন</p>
                        <p>প্রধান সৃজনশীল ও আইটি</p>
                        <p>তেজগাঁও কলেজ ফটোগ্রাফি ক্লাব</p>
                        <p className="mt-2 italic">সিস্টেমটি ক্লাবের সদস্যদের তথ্য ব্যবস্থাপনাকে সহজ ও আধুনিক করার লক্ষ্যে তৈরি করা হয়েছে।</p>
                    </div>
                  </div>
              </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">যোগাযোগ</h2>
            <Separator className="flex-1" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contactInfo.map((info, idx) => (
              <Card key={idx} className="hover:shadow-md transition-all border-primary/5">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <info.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-0.5 overflow-hidden">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">{info.label}</p>
                    <p className="text-sm font-medium truncate text-primary">{info.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="bg-muted/10 border-dashed">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground">যেকোনো প্রয়োজনে আমাদের অফিসিয়াল প্ল্যাটফর্মগুলোতে যোগাযোগ করুন। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করবো।</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}