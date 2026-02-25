
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Head from "next/head";

const committeeMembers = [
  { id: 1, name: "Mokaddesur Rahman Sun", role: "President", department: "TMS", batch: "2020-21", bio: "Leading the club with passion for photography and innovation." },
  { id: 2, name: "Arefin Tanvir", role: "General Secretary", department: "Marketing", batch: "2020-21", bio: "Organizing events and managing operations for smooth workflow."},
  { id: 3, name: "Touhid Islam", role: "Organizing Secretary", department: "Management", batch: "2023-24", bio: "Ensures smooth event organization and planning."},
  { id: 4, name: "Forhad Hossain", role: "Creative Head", department: "Economics", batch: "2023-24", bio: "Specialist in creative photography and storytelling." },
  { id: 5, name: "Niaj Karim Rakib", role: "Treasurer", department: "Economics", batch: "2021-22", bio: "Managing funds and keeping financial records secure." },
  { id: 6, name: "Vacancy", role: "Chief Executive", department: "None", batch: "None", bio: "Handles execution of decisions and supports leadership team." },
  { id: 7, name: "Vacancy", role: "Public Relations", department: "None", batch: "None", bio: "Maintains connections with media and external partners." },
  { id: 8, name: "Saifulla Al Ratul", role: "Event Coordinator", department: "Marketing", batch: "2020-21", bio: "Plans and executes all club events with dedication." },
  { id: 9, name: "Imtiash Hossain Tomal", role: "Photographer", department: "BBA", batch: "2021-22", bio: "Passionate about nature and portrait photography."},
  { id: 10, name: "Masum Billah", role: "Videographer", department: "Political Science", batch: "2022-23", bio: "Expert in video editing and cinematic storytelling." },
  { id: 11, name: "Vacancy", role: "Content Creator", department: "None", batch: "None", bio: "Writes creative captions and manages social media content." },
  { id: 12, name: "Mydul Bhuiyan", role: "Graphic Designer", department: "Marketing", batch: "2023-24", bio: "Designs posters, banners, and creative graphics for events." },
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
            <Card key={member.id} className={`overflow-hidden border-t-4 ${member.name === 'Vacancy' ? 'border-t-muted opacity-80' : 'border-t-primary'}`}>
              <CardHeader className="flex flex-col items-center text-center pb-2">
                <Avatar className="h-20 w-20 mb-3 border-2 border-primary/20">
                   <AvatarFallback className="text-xl bg-primary/5 text-primary">
                    {member.name === 'Vacancy' ? '?' : member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold">{member.name}</CardTitle>
                  <Badge variant={member.name === 'Vacancy' ? "outline" : "default"} className="font-medium">
                    {member.role}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <div className="text-xs text-muted-foreground space-y-1">
                    {member.department !== 'None' && (
                        <p><span className="font-semibold">বিভাগ:</span> {member.department}</p>
                    )}
                    {member.batch !== 'None' && (
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

import { Separator } from "@/components/ui/separator";
