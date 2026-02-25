
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
    answer: "TCPC হলো তেজগাঁও কলেজের আলোকচিত্রপ্রেমী শিক্ষার্থীদের একটি সৃজনশীল প্ল্যাটফর্ম। এখানে শিক্ষার্থীরা ফটোগ্রাফির বিভিন্ন কলাকৌশল শিখতে পারে, প্রদর্শনীতে অংশ নিতে পারে এবং নিজেদের প্রতিভা প্রকাশের সুযোগ পায়।"
  },
  {
    question: "আমি কীভাবে ক্লাবের সদস্য হতে পারি?",
    answer: "নতুন সেশনের শুরুতে আমরা সদস্য সংগ্রহ করি। আগ্রহীরা নির্ধারিত অনলাইন ফর্ম পূরণ করে এবং নির্দিষ্ট ফি প্রদানের মাধ্যমে সদস্যপদ গ্রহণ করতে পারেন। ভর্তির সময় ক্লাবের অফিসিয়াল ফেসবুক পেজে ঘোষণা দেওয়া হয়।"
  },
  {
    question: "সদস্য হতে কি প্রফেশনাল ক্যামেরা থাকা বাধ্যতামূলক?",
    answer: "একদমই না! আপনার যদি ফটোগ্রাফির প্রতি প্রবল আগ্রহ থাকে এবং একটি স্মার্টফোনও থাকে, তবেই আপনি আমাদের সাথে যুক্ত হতে পারেন। আমাদের লক্ষ্য হলো আপনাকে ফটোগ্রাফি শেখানো, আপনার সরঞ্জাম যাই হোক না কেন।"
  },
  {
    question: "DocX সিস্টেমটি আসলে কী?",
    answer: "DocX হলো তেজগাঁও কলেজ ফটোগ্রাফি ক্লাবের নিজস্ব ডিজিটাল ডেটাবেস এবং তথ্য ব্যবস্থাপনা সিস্টেম। এর মাধ্যমে ক্লাবের সদস্যদের রেকর্ড, ইতিহাস, গঠনতন্ত্র এবং পরিচালনা কমিটির তথ্যগুলো এক জায়গায় সংরক্ষিত থাকে।"
  },
  {
    question: "সদস্য হিসেবে আমার দায়িত্ব কী কী?",
    answer: "একজন সক্রিয় সদস্য হিসেবে ক্লাবের নিয়মিত মিটিং, কর্মশালা (Workshop) এবং ইভেন্টগুলোতে অংশগ্রহণ করা আপনার দায়িত্ব। এছাড়া ক্লাবের গঠনতন্ত্র ও শৃঙ্খলা মেনে চলা আবশ্যক।"
  },
  {
    question: "আমি কি ক্লাবের গ্রাফিক্স বা ভিডিও টিমে কাজ করতে পারি?",
    answer: "অবশ্যই! ফটোগ্রাফি ছাড়াও আমাদের গ্রাফিক ডিজাইন, ভিডিও এডিটিং, ইভেন্ট ম্যানেজমেন্ট এবং কন্টেন্ট রাইটিং উইং রয়েছে। আপনার দক্ষতা অনুযায়ী আপনি যেকোনো ইউনিটে অবদান রাখতে পারেন।"
  },
  {
    question: "DocX সিস্টেমে কোনো ভুল তথ্য থাকলে কী করব?",
    answer: "যদি আপনার প্রোফাইলে বা অন্য কোথাও কোনো ভুল তথ্য খুঁজে পান, তবে দ্রুত আমাদের 'হেড অফ আইটি' বা এক্সিকিউটিভ কমিটির সদস্যদের সাথে যোগাযোগ করুন।"
  },
  {
    question: "ক্লাব থেকে কি কোনো স্বীকৃতি বা সার্টিফিকেট দেওয়া হয়?",
    answer: "হ্যাঁ, বিভিন্ন ওয়ার্কশপ সফলভাবে সম্পন্ন করলে এবং বিশেষ ইভেন্টে উল্লেখযোগ্য অবদানের জন্য সদস্যদের সার্টিফিকেট ও সম্মাননা প্রদান করা হয়।"
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
              তেজগাঁও কলেজ ফটোগ্রাফি ক্লাব এবং আমাদের ডিজিটাল সিস্টেম DocX সম্পর্কে আরও জানুন।
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
