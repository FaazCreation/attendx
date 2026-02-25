
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import Head from "next/head";

const faqs = [
  {
    question: "তেজগাঁও কলেজ ফটোগ্রাফি ক্লাব (TCPC) কী?",
    answer: "TCPC হলো তেজগাঁও কলেজের আলোকচিত্রপ্রেমী শিক্ষার্থীদের একটি প্ল্যাটফর্ম, যেখানে তারা তাদের সৃজনশীলতা প্রকাশ করতে পারে এবং ফটোগ্রাফির বিভিন্ন কলাকৌশল শিখতে পারে।"
  },
  {
    question: "আমি কীভাবে সদস্য হতে পারি?",
    answer: "সাধারণত নতুন সেশনের শুরুতে আমরা সদস্য সংগ্রহ করি। আপনি নির্ধারিত অনলাইন ফর্ম পূরণ করে এবং সদস্য ফি প্রদান করে আমাদের সাথে যুক্ত হতে পারেন।"
  },
  {
    question: "সদস্য হতে কি প্রফেশনাল ক্যামেরা থাকা জরুরি?",
    answer: "একদমই না! আপনার যদি ফটোগ্রাফির প্রতি আগ্রহ থাকে এবং একটি সাধারণ স্মার্টফোনও থাকে, তবেই আপনি আমাদের সদস্য হতে পারেন। আমাদের লক্ষ্য হলো আপনাকে ফটোগ্রাফি শেখানো, আপনার সরঞ্জাম যাই হোক না কেন।"
  },
  {
    question: "DocX সিস্টেমটি কী এবং এটি কেন প্রয়োজন?",
    answer: "DocX হলো আমাদের ক্লাবের নিজস্ব ডেটা ম্যানেজমেন্ট সিস্টেম। এর মাধ্যমে সদস্যদের উপস্থিতি, ইভেন্ট রেকর্ড এবং অন্যান্য প্রয়োজনীয় তথ্য ডিজিটালভাবে সংরক্ষণ করা হয়, যা ক্লাবের স্বচ্ছতা ও গতিশীলতা বৃদ্ধি করে।"
  },
  {
    question: "সেশন বা মিটিংয়ে উপস্থিত থাকা কি বাধ্যতামূলক?",
    answer: "হ্যাঁ, একজন সক্রিয় সদস্য হিসেবে ক্লাবের নিয়মিত মিটিং এবং ওয়ার্কশপগুলোতে উপস্থিত থাকা জরুরি। নিয়মিত অনুপস্থিতি আপনার সদস্যপদের ওপর প্রভাব ফেলতে পারে।"
  },
  {
    question: "ক্লাব থেকে কি কোনো সার্টিফিকেট দেওয়া হয়?",
    answer: "হ্যাঁ, বিভিন্ন ওয়ার্কশপ সম্পন্ন করলে এবং ক্লাবের ইভেন্টে সক্রিয়ভাবে অংশগ্রহণ করলে সদস্যদের কৃতিত্বের স্বীকৃতিস্বরূপ সার্টিফিকেট প্রদান করা হয়।"
  },
  {
    question: "আমার প্রোফাইল বা পাসওয়ার্ড নিয়ে সমস্যা হলে কার সাথে যোগাযোগ করব?",
    answer: "আপনার অ্যাকাউন্টের যে কোনো টেকনিক্যাল সমস্যার জন্য আমাদের 'হেড অফ আইটি' বা এক্সিকিউটিভ কমিটির সদস্যদের সাথে সরাসরি যোগাযোগ করতে পারেন।"
  },
  {
    question: "ফটোগ্রাফি ছাড়াও কি অন্য কোনো বিভাগে কাজ করার সুযোগ আছে?",
    answer: "অবশ্যই! আমাদের এখানে ভিডিওগ্রাফি, গ্রাফিক ডিজাইন, ইভেন্ট ম্যানেজমেন্ট এবং কন্টেন্ট রাইটিংয়ের মতো বিভিন্ন উইং বা ইউনিট রয়েছে যেখানে আপনি আপনার দক্ষতা অনুযায়ী কাজ করতে পারেন।"
  }
];

export default function FAQPage() {
  return (
    <>
      <Head>
        <title>জিজ্ঞাসা ও উত্তর | DocX</title>
      </Head>
      <div className="flex-1 space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            জিজ্ঞাসা ও উত্তর
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>সাধারণ প্রশ্নসমূহ</CardTitle>
            <CardDescription>
              তেজগাঁও কলেজ ফটোগ্রাফি ক্লাব এবং DocX সিস্টেম সম্পর্কে আপনার মনে থাকা সাধারণ প্রশ্নের উত্তর এখানে পাবেন।
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        
        <div className="text-center p-6 bg-muted/30 rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground">
                আপনার কি আরও কোনো বিশেষ প্রশ্ন আছে? আমাদের অফিসিয়াল ফেসবুক পেজ অথবা সরাসরি ক্লাবের এক্সিকিউটিভ মেম্বারদের সাথে যোগাযোগ করুন।
            </p>
        </div>
      </div>
    </>
  );
}
