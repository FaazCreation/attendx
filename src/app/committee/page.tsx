
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Head from "next/head";

const committeeMembers = [
  { id: 1, name: "মোকাদ্দেসুর রহমান সান", role: "সভাপতি", department: "টিএমএস", batch: "২০২০-২১", bio: "ফটোগ্রাফি এবং উদ্ভাবনের প্রতি একাগ্রতা নিয়ে ক্লাবকে নেতৃত্ব দিচ্ছেন।" },
  { id: 2, name: "আরেফিন তানভীর", role: "সাধারণ সম্পাদক", department: "মার্কেটিং", batch: "২০২০-২১", bio: "সবকিছু সুশৃঙ্খল রাখতে ইভেন্ট আয়োজন এবং ক্লাবের কার্যক্রম পরিচালনা করছেন।"},
  { id: 3, name: "তৌহিদ ইসলাম", role: "সাংগঠনিক সম্পাদক", department: "ম্যানেজমেন্ট", batch: "২০২৩-২৪", bio: "ইভেন্ট আয়োজন এবং সঠিক পরিকল্পনার বিষয়টি নিশ্চিত করেন।"},
  { id: 4, name: "ফরহাদ হোসেন", role: "প্রধান সৃজনশীল ও আইটি", department: "অর্থনীতি", batch: "২০২৩-২৪", bio: "সৃজনশীল ফটোগ্রাফি এবং ডেটা সিস্টেম ব্যবস্থাপনায় বিশেষজ্ঞ।" },
  { id: 5, name: "নিয়াজ করিম রাকিব", role: "কোষাধ্যক্ষ", department: "অর্থনীতি", batch: "২০২১-২২", bio: "ক্লাবের তহবিল ব্যবস্থাপনা এবং আর্থিক হিসাব নিরাপদে সংরক্ষণ করছেন।" },
  { id: 6, name: "শূন্যপদ", role: "প্রধান নির্বাহী", department: "প্রযোজ্য নয়", batch: "প্রযোজ্য নয়", bio: "সিদ্ধান্ত বাস্তবায়ন এবং নেতৃত্বদানকারী দলকে সহায়তা করেন।" },
  { id: 7, name: "শূন্যপদ", role: "জনসংযোগ কর্মকর্তা", department: "প্রযোজ্য নয়", batch: "প্রযোজ্য নয়", bio: "মিডিয়া এবং বাইরের অংশীদারদের সাথে সুসম্পর্ক বজায় রাখেন।" },
  { id: 8, name: "সাইফুল্লাহ আল রাতুল", role: "ইভেন্ট কোঅর্ডিনেটর", department: "মার্কেটিং", batch: "২০২০-২১", bio: "নিষ্ঠার সাথে ক্লাবের সকল ইভেন্টের পরিকল্পনা ও বাস্তবায়ন করেন।" },
  { id: 9, name: "ইমতিয়াজ হোসেন তমাল", role: "আলোকচিত্রী", department: "বিবিএ", batch: "২০২১-২২", bio: "প্রকৃতি এবং পোর্ট্রেট ফটোগ্রাফির প্রতি বিশেষভাবে অনুরাগী।"},
  { id: 10, name: "মাসুম বিল্লাহ", role: "ভিডিওগ্রাফার", department: "রাষ্ট্রবিজ্ঞান", batch: "২০২২-২৩", bio: "ভিডিও এডিটিং এবং সিনেমাটিক গল্প বলার ক্ষেত্রে দক্ষ।" },
  { id: 11, name: "শূন্যপদ", role: "কন্টেন্ট ক্রিয়েটর", department: "প্রযোজ্য নয়", batch: "প্রযোজ্য নয়", bio: "সৃজনশীল ক্যাপশন লেখা এবং সোশ্যাল মিডিয়া কন্টেন্ট পরিচালনা করেন।" },
  { id: 12, name: "মাইদুল ভূঁইয়া", role: "গ্রাফিক ডিজাইনার", department: "মার্কেটিং", batch: "২০২৩-২৪", bio: "ইভেন্টের জন্য পোস্টার, ব্যানার এবং সৃজনশীল গ্রাফিক্স ডিজাইন করেন।" },
];

export default function CommitteePage() {
  return (
    <>
      <Head>
        <title>পরিচালনা কমিটি | DocX</title>
      </Head>
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            পরিচালনা কমিটি
          </h1>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {committeeMembers.map((member) => (
            <Card key={member.id} className={`overflow-hidden border-t-4 ${member.name === 'শূন্যপদ' ? 'border-t-muted opacity-80' : 'border-t-primary'}`}>
              <CardHeader className="flex flex-col items-center text-center pb-2">
                <Avatar className="h-20 w-20 mb-3 border-2 border-primary/20">
                   <AvatarFallback className="text-xl bg-primary/5 text-primary">
                    {member.name === 'শূন্যপদ' ? '?' : member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold">{member.name}</CardTitle>
                  <Badge variant={member.name === 'শূন্যপদ' ? "outline" : "default"} className="font-medium">
                    {member.role}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <div className="text-xs text-muted-foreground space-y-1">
                    {member.department !== 'প্রযোজ্য নয়' && (
                        <p><span className="font-semibold">বিভাগ:</span> {member.department}</p>
                    )}
                    {member.batch !== 'প্রযোজ্য নয়' && (
                        <p><span className="font-semibold">সেশন:</span> {member.batch}</p>
                    )}
                </div>
                <Separator className="my-2" />
                <p className="text-xs italic leading-relaxed text-muted-foreground">
                  "{member.bio}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

