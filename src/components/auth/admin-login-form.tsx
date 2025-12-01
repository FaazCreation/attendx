"use client";

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AttendXIcon } from '@/components/icons';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Eye, EyeOff } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';


const adminLoginSchema = z.object({
  email: z.string().email({ message: "অবৈধ ইমেইল ঠিকানা।" }),
  password: z.string().min(1, { message: "পাসওয়ার্ড আবশ্যক।" }),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

export function AdminLoginForm() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: 'fh7614@gmail.com',
      password: ''
    }
  });
  const { formState: { isSubmitting } } = form;

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const onSubmit: SubmitHandler<AdminLoginFormData> = async (data) => {
    if (data.email.toLowerCase() !== 'fh7614@gmail.com' || data.password !== 'Forhad@2020') {
      toast({
        variant: "destructive",
        title: "সাইন ইন ব্যর্থ হয়েছে",
        description: "আপনার ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।",
      });
      return;
    }

    try {
      if(!auth || !firestore) return;
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      
      const adminRoleRef = doc(firestore, 'roles_admin', userCredential.user.uid);
      
      try {
        const adminDoc = await getDoc(adminRoleRef);
        if (!adminDoc.exists()) {
            throw new Error("User is not an admin.");
        }
      } catch (error) {
         const permissionError = new FirestorePermissionError({
            path: adminRoleRef.path,
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        return;
      }
      
      toast({
        title: "অ্যাডমিন লগইন সফল",
        description: "অ্যাডমিন ড্যাশবোর্ডে আপনাকে স্বাগতম!",
      });
      router.push('/dashboard');

    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "সাইন ইন ব্যর্থ হয়েছে",
        description: "আপনার ইমেইল এবং পাসওয়ার্ড চেক করুন।",
      });
    }
  };

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader className="space-y-1 text-center">
        <AttendXIcon className="mx-auto h-12 w-12 text-primary" />
        <div className="font-headline">
          <CardTitle className="text-2xl font-bold">অ্যাডমিন প্যানেল</CardTitle>
          <CardDescription>
            অ্যাডমিন হিসেবে লগইন করুন
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>অ্যাডমিন ইমেইল</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>পাসওয়ার্ড</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input type={showPassword ? "text" : "password"} {...field} placeholder="আপনার পাসওয়ার্ড দিন" />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting || isUserLoading}>
              {isSubmitting || isUserLoading ? 'লগইন করা হচ্ছে...' : 'লগইন করুন'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
