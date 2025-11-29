'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore, useUser } from '@/firebase';
import { doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { v4 as uuidv4 } from 'uuid';

const attendanceSchema = z.object({
  attendanceCode: z.string().length(6, { message: "Code must be 6 characters." }),
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

  const onSubmit: SubmitHandler<AttendanceFormData> = async (data) => {
    if (!firestore || !user) return;

    if (data.attendanceCode.toUpperCase() !== session.attendanceCode.toUpperCase()) {
        toast({
            variant: "destructive",
            title: "Invalid Code",
            description: "The attendance code is incorrect. Please try again.",
        });
        return;
    }
    
    const recordId = uuidv4();
    const attendanceRecordRef = doc(firestore, `attendanceSessions/${session.id}/attendanceRecords`, recordId);

    const recordData = {
        id: recordId,
        sessionId: session.id,
        userId: user.uid,
        timestamp: serverTimestamp(),
        geolocation: '', // Geolocation can be added in the future
    };

    setDoc(attendanceRecordRef, recordData)
      .then(() => {
        toast({
          title: "Attendance Marked!",
          description: "Your attendance has been successfully recorded.",
        });
        onAttendanceMarked();
      })
      .catch((error) => {
        if (error.code && error.code.startsWith('permission-denied')) {
          const permissionError = new FirestorePermissionError({
            path: attendanceRecordRef.path,
            operation: 'create',
            requestResourceData: recordData,
          });
          errorEmitter.emit('permission-error', permissionError);
        } else {
          toast({
            variant: "destructive",
            title: "Failed to mark attendance",
            description: error.message,
          });
        }
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
              <FormLabel>Enter 6-Character Attendance Code</FormLabel>
              <FormControl>
                <Input placeholder="ABCXYZ" {...field} maxLength={6} className="uppercase tracking-widest text-center" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Submitting...' : 'Submit Attendance'}
        </Button>
      </form>
    </Form>
  );
}
