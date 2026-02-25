'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { History, Target, Eye, Camera, BookOpen, Users, GraduationCap, Award, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Head from "next/head";

export default function HistoryPage() {
  const stats = [
    { label: "প্রদর্শনী", value: "০৩+", icon: Award, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "ওয়ার্কশপ", value: "০৫+", icon: BookOpen, color: "text-green-500", bg: "bg-green-50" },
    { label: "সদস্য", value: "৬০+", icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "ব্যাচ", value: "৪র্থ", icon: GraduationCap, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  return (
    <>
      <Head>
        <title>আমাদের ইতিহাস | DocX</title>
      </Head>
      <div className="flex-1 space-y-8 pb-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">আমাদের ইতিহাস</h1>
          <p className="text-muted-foreground">তেজগাঁও কলেজ ফটোগ্রাফি ক্লাবের (TCPC) পথচলা</p>
        </div>
        
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-muted/20">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-primary/10 rounded-full">
                    <History className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="outline" className="text-xs">স্থাপিত: ২০২০</Badge>
            </div>
            <CardTitle className="text-2xl font-bold text-primary">স্বপ্ন থেকে যাত্রা শুরু</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed text-muted-foreground italic">
              "তেজগাঁও কলেজ ফটোগ্রাফি ক্লাব (TCPC) একদল স্বপ্নবাজ তরুণদের হাত ধরে যাত্রা শুরু করে, যাদের লক্ষ্য ছিল আলোকচিত্রের মাধ্যমে কলেজের প্রতিটি কোণকে জীবন্ত করে তোলা। শুরুর দিকে এটি ছিল সাধারণ একদল শৌখিন আলোকচিত্রীদের মিলনমেলা, যা সময়ের সাথে সাথে আজ একটি পূর্ণাঙ্গ প্রতিষ্ঠানে রূপ নিয়েছে।"
            </p>
          </CardContent>
        </Card>

        {/* Founder Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">প্রতিষ্ঠাতা ও সভাপতির কথা</h2>
            <Separator className="flex-1" />
          </div>
          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-xl">
                    <AvatarFallback className="text-4xl bg-primary text-primary-foreground font-bold">সান</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">মোকাদ্দেসুর রহমান সান</h3>
                    <p className="text-primary font-medium text-sm">প্রতিষ্ঠাতা ও সভাপতি</p>
                  </div>
                </div>
                <div className="flex-1 space-y-4 relative">
                  <Quote className="absolute -top-4 -left-2 h-8 w-8 text-primary/20" />
                  <div className="text-muted-foreground leading-relaxed text-lg pt-2 italic">
                    "ফটোগ্রাফি আমার কাছে কেবল একটি শখ নয়, এটি একটি ভাবনা যা আমাদের চারপাশের সৌন্দর্যকে অমর করে রাখে। তেজগাঁও কলেজ ফটোগ্রাফি ক্লাব প্রতিষ্ঠার মূল উদ্দেশ্য ছিল এমন একটি প্ল্যাটফর্ম তৈরি করা যেখানে প্রতিটি শিক্ষার্থী তাদের সৃজনশীলতা প্রকাশের সুযোগ পায়। আমরা বিশ্বাস করি, একটি ভালো ছবি হাজারো শব্দের চেয়েও শক্তিশালী বার্তা দিতে পারে। আমাদের এই পথচলায় আপনারা পাশে থাকলে আমরা আরও বহুদূর এগিয়ে যাবো ইনশাআল্লাহ।"
                  </div>
                  <div className="bg-white/50 p-4 rounded-lg border border-primary/5">
                    <p className="text-sm font-medium">বর্তমানে আমরা চতুর্থ ব্যাচের যাত্রায় রয়েছি, যেখানে আমাদের মূল লক্ষ্য হলো কলেজের সমৃদ্ধ ঐতিহ্যকে আধুনিক প্রজন্মের কাছে তুলে ধরা এবং আন্তর্জাতিক পর্যায়ে নিজেদের দক্ষতাকে প্রমাণ করা।</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all border-none bg-card">
              <CardContent className="pt-6">
                <div className={`mx-auto w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center mb-3`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>আমাদের লক্ষ্য</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                শিক্ষার্থীদের মধ্যে সৃজনশীলতা জাগ্রত করা এবং ফটোগ্রাফিকে কেবল শখ হিসেবে নয়, বরং একটি শক্তিশালী প্রকাশভঙ্গি হিসেবে প্রতিষ্ঠা করা।
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>আমাদের ভিশন</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                বাংলাদেশের কলেজ পর্যায়ের শীর্ষস্থানীয় ভিজ্যুয়াল আর্ট অর্গানাইজেশন হিসেবে নিজেদের প্রতিষ্ঠিত করা এবং জাতীয় পর্যায়ে তেজগাঁও কলেজের প্রতিনিধিত্ব করা।
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center pt-6">
            <div className="flex items-center gap-4 text-primary/40 animate-pulse">
                <Camera className="h-8 w-8" />
                <Separator className="w-20" />
                <Award className="h-8 w-8" />
            </div>
        </div>
      </div>
    </>
  );
}