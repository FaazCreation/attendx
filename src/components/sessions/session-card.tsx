
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Clock, QrCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { AttendanceForm } from "./attendance-form";
import { useState, useEffect, useMemo } from "react";
import { useFirestore, useUser } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';

type Session = {
  id: string;
  title: string;
  type: string;
  date: string; // ISO String
  time: string;
  attendanceCode: string;
};

type UserRole = 'Admin' | 'General Member';

interface SessionCardProps {
  session: Session;
  userRole: UserRole;
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


const getSessionTypeInBangla = (type: string) => {
  switch(type) {
    case 'General Meeting': return 'সাধারণ সভা';
    case 'AGM': return 'এজিএম';
    case 'Event': return 'ইভেন্ট';
    case 'Workshop': return 'কর্মশালা';
    case 'Photowalk': return 'ফটোওয়াক';
    default: return type;
  }
}

export function SessionCard({ session, userRole }: SessionCardProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const [isAttendOpen, setIsAttendOpen] = useState(false);
    const [hasAttended, setHasAttended] = useState(false);
    const [isCheckingAttendance, setIsCheckingAttendance] = useState(true);

    useEffect(() => {
        const checkAttendance = async () => {
            if (!firestore || !user?.uid) {
                setIsCheckingAttendance(false);
                return;
            }

            setIsCheckingAttendance(true);
            try {
                const recordRef = doc(firestore, `attendanceSessions/${session.id}/attendanceRecords`, user.uid);
                const docSnap = await getDoc(recordRef);
                setHasAttended(docSnap.exists());
            } catch (error) {
                console.error("Error checking attendance:", error);
                setHasAttended(false); 
            } finally {
                setIsCheckingAttendance(false);
            }
        };

        if (user?.uid) {
            checkAttendance();
        } else {
            setIsCheckingAttendance(false);
        }
    }, [firestore, user, session.id, isAttendOpen]);


    const isAdmin = userRole === 'Admin';
    const canManageSession = isAdmin;

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${session.attendanceCode}`;
    
    const sessionDate = useMemo(() => new Date(session.date), [session.date]);
    const formattedTime = formatTime(session.time);
    const formattedDate = toBengaliNumerals(format(sessionDate, 'EEEE, do MMMM yyyy', { locale: bn }));
    
    const isAttendanceOver = useMemo(() => {
        const now = new Date();
        // Consider the session over 24 hours after its scheduled start time
        const sessionEndTime = new Date(sessionDate.getTime() + 24 * 60 * 60 * 1000);
        return now > sessionEndTime;
    }, [sessionDate]);
    
    const isButtonDisabled = hasAttended || isAttendanceOver || isCheckingAttendance;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex sm:flex-row flex-col sm:items-start sm:justify-between gap-2">
            <CardTitle className="text-lg font-bold line-clamp-2">{session.title}</CardTitle>
            <Badge variant={session.type === 'AGM' ? 'destructive' : 'secondary'} className="w-fit">{getSessionTypeInBangla(session.type)}</Badge>
        </div>
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
      <CardFooter className="flex justify-end gap-2">
        <Dialog open={isAttendOpen} onOpenChange={setIsAttendOpen}>
            <DialogTrigger asChild>
                <Button disabled={isButtonDisabled} className="w-full">
                    {isCheckingAttendance 
                        ? 'লোড হচ্ছে...' 
                        : hasAttended 
                            ? <><Check className="mr-2 h-4 w-4" />অ্যাটেন্ডেড</> 
                            : (isAttendanceOver ? 'সময় শেষ' : 'সেশনে যোগ দিন')}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                       <span className="block sm:inline">এর জন্য অ্যাটেনডেন্স চিহ্নিত করুন </span>
                       <span className="block sm:inline font-semibold">"{session.title}"</span>
                    </DialogTitle>
                </DialogHeader>
                <AttendanceForm session={session} onAttendanceMarked={() => setIsAttendOpen(false)} />
            </DialogContent>
        </Dialog>
        
        {canManageSession && (
             <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <QrCode className="mr-2 h-4 w-4" />
                        কোড দেখান
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xs">
                     <DialogHeader>
                        <DialogTitle>অ্যাটেন্ড করতে স্ক্যান করুন</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center p-4">
                        <Image src={qrCodeUrl} alt={`QR Code for ${session.title}`} width={200} height={200} />
                        <p className="mt-4 text-lg font-semibold tracking-widest">{session.attendanceCode}</p>
                        <p className="text-sm text-muted-foreground">অথবা উপরের কোডটি ব্যবহার করুন</p>
                    </div>
                </DialogContent>
            </Dialog>
        )}
      </CardFooter>
    </Card>
  );
}
