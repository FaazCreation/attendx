"use client";

import Link from 'next/link';
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
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "অবৈধ ইমেইল ঠিকানা।" }),
  password: z.string().min(6, { message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const {formState: { isSubmitting }} = form;

  useEffect(() => {
    if (!isUserLoading && user) {
        // Redirect to dashboard page after login.
        router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);


  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    if (data.email.toLowerCase() === 'fh7614@gmail.com') {
        toast({
            variant: "destructive",
            title: "অ্যাডমিন লগইন",
            description: "অ্যাডমিন হিসেবে লগইন করতে /admin/login পৃষ্ঠায় যান।",
        });
        return;
    }

    try {
      if(!auth) return;
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({
        title: "লগইন সফল হয়েছে",
        description: "আপনাকে স্বাগতম!",
      });
      // The useEffect will handle the redirection.
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
          <CardTitle className="text-2xl font-bold">AttendX</CardTitle>
          <CardDescription>
            অ্যাটেনডেন্স এবং ক্লাব কার্যক্রম পরিচালনা করতে সাইন ইন করুন
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
                  <FormLabel>ইমেইল</FormLabel>
                  <FormControl>
                    <Input placeholder="member@tcpc.com" {...field} />
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
                      <Input type={showPassword ? "text" : "password"} {...field} />
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
              {isSubmitting || isUserLoading ? 'সাইন ইন করা হচ্ছে...' : 'সাইন ইন করুন'}
            </Button>
          </form>
        </Form>
        
        <div className="mt-4 text-center text-sm">
          আপনার কি অ্যাকাউন্ট নেই?{' '}
          <Link href="/register" className="underline hover:text-primary">
            সাইন আপ করুন
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
