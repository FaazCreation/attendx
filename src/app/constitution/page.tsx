
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ConstitutionPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          ক্লাব গঠনতন্ত্র
        </h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            তেজগাঁও কলেজ ফটোগ্রাফি ক্লাবের গঠনতন্ত্র
          </CardTitle>
          <CardDescription>
            তেজগাঁও কলেজ, প্রতিষ্ঠিত: ২৯ জানুয়ারি ২০২০
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <section>
            <h2 className="text-xl font-semibold mb-3">উদ্দেশ্যঃ</h2>
            <p className="text-muted-foreground mb-4">ফটোগ্রাফি ক্লাবের মূল লক্ষ্য ও উদ্দেশ্য হলো:</p>
            <ul className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>শিক্ষার্থীদের সৃজনশীলতা ও ফটোগ্রাফির দক্ষতা উন্নত করা।</li>
              <li>আলোকচিত্রের মাধ্যমে মানবিকতা, পরিবেশ ও সমাজের বার্তা ছড়িয়ে দেওয়া।</li>
              <li>ফটোগ্রাফির ইতিহাস, প্রযুক্তি, এবং নৈতিক দিক সম্পর্কে সদস্যদের জ্ঞান বৃদ্ধি করা।</li>
              <li>প্রযুক্তি, ধারণা এবং সৃজনশীলতার সমন্বয়ে ফটোগ্রাফিকে শিল্পরূপে প্রতিষ্ঠিত করা।</li>
              <li>সদস্যদের পারস্পরিক সহযোগিতা ও সহমর্মিতা তৈরি করা।</li>
              <li>ক্লাবের মাধ্যমে সমাজে ইতিবাচক পরিবর্তন আনার চেষ্টা করা।</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3">উপদেষ্টা প্যানেল</h2>
            <p className="text-muted-foreground mb-4">ক্লাবের সার্বিক কার্যক্রম পরিচালনা ও উন্নয়নে সহায়তা করার জন্য একটি উপদেষ্টা প্যানেল থাকবে।</p>
            <h3 className="font-semibold mb-2">উপদেষ্টাদের ভূমিকা:</h3>
            <ul className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>ক্লাবের দীর্ঘমেয়াদি পরিকল্পনা প্রণয়ন এবং বাস্তবায়নে পরামর্শ দেওয়া।</li>
              <li>সদস্যদের শিক্ষামূলক কার্যক্রম পরিচালনায় দিকনির্দেশনা প্রদান।</li>
              <li>ক্লাবের সুনাম ও কার্যক্রমের গুণগত মান বজায় রাখতে সহায়তা করা।</li>
              <li>বিশেষ প্রতিযোগিতা বা প্রদর্শনীর আয়োজনের সময় ক্লাবকে প্রয়োজনীয় সহায়তা প্রদান।</li>
            </ul>
            <h3 className="font-semibold mt-4 mb-2">উপদেষ্টাদের নির্বাচন প্রক্রিয়া:</h3>
            <ul className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>উপদেষ্টা হিসেবে ক্লাবের অভিজ্ঞ শিক্ষক, আলোকচিত্রী বা প্রতিষ্ঠিত পেশাজীবীকে মনোনীত করা হবে।</li>
              <li>কার্যনির্বাহী কমিটির সিদ্ধান্তে উপদেষ্টা প্যানেলের সদস্য মনোনীত হবেন।</li>
              <li>প্রতিষ্ঠাতা সরাসরি উপদেষ্ঠা হিসেবে থাকবেন।</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3">ক্লাবের কাঠামো</h2>
            <h3 className="font-semibold mb-2">১. সদস্যপদ:</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>১.১ ক্লাবের সদস্য হতে হলে ফটোগ্রাফি বিষয়ে আগ্রহী হতে হবে।</li>
                <li>১.২ সদস্য হতে হলে নির্ধারিত সদস্য ফি প্রদান করতে হবে।</li>
                <li>১.৩ নিয়মিত কার্যক্রমে অংশগ্রহণ না করলে সদস্যপদ বাতিল হতে পারে।</li>
            </ul>
            <h3 className="font-semibold mt-4 mb-2">২. সদস্যপদের ধরণ:</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>ক) সাধারণ সদস্য: যারা ক্লাবের নিয়মিত কার্যক্রমে অংশগ্রহণ করবেন।</li>
                <li>খ) আজীবন সদস্য: এককালীন ফি দিয়ে আজীবন সদস্য হওয়া যাবে।</li>
                <li>গ) সম্মানসূচক সদস্য: বিশেষ অবদান রাখা ব্যক্তিদের এই সদস্যপদ দেওয়া হবে।</li>
            </ul>
          </section>

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>কার্যনির্বাহী কমিটি ও ক্লাব ইউনিট</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <section>
                <h3 className="font-semibold mb-2">কার্যনির্বাহী কমিটি:</h3>
                 <ul className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>সভাপতি - President</li>
                    <li>সম্পাদক - Secretary</li>
                    <li>সহকারী সম্পাদক - Assistant Secretary (শূন্য পদ)</li>
                    <li>সাংগঠনিক সম্পাদক - Organizing Secretary</li>
                    <li>কোষাধ্যক্ষ - Treasurer</li>
                </ul>
            </section>
            <section>
                <h3 className="font-semibold mt-4 mb-2">ক্লাব ইউনিট:</h3>
                 <ul className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Graphics Team: ডিজাইন সংক্রান্ত সব কাজ পরিচালনা করবে।</li>
                    <li>Photography Unit: ইভেন্ট, পোর্ট্রেট, আউটডোর এবং ক্রিয়েটিভ ফটোগ্রাফি পরিচালনা করা।</li>
                    <li>Video & Content Unit: ভিডিও প্রোডাকশন, এডিটিং এবং সোশ্যাল কনটেন্ট তৈরির দায়িত্বে থাকবে।</li>
                    <li>Program Execution Unit: ইভেন্ট ম্যানেজমেন্ট, কো-অর্ডিনেশন এবং ক্লাবের কার্যক্রম বাস্তবায়ন করবে।</li>
                    <li>Social Unit: ক্লাবের সোশ্যাল মিডিয়া অ্যাকাউন্ট পরিচালনা করবে।</li>
                </ul>
            </section>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>কমিটি ও ইউনিটের দায়িত্ব</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-bold">সভাপতি - President</h4>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>ক্লাবের সার্বিক নেতৃত্ব এবং কার্যক্রমের পরিকল্পনা।</li>
                <li>মিটিংয়ের সভাপতিত্ব এবং সদস্যদের উদ্বুদ্ধ করা।</li>
                <li>ক্লাবের পরিচিতি এবং সুনাম বৃদ্ধি করা।</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold">সম্পাদক - Secretary</h4>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>ক্লাবের দৈনন্দিন কার্যক্রম পরিচালনা এবং সংগঠিত করা।</li>
                <li>মিটিংয়ের রেকর্ড এবং ক্লাবের কর্মপরিকল্পনা সংরক্ষণ।</li>
                <li>সদস্যদের মধ্যে যোগাযোগ ব্যবস্থা বজায় রাখা।</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold">সহকারী সম্পাদক - Assistant Secretary</h4>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>এই পদটি সর্বদায় শুন্য থাকবে।</li>
                <li>বিশেষ প্রয়োজনে সভাপতি ও সহকারি সম্পাদকের নির্দেশে উক্ত পদে কাউকে নিযুক্ত করা হবে।</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold">সাংগঠনিক সম্পাদক - Organizing Secretary</h4>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>ক্লাবের ইভেন্ট, কর্মশালা, প্রদর্শনী ইত্যাদি আয়োজনের দায়িত্ব।</li>
                <li>ইভেন্টের সময়সূচী নির্ধারণ এবং প্রয়োজনীয় প্রস্তুতি গ্রহণ।</li>
                <li>ইভেন্টের জন্য সদস্যদের দায়িত্ব বণ্টন করা।</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold">কোষাধ্যক্ষ - Treasurer</h4>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>ক্লাবের আর্থিক হিসাব এবং বাজেট পরিচালনা।</li>
                <li>সদস্য ফি সংগ্রহ এবং খরচের হিসাব রাখা।</li>
                <li>ক্লাবের অর্থনৈতিক সচ্ছলতা নিশ্চিত করা এবং প্রতিবেদন তৈরি করা।</li>
              </ul>
            </div>
            <Separator className="my-4" />
            <div>
              <h4 className="font-bold">Graphics Team</h4>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>ক্লাবের ভিজ্যুয়াল আইডেন্টিটি বজায় রাখা এবং প্রয়োজনীয় সব ধরনের গ্রাফিক্স ডিজাইন তৈরি করা।</li>
                <li>ক্লাবের ইভেন্ট, ক্যাম্পেইন ও ঘোষণার জন্য পোস্টার, ব্যানার, ফ্লায়ার এবং অন্যান্য ভিজ্যুয়াল ম্যাটেরিয়াল ডিজাইন করা।</li>
                <li>ক্লাবের ব্র্যান্ডিং গাইডলাইন তৈরি ও তা অনুসরণ নিশ্চিত করা।</li>
              </ul>
            </div>
             <div>
              <h4 className="font-bold">Photography Unit</h4>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>ক্লাবের সব ধরনের কার্যক্রমের ফটোগ্রাফি পরিচালনা করা।</li>
                <li>পোর্ট্রেট ফটোগ্রাফি (মেম্বার প্রোফাইল বা বিশেষ শুট) করা।</li>
                <li>আউটডোর ফটোগ্রাফি ও ক্রিয়েটিভ ফটো কনসেপ্ট ডেভেলপ করা।</li>
              </ul>
            </div>
             <div>
              <h4 className="font-bold">Video & Content Unit</h4>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>ভিডিও প্রোডাকশন।</li>
                <li>ভিডিও এডিটিং।</li>
                <li>সোশ্যাল মিডিয়া কনটেন্ট তৈরি।</li>
              </ul>
            </div>
             <div>
              <h4 className="font-bold">Program Execution Unit</h4>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>ইভেন্ট ম্যানেজমেন্ট</li>
                <li>কো-অর্ডিনেশন</li>
                <li>ক্লাবের বিভিন্ন কার্যক্রম বাস্তবায়ন</li>
              </ul>
            </div>
             <div>
              <h4 className="font-bold">Social Unit</h4>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>ক্লাবের সকল সোশ্যাল মিডিয়া অ্যাকাউন্ট পরিচালনা করা</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
       <Card>
        <CardContent className="space-y-6 pt-6">
            <section>
                <h2 className="text-xl font-semibold mb-3">ক্লাবের নিয়মিত কার্যক্রম</h2>
                <ul className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>ফটোগ্রাফি প্রশিক্ষণ ও কর্মশালা।</li>
                    <li>সাপ্তাহিক আলোচনার আয়োজন।</li>
                    <li>আলোকচিত্র প্রদর্শনী ও প্রতিযোগিতা।</li>
                    <li>ফটোওয়াক এবং শিক্ষামূলক ভ্রমণ।</li>
                    <li>ফটোগ্রাফি সংক্রান্ত সেমিনার ও আলোচনা সভা।</li>
                    <li>সামাজিক বা পরিবেশগত বিষয়ে আলোকচিত্র প্রজেক্ট তৈরি।</li>
                    <li>কলেজের সার্বিক অনুষ্ঠানে সহযোগিতা করা। (আলোচনা সাপেক্ষে)</li>
                </ul>
            </section>

            <Separator />
            
            <section>
                <h2 className="text-xl font-semibold mb-3">বার্ষিক সাধারণ সভা (AGM)</h2>
                 <ul className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>বার্ষিক সাধারণ সভা প্রতি বছর একবার অনুষ্ঠিত হবে।</li>
                    <li>AGM-এ ক্লাবের আয়-ব্যয়ের হিসাব এবং কার্যক্রমের প্রতিবেদন উপস্থাপন করা হবে।</li>
                    <li>নতুন কার্যনির্বাহী কমিটি নির্বাচনের জন্য AGM-এ ভোটগ্রহণ করা হবে।</li>
                    <li>সদস্যদের কাছ থেকে উন্নয়নমূলক প্রস্তাব গ্রহণ করা হবে।</li>
                </ul>
            </section>

            <Separator />

             <section>
                <h2 className="text-xl font-semibold mb-3">আর্থিক নিয়ম-কানুন</h2>
                 <ul className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>ক্লাবের তহবিল সদস্য ফি, স্পন্সরশিপ, এবং দানের মাধ্যমে পরিচালিত হবে।</li>
                    <li>ক্লাবের আয়-ব্যয়ের সুষ্ঠ হিসাব রাখা হবে এবং AGM-এ তা প্রকাশ করা হবে।</li>
                    <li>কলেজের আর্থিক তহবিল থেকে ক্লাবে অনুদান গ্রহন করা যাবে।</li>
                </ul>
            </section>

            <Separator />
            
            <section>
                <h2 className="text-xl font-semibold mb-3">উন্নয়ন পরিকল্পনা</h2>
                 <ul className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>ক্লাবের জন্য একটি নির্ধারিত স্থান (রুম) স্থাপন করা।</li>
                    <li>ক্লাবের নিজস্ব ক্যামেরা, লাইটিং এবং অন্যান্য সরঞ্জাম সংগ্রহ।</li>
                    <li>ক্লাবের নিজস্ব ওয়েবসাইট এবং অনলাইন গ্যালারি তৈরি।</li>
                    <li>জাতীয় এবং আন্তর্জাতিক ফটোগ্রাফি প্রতিযোগিতায় অংশগ্রহণ।</li>
                </ul>
            </section>
            
            <Separator />

            <section>
                <h2 className="text-xl font-semibold mb-3">শৃঙ্খলা বজায় রাখা</h2>
                 <ul className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>ক্লাবের নিয়ম-কানুন প্রতিটি সদস্যকে মেনে চলতে হবে।</li>
                    <li>শৃঙ্খলাভঙ্গের জন্য কমিটির সিদ্ধান্ত অনুযায়ী ব্যবস্থা নেওয়া হবে।</li>
                    <li>ক্লাবের কোনো সদস্য ক্লাবের নিয়ম-কানুন ভঙ্গ করলে কোর মেম্বার এর সিদ্ধান্ত ক্রমে তাকে ক্লাব থেকে বহিষ্কার করা হতে পারে।</li>
                </ul>
            </section>

            <Separator />

            <section>
                <h2 className="text-xl font-semibold mb-3">গঠনতন্ত্র সংশোধন</h2>
                 <ul className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>গঠনতন্ত্র সংশোধনের জন্য কার্যনির্বাহী কমিটির দুই-চতুর্থংশ সদস্যের অনুমোদন প্রয়োজন।</li>
                    <li>সংশোধনের বিষয় AGM-এ উত্থাপন করা হবে এবং সদস্যদের সম্মতি নেওয়া হবে।</li>
                </ul>
            </section>

            <Separator />

            <section>
                <h2 className="text-xl font-semibold mb-3">ক্লাবের বিলুপ্তি</h2>
                 <p className="text-muted-foreground">ক্লাব বিলুপ্তির প্রস্তাব কার্যনির্বাহী কমিটির সর্বসম্মত সিদ্ধান্তে অনুমোদিত হতে হবে।</p>
            </section>
            
            <Separator />
            
             <section>
                <h2 className="text-xl font-semibold mb-3">সমাপ্তি</h2>
                 <p className="text-muted-foreground">এই গঠনতন্ত্র ক্লাব প্রতিষ্ঠার তারিখ থেকে কার্যকর হবে এবং সকল সদস্যের জন্য প্রযোজ্য হবে।</p>
            </section>
        </CardContent>
      </Card>
    </div>
  );
}
