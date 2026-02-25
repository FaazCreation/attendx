
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Clock, UserCheck, XCircle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useFirestore, useUser, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';
import Link from "next/link";

type Session = {
  id: string;
  title: string;
  date: string; // ISO String
  time: string;
};

interface SessionCardProps {
  session: Session;
  userRole: 'Admin' | 'General Member';
}

const toBengaliNumerals = (numStr: string): string => {
    const bengaliNumerals: { [key: string]: string } = {
        '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
        '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    return String(numStr).replace(/\d/g, (d) => bengaliNumerals[d]);
};

const formatTime = (timeString: string) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  let h = parseInt(hours, 10);
  const m = parseInt(minutes, 10);

  let timeOfDay: string;
  let displayHours: number;

  if (h >= 5 && h < 12) {
    timeOfDay = 'সকাল';
    displayHours = h;
  } else if (h >= 12 && h < 16) {
    timeOfDay = 'দুপুর';
    displayHours = h > 12 ? h - 12 : (h === 12 ? 12 : h);
  } else if (h >= 16 && h < 18) {
    timeOfDay = 'বিকাল';
    displayHours = h > 12 ? h - 12 : h;
  } else {
    timeOfDay = 'রাত';
    displayHours = h > 12 ? h - 12 : (h === 0 ? 12 : h);
  }

  const bengaliHours = toBengaliNumerals(String(displayHours));
  const bengaliMinutes = toBengaliNumerals(String(m).padStart(2,'0'));

  return `${timeOfDay} ${bengaliHours}:${bengaliMinutes}`;
};

export function SessionCard({ session, userRole }: SessionCardProps) {
    const { user } = useUser();
    const firestore = useFirestore();

    const { data: attendance, isLoading: isCheckingAttendance } = useDoc(() => {
        if (!firestore || !user || !session.id) return null;
        return doc(firestore, `attendanceSessions/${session.id}/attendanceRecords`, user.uid);
    }, [firestore, user, session.id]);

    const isAdmin = userRole === 'Admin';
    const sessionDate = useMemo(() => new Date(session.date), [session.date]);
    const formattedTime = formatTime(session.time);
    const formattedDate = toBengaliNumerals(format(sessionDate, 'EEEE, do MMMM yyyy', { locale: bn }));
    
    const hasAttended = !!attendance;

  return (
    <Card className="flex flex-col border-l-4 border-l-primary">
      <CardHeader>
        <CardTitle className="text-lg font-bold line-clamp-2">{session.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-2 h-4 w-4" />
          <span>{formattedTime}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-2 border-t">
        {isAdmin ? (
          <Link href={`/admin/sessions/${session.id}`} className="w-full">
            <Button variant="default" className="w-full gap-2">
              <UserCheck className="h-4 w-4" />
              উপস্থিতি পরিচালনা করুন
            </Button>
          </Link>
        ) : (
          <div className="w-full flex items-center justify-between">
            <span className="text-sm font-medium">আপনার অবস্থা:</span>
            {isCheckingAttendance ? (
              <Badge variant="outline">যাচাই হচ্ছে...</Badge>
            ) : hasAttended ? (
              <Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
                <Check className="h-3 w-3" /> উপস্থিত
              </Badge>
            ) : (
              <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200 gap-1">
                <XCircle className="h-3 w-3" /> অনুপস্থিত
              </Badge>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
