
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { History, Target, Eye, Camera, BookOpen, Users, GraduationCap, Award } from "lucide-react";
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
              "তেজগাঁও কলেজ ফটোগ্রাফি ক্লাব (TCPC) একদল স্বপ্নবাজ তরুণদের হাত ধরে যাত্রা শুরু করে, যাদের লক্ষ্য ছিল আলোকচিত্রের মাধ্যমে কলেজের প্রতিটি কোণকে জীবন্ত করে তোলা। শুরুর দিকে এটি ছিল সাধারণ একদল শৌখিন আলোকচিত্রীদের মিলনমেলা, যা সময়ের সাথে সাথে আজ একটি পূর্ণাঙ্গ প্রতিষ্ঠানে রূপ নিয়েছে। বর্তমানে আমরা চতুর্থ ব্যাচের যাত্রায় রয়েছি, যেখানে আমাদের মূল লক্ষ্য হলো কলেজের সমৃদ্ধ ঐতিহ্যকে আধুনিক প্রজন্মের কাছে তুলে ধরা।"
            </p>
          </CardContent>
        </Card>

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
