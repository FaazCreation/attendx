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
import { Label } from '@/components/ui/label';
import { TCPCIcon } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
       // Check if user document exists, if not, create it
      const userRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          role: "General Member", // Default role
          department: "",
          batch: ""
        });
      }
      // Let the useEffect handle redirection
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Sign-in failed",
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

        <Separator className="my-4" />

        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSubmitting || isUserLoading}>
          <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.242,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
          Sign In with Google
        </Button>
        
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
