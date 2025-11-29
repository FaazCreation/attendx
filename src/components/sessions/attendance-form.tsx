'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore, useUser } from '@/firebase';
import { serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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
  
  const { formState: { isSubmitting } } = form;

  const onSubmit: SubmitHandler<AttendanceFormData> = (data) => {
    if (!firestore || !user) return;

    if (data.attendanceCode.toUpperCase() !== session.attendanceCode.toUpperCase()) {
        toast({
            variant: "destructive",
            title: "Invalid Code",
            description: "The attendance code is incorrect. Please try again.",
        });
        // Manually re-enable form if code is wrong
        form.reset(form.getValues()); 
        return;
    }
    
    const attendanceRecordsColRef = collection(firestore, `attendanceSessions/${session.id}/attendanceRecords`);

    const recordData = {
        sessionId: session.id,
        userId: user.uid,
        timestamp: serverTimestamp(),
        geolocation: '', // Geolocation can be added in the future
    };

    addDoc(attendanceRecordsColRef, recordData)
      .then(() => {
        toast({
          title: "Attendance Marked!",
          description: "Your attendance has been successfully recorded.",
        });
        onAttendanceMarked();
      })
      .catch((error: any) => {
        const permissionError = new FirestorePermissionError({
            path: attendanceRecordsColRef.path,
            operation: 'create',
            requestResourceData: recordData,
        });
        errorEmitter.emit('permission-error', permissionError);

        toast({
            variant: "destructive",
            title: "Failed to mark attendance",
            description: "Please check permissions or try again later.",
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
              <FormLabel>Enter 6-Character Attendance Code</FormLabel>
              <FormControl>
                <Input placeholder="ABCXYZ" {...field} maxLength={6} className="uppercase tracking-widest text-center" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
        </Button>
      </form>
    </Form>
  );
}
