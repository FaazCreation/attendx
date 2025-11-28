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
import { TCPCIcon } from '@/components/icons';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

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
        const checkAdmin = async () => {
            const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
            const docSnap = await getDoc(adminRoleRef);
            if (docSnap.exists()) {
                router.push('/dashboard');
            } else {
                // If not an admin, maybe redirect to a different page or show a message
                // For now, we will just keep them on a generic page if they are not an admin
                // but successfully logged in. A real app might have a /home for general users.
                // Since we only have /dashboard which is admin-only, we redirect non-admins
                // back to login after they sign in.
                 toast({
                    title: "Login Successful",
                    description: "You are logged in, but not an admin.",
                });
                // In a real app, you would likely have a page for non-admins to go to.
                // For this example, we'll log them out or redirect to a non-admin page if one existed.
                router.push('/login');
            }
        };
        checkAdmin();
    }
  }, [user, isUserLoading, router, firestore, toast]);


  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // Let the useEffect handle redirection
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message,
      });
    }
  };

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader className="space-y-1 text-center">
        <TCPCIcon className="mx-auto h-12 w-12 text-primary" />
        <CardTitle className="text-2xl font-bold font-headline">TCPC Connect</CardTitle>
        <CardDescription>
          Sign in to manage attendance and club activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting || isUserLoading}>
              {isSubmitting || isUserLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Form>
        
        <div className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <Link href="/register" className="underline hover:text-primary">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
