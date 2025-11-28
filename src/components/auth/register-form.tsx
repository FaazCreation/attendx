'use client';

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
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const registerSchema = z.object({
  memberId: z.string().min(1, { message: "Member ID is required." }),
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  department: z.string().min(1, { message: "Department is required." }),
  session: z.string().min(1, { message: "Session is required." }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
        memberId: '',
        name: '',
        email: '',
        password: '',
        department: '',
        session: '',
    }
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: data.name,
      });
      
      const userDocRef = doc(firestore, 'users', user.uid);
      const userData = {
        id: data.memberId,
        uid: user.uid,
        name: data.name,
        email: data.email,
        department: data.department,
        batch: data.session,
        role: 'General Member',
        photoURL: '',
        eventParticipationScore: 0
      };

      // The user is now authenticated, so this setDoc call will be allowed by security rules.
      await setDoc(userDocRef, userData);

      toast({
        title: "Account created!",
        description: "You have been successfully registered.",
      });

      router.push('/login');

    } catch (error: any) {
       // The 'any' type is used here because Firebase can throw different kinds of errors.
       // We'll check if it's a Firestore error and emit it, otherwise show a generic toast.
       if (error.code && error.code.startsWith('permission-denied')) {
          const userDocRef = doc(firestore, 'users', auth.currentUser!.uid);
          const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'create',
            requestResourceData: 'hidden', // Data can be hidden for privacy
          });
          errorEmitter.emit('permission-error', permissionError);
       } else {
         toast({
          variant: "destructive",
          title: "Registration failed",
          description: error.message,
        });
       }
    }
  };


  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader className="space-y-1 text-center">
        <AttendXIcon className="mx-auto h-12 w-12 text-primary" />
        <CardTitle className="text-2xl font-bold font-headline">Create an Account</CardTitle>
        <CardDescription>
          Join AttendX to manage your attendance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
                control={form.control}
                name="memberId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Member ID</FormLabel>
                        <FormControl>
                            <Input placeholder="Your Member ID" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
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
             <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., CSE" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="session"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Session</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., 2021-2022" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="underline hover:text-primary">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
