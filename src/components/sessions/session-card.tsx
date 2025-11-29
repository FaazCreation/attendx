'use client';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Clock, QrCode, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { AttendanceForm } from "./attendance-form";
import { useMemo, useState } from "react";
import { useFirestore, useUser } from "@/firebase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { doc, deleteDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';

type Session = {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  attendanceCode: string;
};

type AttendanceRecord = {
    id: string;
    sessionId: string;
    userId: string;
}

type UserRole = 'Admin' | 'Executive Member' | 'General Member';

interface SessionCardProps {
  session: Session;
  userRole: UserRole;
  attendanceRecords: AttendanceRecord[];
}

const formatTime = (timeString: string) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const h = parseInt(hours, 10);
  const m = parseInt(minutes, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const formattedHours = h % 12 || 12; 
  return `${formattedHours.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
};

const getSessionTypeInBangla = (type: string) => {
  switch(type) {
    case 'General Meeting': return 'সাধারণ সভা';
    case 'AGM': return 'এজিএম';
    case 'Event': return 'ইভেন্ট';
    case 'Workshop': return 'কর্মশালা';
    default: return type;
  }
}

export function SessionCard({ session, userRole, attendanceRecords }: SessionCardProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isAttendOpen, setIsAttendOpen] = useState(false);

    const isAdmin = userRole === 'Admin';
    const isExecutive = userRole === 'Executive Member';
    const isGeneralMember = userRole === 'General Member';

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${session.attendanceCode}`;
    const formattedTime = formatTime(session.time);

    const hasAttended = useMemo(() => {
        if (!user) return false;
        return attendanceRecords.some(record => record.sessionId === session.id && record.userId === user.uid);
    }, [attendanceRecords, session.id, user]);
    
    const handleDelete = () => {
        if (!firestore) return;
        const sessionDocRef = doc(firestore, 'attendanceSessions', session.id);
        
        deleteDoc(sessionDocRef)
            .then(() => {
                toast({
                    title: "সেশন মুছে ফেলা হয়েছে",
                    description: `"${session.title}" সেশনটি সরানো হয়েছে।`,
                });
            })
            .catch((error) => {
                const permissionError = new FirestorePermissionError({
                    path: sessionDocRef.path,
                    operation: 'delete',
                });
                errorEmitter.emit('permission-error', permissionError);
                 toast({
                    variant: 'destructive',
                    title: 'মুছে ফেলতে ব্যর্থ',
                    description: 'এই সেশনটি মুছে ফেলার অনুমতি আপনার নেই।',
                });
            });
    };

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
          <span>{format(new Date(session.date), 'PPPP', { locale: bn })}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-2 h-4 w-4" />
          <span>{formattedTime}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {isGeneralMember && (
            <Dialog open={isAttendOpen} onOpenChange={setIsAttendOpen}>
                <DialogTrigger asChild>
                    <Button disabled={hasAttended} className="w-full">
                        {hasAttended ? <><Check className="mr-2 h-4 w-4" />অ্যাটেন্ডেড</> : 'সেশনে যোগ দিন'}
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
        )}
        
        {(isAdmin || isExecutive) && (
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

        {isAdmin && (
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">সেশন মুছুন</span>
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>আপনি কি পুরোপুরি নিশ্চিত?</AlertDialogTitle>
                    <AlertDialogDescription>
                        এই কাজটি আর বাতিল করা যাবে না। এটি স্থায়ীভাবে
                        <span className="font-semibold"> {session.title} </span> 
                        সেশন এবং এর সমস্ত অ্যাটেনডেন্স রেকর্ড মুছে ফেলবে।
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>বাতিল</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>চালিয়ে যান</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
}
