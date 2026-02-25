'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { v4 as uuidv4 } from 'uuid';

const sessionSchema = z.object({
  title: z.string().min(1, { message: "শিরোনাম আবশ্যক।" }),
  description: z.string().optional(),
  date: z.date({
    required_error: "একটি তারিখ আবশ্যক।",
  }),
  time: z.string().min(1, { message: "সময় আবশ্যক।" }),
});

type SessionFormData = z.infer<typeof sessionSchema>;

const generateAttendanceCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

export function CreateSessionForm({ onSessionCreated }: { onSessionCreated: () => void }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const form = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
        title: '',
        description: '',
        time: '',
    }
  });

  const onSubmit: SubmitHandler<SessionFormData> = (data) => {
    if (!firestore || !user) {
        toast({
            variant: "destructive",
            title: "ত্রুটি",
            description: "ব্যবহারকারী লগইন করা নেই।",
        });
        return;
    }
    
    const sessionId = uuidv4();
    const attendanceCode = generateAttendanceCode();
    const sessionDocRef = doc(firestore, 'attendanceSessions', sessionId);
    
    const sessionDateTime = new Date(data.date);
    const [hours, minutes] = data.time.split(':');
    sessionDateTime.setHours(parseInt(hours), parseInt(minutes));

    const sessionData = {
      title: data.title,
      description: data.description || '',
      id: sessionId,
      adminId: user.uid,
      attendanceCode,
      qrCodeURL: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${attendanceCode}`,
      createdAt: new Date().toISOString(),
      date: sessionDateTime.toISOString(),
      time: data.time
    };

    setDoc(sessionDocRef, sessionData)
      .then(() => {
        toast({
          title: "সেশন তৈরি হয়েছে",
          description: `"${data.title}" সেশনটি সফলভাবে তৈরি করা হয়েছে।`,
        });
        form.reset();
        onSessionCreated();
      })
      .catch((e: any) => {
        const permissionError = new FirestorePermissionError({
          path: sessionDocRef.path,
          operation: 'create',
          requestResourceData: sessionData,
        });
        errorEmitter.emit('permission-error', permissionError);

        toast({
          variant: 'destructive',
          title: "সেশন তৈরিতে ব্যর্থ",
          description: "সেশন তৈরি করার সময় একটি ত্রুটি হয়েছে৷ আপনার অনুমতি আছে কিনা তা পরীক্ষা করুন।",
        });
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>শিরোনাম</FormLabel>
              <FormControl>
                <Input placeholder="যেমনঃ মাসিক সভা" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="সেশনের বিবরণ (ঐচ্ছিক)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>তারিখ নির্বাচন করুন</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0,0,0,0)) 
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>সময়</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'তৈরি করা হচ্ছে...' : 'সেশন তৈরি করুন'}
        </Button>
      </form>
    </Form>
  );
}