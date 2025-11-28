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
import { TCPCIcon } from '@/components/icons';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

const registerSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  department: z.string().min(1, { message: "Department is required." }),
  batch: z.string().min(1, { message: "Batch is required." }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
        name: '',
        email: '',
        password: '',
        department: '',
        batch: '',
    }
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: data.name,
      });

      await setDoc(doc(firestore, 'users', user.uid), {
        id: user.uid,
        name: data.name,
        email: data.email,
        department: data.department,
        batch: data.batch,
        role: 'General Member', // All new sign-ups are General Members
        photoURL: '',
        eventParticipationScore: 0
      });

      toast({
        title: "Account created!",
        description: "You have been successfully registered.",
      });

      router.push('/login');

    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message,
      });
    }
  };


  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader className="space-y-1 text-center">
        <TCPCIcon className="mx-auto h-12 w-12 text-primary" />
        <CardTitle className="text-2xl font-bold font-headline">Create an Account</CardTitle>
        <CardDescription>
          Join TCPC Connect to manage your attendance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        <FormControl>
                            <Input type="password" {...field} />
                        </FormControl>
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
                name="batch"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Batch</FormLabel>
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
