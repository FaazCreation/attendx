
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HelpCircle, Users, Camera, Calendar, Share2, Info } from "lucide-react";
import Head from "next/head";

const faqCategories = [
  {
    id: "general",
    title: "সাধারণ প্রশ্নসমূহ",
    description: "ক্লাব এবং আমাদের ডিজিটাল সিস্টেম DocX সম্পর্কে প্রাথমিক ধারণা।",
    icon: Info,
    items: [
      {
        question: "তেজগাঁও কলেজ ফটোগ্রাফি ক্লাব (TCPC) কী?",
        answer: "TCPC হলো তেজগাঁও কলেজের আলোকচিত্রপ্রেমী শিক্ষার্থীদের একটি সৃজনশীল প্ল্যাটফর্ম। এখানে শিক্ষার্থীরা ফটোগ্রাফির বিভিন্ন কলাকৌশল শিখতে পারে, প্রদর্শনীতে অংশ নিতে পারে এবং নিজেদের প্রতিভা প্রকাশের সুযোগ পায়।"
      },
      {
        question: "DocX সিস্টেমটি আসলে কী?",
        answer: "DocX হলো তেজগাঁও কলেজ ফটোগ্রাফি ক্লাবের নিজস্ব ডিজিটাল ডেটাবেস এবং তথ্য ব্যবস্থাপনা সিস্টেম। এর মাধ্যমে ক্লাবের সদস্যদের রেকর্ড, ইতিহাস, গঠনতন্ত্র এবং পরিচালনা কমিটির তথ্যগুলো এক জায়গায় সংরক্ষিত থাকে।"
      }
    ]
  },
  {
    id: "membership",
    title: "সদস্যপদ ও নিয়োগ",
    description: "কীভাবে ক্লাবের সাথে যুক্ত হবেন এবং সদস্যপদের নিয়মাবলী।",
    icon: Users,
    items: [
      {
        question: "আমি কীভাবে ক্লাবের সদস্য হতে পারি?",
        answer: "নতুন সেশনের শুরুতে আমরা সদস্য সংগ্রহ করি। আগ্রহীরা নির্ধারিত অনলাইন ফর্ম পূরণ করে এবং নির্দিষ্ট ফি প্রদানের মাধ্যমে সদস্যপদ গ্রহণ করতে পারেন। ভর্তির সময় ক্লাবের অফিসিয়াল ফেসবুক পেজে ঘোষণা দেওয়া হয়।"
      },
      {
        question: "সদস্য হতে কি প্রফেশনাল ক্যামেরা থাকা বাধ্যতামূলক?",
        answer: "একদমই না! আপনার যদি ফটোগ্রাফির প্রতি প্রবল আগ্রহ থাকে এবং একটি স্মার্টফোনও থাকে, তবেই আপনি আমাদের সাথে যুক্ত হতে পারেন। আমাদের লক্ষ্য হলো আপনাকে ফটোগ্রাফি শেখানো।"
      },
      {
        question: "সদস্যপদ কি নবায়ন করতে হয়?",
        answer: "হ্যাঁ, প্রতি নতুন সেশনে সক্রিয় থাকার জন্য সদস্যপদ নবায়ন করার প্রয়োজন হতে পারে। এটি ক্লাবের বার্ষিক কার্যক্রমের একটি অংশ।"
      }
    ]
  },
  {
    id: "activities",
    title: "ক্লাব কার্যক্রম ও প্রশিক্ষণ",
    description: "নিয়মিত কর্মশালা, ফটোওয়াক এবং শেখার সুযোগসমূহ।",
    icon: Camera,
    items: [
      {
        question: "ক্লাবে কী কী ধরনের প্রশিক্ষণ দেওয়া হয়?",
        answer: "আমরা নিয়মিত বেসিক ফটোগ্রাফি, এডিটিং, লাইটিং এবং সিনেমাটোগ্রাফির ওপর ওয়ার্কশপ বা কর্মশালা আয়োজন করি। অভিজ্ঞ বড় ভাই এবং পেশাদার আলোকচিত্রীরা এই সেশনগুলো পরিচালনা করেন।"
      },
      {
        question: "ফটোওয়াক (Photo Walk) কী এবং এটি কখন হয়?",
        answer: "ফটোওয়াক হলো একটি গ্রুপ ইভেন্ট যেখানে সদস্যরা একসাথে শহরের কোনো ঐতিহাসিক বা সুন্দর জায়গায় গিয়ে ছবি তোলে। এটি মাসে অন্তত একবার বা বিশেষ ছুটির দিনে আয়োজন করা হয়।"
      }
    ]
  },
  {
    id: "events",
    title: "ইভেন্ট ও প্রদর্শনী",
    description: "প্রতিযোগিতা এবং আলোকচিত্র প্রদর্শনী সংক্রান্ত তথ্য।",
    icon: Calendar,
    items: [
      {
        question: "ক্লাব কি কোনো প্রতিযোগিতার আয়োজন করে?",
        answer: "হ্যাঁ, আমরা নিয়মিত আন্তঃকলেজ এবং অভ্যন্তরীণ ফটোগ্রাফি প্রতিযোগিতার আয়োজন করি। বিজয়ীদের জন্য থাকে আকর্ষণীয় পুরস্কার ও সার্টিফিকেট।"
      },
      {
        question: "বার্ষিক প্রদর্শনীতে ছবি নির্বাচনের প্রক্রিয়া কী?",
        answer: "সদস্যদের পাঠানো ছবি থেকে একটি নিরপেক্ষ বিচারক প্যানেল সেরা ছবিগুলো নির্বাচন করেন। টেকনিক্যাল মান এবং ছবির গল্পের ওপর ভিত্তি করে এই নির্বাচন করা হয়।"
      }
    ]
  },
  {
    id: "collaboration",
    title: "কোলাবরেশন ও প্রমোশন",
    description: "বাইরের প্রতিষ্ঠানের সাথে অংশীদারিত্ব এবং মিডিয়া যোগাযোগ।",
    icon: Share2,
    items: [
      {
        question: "অন্যান্য সংগঠন কি TCPC-এর সাথে কোলাবরেশন করতে পারে?",
        answer: "অবশ্যই! আমরা সবসময় সৃজনশীল অংশীদারিত্বকে স্বাগত জানাই। ইভেন্ট পার্টনার বা নলেজ শেয়ারিংয়ের জন্য আমাদের জনসংযোগ কর্মকর্তার সাথে যোগাযোগ করা যেতে পারে।"
      },
      {
        question: "স্পন্সরশিপ বা ব্র্যান্ড প্রমোশনের সুযোগ আছে কি?",
        answer: "হ্যাঁ, আমাদের ইভেন্টগুলোতে ব্র্যান্ড প্রমোশন এবং স্পন্সরশিপের সুযোগ রয়েছে। আগ্রহী প্রতিষ্ঠানগুলো আমাদের অফিসিয়াল ইমেইল বা ইনবক্সে প্রস্তাব পাঠাতে পারেন।"
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <>
      <Head>
        <title>জিজ্ঞাসা ও উত্তর | DocX</title>
      </Head>
      <div className="flex-1 space-y-8 pb-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              জিজ্ঞাসা ও উত্তর
            </h1>
          </div>
          <p className="text-muted-foreground">TCPC এবং DocX সম্পর্কে বিস্তারিত তথ্য এখানে পাবেন।</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {faqCategories.map((category) => (
            <Card key={category.id} className="border-t-4 border-t-primary shadow-sm h-fit">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-muted p-2 rounded-lg">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                </div>
                <CardDescription>
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.items.map((item, index) => (
                    <AccordionItem key={index} value={`${category.id}-item-${index}`}>
                      <AccordionTrigger className="text-left font-medium text-sm hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="bg-primary/5 border-dashed border-primary/20">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
            <p className="font-medium">আপনার কি আরও কোনো বিশেষ প্রশ্ন আছে?</p>
            <p className="text-sm text-muted-foreground max-w-lg">
              যদি আপনি উপরে আপনার উত্তর খুঁজে না পান, তবে সরাসরি আমাদের অফিসিয়াল ফেসবুক পেজে মেসেজ করুন অথবা ক্লাবের কার্যনির্বাহী কমিটির যেকোনো সদস্যের সাথে যোগাযোগ করুন।
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
