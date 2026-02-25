'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Award, Camera, Users, Target } from "lucide-react";
import Head from "next/head";

const achievements = [
  {
    year: "২০২৪",
    title: "৩য় বার্ষিক প্রদর্শনী: আলোকছবি ৩.০",
    description: "তেজগাঁও কলেজ প্রাঙ্গণে সফলভাবে ৩য় বার্ষিক আলোকচিত্র প্রদর্শনী সম্পন্ন হয়েছে।",
    icon: Award,
    color: "text-yellow-500",
    bg: "bg-yellow-50"
  },
  {
    year: "২০২৩",
    title: "সেরা উদীয়মান ক্লাব অ্যাওয়ার্ড",
    description: "কলেজের সকল সাংস্কৃতিক সংগঠনের মধ্যে সৃজনশীলতায় বিশেষ অবদানের জন্য স্বীকৃতি।",
    icon: Trophy,
    color: "text-blue-500",
    bg: "bg-blue-50"
  },
  {
    year: "২০২২",
    title: "আলোকছবি ২.০",
    description: "জাতীয় পর্যায়ের বিচারকদের উপস্থিতিতে ২য় বার্ষিক প্রদর্শনী এবং কর্মশালা।",
    icon: Star,
    color: "text-purple-500",
    bg: "bg-purple-50"
  },
  {
    year: "২০২১",
    title: "স্ট্রিট ফটোগ্রাফি ওয়ার্কশপ",
    description: "পেশাদার আলোকচিত্রীদের মাধ্যমে ৫০ জনের বেশি সদস্যকে হাতে-কলমে প্রশিক্ষণ।",
    icon: Camera,
    color: "text-green-500",
    bg: "bg-green-50"
  },
  {
    year: "২০২০",
    title: "ক্লাবের ভিত্তি স্থাপন ও প্রথম প্রদর্শনী",
    description: "আলোকছবি ১.০ এর মাধ্যমে ক্লাবের আনুষ্ঠানিক যাত্রা এবং সদস্যদের প্রতিভা উন্মোচন।",
    icon: Target,
    color: "text-red-500",
    bg: "bg-red-50"
  }
];

export default function AchievementsPage() {
  return (
    <>
      <Head>
        <title>আমাদের সাফল্য | DocX</title>
      </Head>
      <div className="flex-1 space-y-8 pb-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">আমাদের সাফল্য</h1>
          </div>
          <p className="text-muted-foreground">তেজগাঁও কলেজ ফটোগ্রাফি ক্লাবের স্মরণীয় অর্জন ও মাইলফলকসমূহ।</p>
        </div>

        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {achievements.map((item, index) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Icon / Dot */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-card shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              {/* Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-bold text-primary font-headline">{item.year}</div>
                </div>
                <div className="text-lg font-bold mb-1">{item.title}</div>
                <div className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Card className="bg-primary/5 border-dashed border-primary/20 mt-10">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
            <Users className="h-10 w-10 text-primary opacity-50" />
            <p className="font-medium text-lg">আমাদের পরবর্তী লক্ষ্য আপনি!</p>
            <p className="text-sm text-muted-foreground max-w-lg">
              আমরা বিশ্বাস করি প্রতিটি সদস্যই একজন সফল আলোকচিত্রী হওয়ার সম্ভাবনা রাখে। আমাদের পরবর্তী সাফল্যের গল্পে আপনার নামটিও থাকতে পারে।
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
