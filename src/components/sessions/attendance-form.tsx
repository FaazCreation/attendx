
'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore, useUser } from '@/firebase';
import { serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const attendanceSchema = z.object({
  attendanceCode: z.string().length(6, { message: "কোড অবশ্যই ৬ অক্ষরের হতে হবে।" }),
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

interface AttendanceFormProps {
  session: {
    id: string;
    attendanceCode: string;
  };
  onAttendanceMarked: () => void;
}

export function AttendanceForm({ session, onAttendanceMarked }: AttendanceFormProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const form = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      attendanceCode: '',
    }
  });
  
  const { formState: { isSubmitting } } = form;

  const onSubmit: SubmitHandler<AttendanceFormData> = (data) => {
    if (!firestore || !user) return;

    if (data.attendanceCode.toUpperCase() !== session.attendanceCode.toUpperCase()) {
        toast({
            variant: "destructive",
            title: "অবৈধ কোড",
            description: "অ্যাটেনডেন্স কোডটি ভুল। অনুগ্রহ করে আবার চেষ্টা করুন।",
        });
        form.reset(form.getValues()); 
        return;
    }
    
    const attendanceRecordRef = doc(firestore, `attendanceSessions/${session.id}/attendanceRecords`, user.uid);

    const recordData = {
        sessionId: session.id,
        userId: user.uid,
        timestamp: serverTimestamp(),
        geolocation: '', 
    };

    setDoc(attendanceRecordRef, recordData)
      .then(() => {
        toast({
          title: "অ্যাটেন্ডেন্স চিহ্নিত!",
          description: "আপনার অ্যাটেনডেন্স সফলভাবে রেকর্ড করা হয়েছে।",
        });
        onAttendanceMarked();
      })
      .catch((error: any) => {
        const permissionError = new FirestorePermissionError({
            path: attendanceRecordRef.path,
            operation: 'create',
            requestResourceData: recordData,
        });
        errorEmitter.emit('permission-error', permissionError);

        toast({
            variant: "destructive",
            title: "অ্যাটেনডেন্স চিহ্নিত করতে ব্যর্থ",
            description: "আপনি হয়তো ইতিমধ্যে অ্যাটেন্ড করেছেন অথবা আপনার অনুমতি নেই।",
        });
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="attendanceCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>৬-অক্ষরের অ্যাটেনডেন্স কোড লিখুন</FormLabel>
              <FormControl>
                <Input placeholder="ABCXYZ" {...field} maxLength={6} className="uppercase tracking-widest text-center" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'জমা দেওয়া হচ্ছে...' : 'অ্যাটেনডেন্স জমা দিন'}
        </Button>
      </form>
    </Form>
  );
}
