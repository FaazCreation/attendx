'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().optional(),
  date: z.date({
    required_error: "A date is required.",
  }),
  time: z.string().min(1, { message: "Time is required." }),
  type: z.enum(["General Meeting", "AGM", "Event", "Workshop"]),
});

type SessionFormData = z.infer<typeof sessionSchema>;

// Function to generate a random 6-character alphanumeric code
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
  const { toast } = useToast();

  const form = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
        title: '',
        description: '',
        time: '',
    }
  });

  const onSubmit: SubmitHandler<SessionFormData> = async (data) => {
    if (!firestore) return;
    
    const sessionId = uuidv4();
    const attendanceCode = generateAttendanceCode();
    const sessionDocRef = doc(collection(firestore, 'attendanceSessions'), sessionId);

    const sessionData = {
      ...data,
      id: sessionId,
      attendanceCode,
      date: format(data.date, "yyyy-MM-dd'T'00:00:00"), // Store date as a string in a consistent format
      qrCodeURL: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${attendanceCode}`,
      createdAt: serverTimestamp(),
    };

    setDoc(sessionDocRef, sessionData)
      .then(() => {
        toast({
          title: "Session Created",
          description: `The session "${data.title}" has been successfully created.`,
        });
        onSessionCreated();
      })
      .catch((error) => {
        const permissionError = new FirestorePermissionError({
            path: sessionDocRef.path,
            operation: 'create',
            requestResourceData: sessionData,
        });
        errorEmitter.emit('permission-error', permissionError);
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
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Monthly Meeting" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief description of the session" {...field} />
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
              <FormLabel>Date</FormLabel>
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
                        <span>Pick a date</span>
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
              <FormLabel>Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a session type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value="General Meeting">General Meeting</SelectItem>
                    <SelectItem value="AGM">AGM</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Creating...' : 'Create Session'}
        </Button>
      </form>
    </Form>
  );
}
