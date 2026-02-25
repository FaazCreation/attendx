'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, GraduationCap, Image, Users, Video } from "lucide-react";
import Head from "next/head";

const activities = [
  {
    title: "ফটোওয়াক (Photo Walk)",
    description: "মাসে অন্তত একবার আমরা শহরের বিভিন্ন ঐতিহাসিক ও গুরুত্বপূর্ণ স্থানে ফটোওয়াকের আয়োজন করি। এটি সদস্যদের হাতে-কলমে ফটোগ্রাফি শেখার সেরা সুযোগ।",
    icon: MapPin,
    color: "text-blue-500",
    bg: "bg-blue-50",
    tag: "আউটডোর"
  },
  {
    title: "বেসিক ও অ্যাডভান্স ওয়ার্কশপ",
    description: "ফটোগ্রাফির টেকনিক্যাল দিক, এডিটিং এবং সিনেমাটোগ্রাফির ওপর নিয়মিত প্রশিক্ষণমূলক কর্মশালা পরিচালনা করা হয়।",
    icon: GraduationCap,
    color: "text-green-500",
    bg: "bg-green-50",
    tag: "প্রশিক্ষণ"
  },
  {
    title: "বার্ষিক আলোকচিত্র প্রদর্শনী",
    description: "সদস্যদের সেরা কাজগুলো নিয়ে আমরা বছর শেষে বড় পরিসরে প্রদর্শনীর আয়োজন করি, যেখানে পেশাদার বিচারকরা কাজগুলো মূল্যায়ন করেন।",
    icon: Image,
    color: "text-purple-500",
    bg: "bg-purple-50",
    tag: "প্রদর্শনী"
  },
  {
    title: "সাপ্তাহিক আলোচনা সভা",
    description: "প্রতি সপ্তাহে ক্লাবে আমরা সমসাময়িক ফটোগ্রাফি ট্রেন্ড এবং সদস্যদের কাজ নিয়ে গঠনমূলক আলোচনা করি।",
    icon: Users,
    color: "text-orange-500",
    bg: "bg-orange-50",
    tag: "আড্ডা"
  },
  {
    title: "ভিডিও ও কন্টেন্ট ক্রিয়েশন",
    description: "আমরা শুধুমাত্র স্টিল ফটোগ্রাফি নয়, বরং আধুনিক ভিডিওগ্রাফি এবং সোশ্যাল মিডিয়া কন্টেন্ট তৈরির ওপর গুরুত্ব দেই।",
    icon: Video,
    color: "text-red-500",
    bg: "bg-red-50",
    tag: "ক্রিয়েটিভ"
  }
];

export default function ActivitiesPage() {
  return (
    <>
      <Head>
        <title>আমাদের কার্যক্রম | DocX</title>
      </Head>
      <div className="flex-1 space-y-8 pb-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Camera className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">আমাদের কার্যক্রম</h1>
          </div>
          <p className="text-muted-foreground">তেজগাঁও কলেজ ফটোগ্রাফি ক্লাবের নিয়মিত ইভেন্ট ও সৃজনশীল কর্মসূচি।</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all border-none shadow-sm bg-card overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${activity.bg}`}>
                    <activity.icon className={`h-6 w-6 ${activity.color}`} />
                  </div>
                  <Badge variant="secondary" className="font-medium">{activity.tag}</Badge>
                </div>
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                  {activity.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {activity.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-primary/10 to-transparent border-dashed border-primary/20 mt-6">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Camera className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
                <p className="font-bold text-xl">আপনি কি আমাদের পরবর্তী ইভেন্টে যোগ দিতে চান?</p>
                <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                আমাদের প্রতিটি কার্যক্রম সদস্যদের দক্ষতা বৃদ্ধিতে সাহায্য করে। নতুন ইভেন্টের নোটিশ পেতে নিয়মিত ড্যাশবোর্ড এবং ক্লাবের ফেসবুক গ্রুপ লক্ষ্য করুন।
                </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
